/**
 * Support tickets: submission, live subscriptions, chat replies.
 *
 * Model:
 *   supportTickets/{id}                  - header (owner, status, counters)
 *   supportTickets/{id}/messages/{msgId} - chat messages (user + staff)
 *
 * The client writes only:
 *   - the ticket header (on submit)
 *   - reply messages from the current user into their own ticket
 *   - `unreadForUser: false` to mark their own copy as read
 *
 * Everything else (status transitions, unread-for-staff flips, cross-role
 * writes, message count, notify status) is handled by Cloud Functions and
 * Admin-SDK writes - see `functions/src/index.ts`.
 *
 * Staff-role helpers in this file (`staffUpdateStatus`, `sendStaffMessage`)
 * rely on Firebase Auth custom claims (`role in ['staff','admin']`) so that
 * the same Firestore rules allow those writes.
 */

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    FirestoreError,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { auth, db, storage } from './firebase';
import { formatUserDisplayName, currentUser } from './auth';

/** Public-facing attachment descriptor (metadata only; no bytes uploaded). */
export interface TicketAttachment {
    name: string;
    url: string;
    size: number;
    type: string;
}

/** Shape of the payload passed to `submitSupportTicket`. */
export interface TicketInput {
    name: string;
    email: string;
    category: 'account' | 'bug' | 'payment' | 'tech' | 'other';
    subject: string;
    message: string;
    attachments: TicketAttachment[];
    lang: string;
}

/** Result of a support ticket submission attempt. */
export type TicketResult =
    | { ok: true; ticketNumber: string }
    | { ok: false; reason: 'invalid' | 'network' | 'permission' | 'unknown' };

/** Human-readable ticket id shown to the user. */
function makeTicketNumber(): string {
    return `T-${Date.now().toString(36).toUpperCase()}`;
}

const MAX_NAME = 80;
const MAX_EMAIL = 254;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;
const MAX_ATTACHMENTS = 5;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Lightweight validation that mirrors the Firestore rules. */
function isValidInput(input: TicketInput): boolean {
    if (!input.name || input.name.length > MAX_NAME) return false;
    if (!EMAIL_RE.test(input.email) || input.email.length > MAX_EMAIL) return false;
    if (!input.subject || input.subject.length > MAX_SUBJECT) return false;
    if (!input.message || input.message.length > MAX_MESSAGE) return false;
    if (input.attachments.length > MAX_ATTACHMENTS) return false;
    return true;
}

/**
 * Submit a new support ticket.
 *
 * @returns `{ ok: true, ticketNumber }` on success, or an error reason the
 *          caller can translate into a user-friendly message.
 */
export async function uploadTicketAttachment(file: File, ticketId: string): Promise<TicketAttachment | null> {
    try {
        const u = auth.currentUser;
        if (!u) return null;

        const fileExt = file.name.split('.').pop() || '';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `tickets/${ticketId}/${fileName}`;
        const storageRef = ref(storage, filePath);

        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        return {
            name: file.name,
            url,
            size: file.size,
            type: file.type,
        };
    } catch (err) {
        console.error('[support] uploadTicketAttachment failed', err);
        return null;
    }
}

export async function submitSupportTicket(input: TicketInput): Promise<TicketResult> {
    if (!isValidInput(input)) return { ok: false, reason: 'invalid' };

    const ticketNumber = makeTicketNumber();
    const uid = auth.currentUser?.uid ?? null;

    try {
        await addDoc(collection(db, 'supportTickets'), {
            ticketNumber,
            name: input.name.trim(),
            email: input.email.trim().toLowerCase(),
            category: input.category,
            subject: input.subject.trim(),
            message: input.message.trim(),
        attachments: input.attachments.map((a) => ({
            name: a.name,
            url: a.url,
            size: a.size,
            type: a.type,
        })),
            userId: uid,
            lang: input.lang,
            // Lifecycle: 'open' (active) | 'resolved' (closed by staff).
            status: 'open',
            // Priority starts at 'normal'; staff can raise or lower it later.
            priority: 'normal',
            assignedStaffId: null,
            assignedStaffName: '',
            // Fan-out status tracked by the Cloud Function (Discord + email).
            notifyStatus: 'pending',
            // Chat / message-tracking fields. The first message is mirrored into
            // `supportTickets/{id}/messages/{msgId}` by the Cloud Function, so
            // the initial unread flag for staff is true right away.
            lastMessageAt: serverTimestamp(),
            lastMessageFrom: 'user',
            messageCount: 1,
            unreadForUser: false,
            unreadForStaff: true,
            createdAt: serverTimestamp(),
        });
        return { ok: true, ticketNumber };
    } catch (err) {
        const code = (err as FirestoreError).code ?? '';
        if (code === 'permission-denied') {
            return { ok: false, reason: 'permission' };
        }
        if (code === 'unavailable' || code === 'deadline-exceeded') {
            return { ok: false, reason: 'network' };
        }
        console.error('[support] submitSupportTicket failed', err);
        return { ok: false, reason: 'unknown' };
    }
}

// ===== Chat types =====

export type TicketStatus = 'open' | 'resolved';
export type TicketCategory = 'account' | 'bug' | 'payment' | 'tech' | 'other';
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';
export type MessageSender = 'user' | 'staff';

/** Full ticket header as read from Firestore. */
export interface Ticket {
    id: string;
    ticketNumber: string;
    name: string;
    email: string;
    category: TicketCategory;
    subject: string;
    message: string;
    attachments: TicketAttachment[];
    userId: string | null;
    lang: string;
    status: TicketStatus;
    priority: TicketPriority;
    assignedStaffId: string | null;
    assignedStaffName: string;
    notifyStatus: 'pending' | 'notified' | 'partial' | 'failed';
    lastMessageAt: Date | null;
    lastMessageFrom: MessageSender;
    messageCount: number;
    unreadForUser: boolean;
    unreadForStaff: boolean;
    createdAt: Date | null;
}

/** Chat message inside a ticket. */
export interface TicketMessage {
    id: string;
    from: MessageSender;
    authorId: string | null;
    authorName: string;
    text: string;
    attachments?: TicketAttachment[];
    createdAt: Date | null;
}

export interface TicketInternalNote {
    id: string;
    authorId: string | null;
    authorName: string;
    text: string;
    createdAt: Date | null;
}

// ===== Decoders =====

function toDate(v: unknown): Date | null {
    if (v instanceof Timestamp) return v.toDate();
    if (v instanceof Date) return v;
    return null;
}

function decodeTicket(id: string, data: Record<string, unknown>): Ticket {
    return {
        id,
        ticketNumber: String(data.ticketNumber ?? ''),
        name: String(data.name ?? ''),
        email: String(data.email ?? ''),
        category: (data.category as TicketCategory) ?? 'other',
        subject: String(data.subject ?? ''),
        message: String(data.message ?? ''),
        attachments: Array.isArray(data.attachments)
            ? (data.attachments as TicketAttachment[])
            : [],
        userId: (data.userId as string | null) ?? null,
        lang: (data.lang as string) ?? 'EN',
        status: (data.status as TicketStatus) ?? 'open',
        priority: (data.priority as TicketPriority) ?? 'normal',
        assignedStaffId: (data.assignedStaffId as string | null) ?? null,
        assignedStaffName: String(data.assignedStaffName ?? ''),
        notifyStatus:
            (data.notifyStatus as Ticket['notifyStatus']) ?? 'pending',
        lastMessageAt: toDate(data.lastMessageAt),
        lastMessageFrom: (data.lastMessageFrom as MessageSender) ?? 'user',
        messageCount: Number(data.messageCount ?? 1),
        unreadForUser: Boolean(data.unreadForUser),
        unreadForStaff: Boolean(data.unreadForStaff),
        createdAt: toDate(data.createdAt),
    };
}

function decodeMessage(id: string, data: Record<string, unknown>): TicketMessage {
    return {
        id,
        from: (data.from as MessageSender) ?? 'user',
        authorId: (data.authorId as string | null) ?? null,
        authorName: String(data.authorName ?? ''),
        text: String(data.text ?? ''),
        attachments: Array.isArray(data.attachments) ? data.attachments as TicketAttachment[] : undefined,
        createdAt: toDate(data.createdAt),
    };
}

function decodeInternalNote(id: string, data: Record<string, unknown>): TicketInternalNote {
    return {
        id,
        authorId: (data.authorId as string | null) ?? null,
        authorName: String(data.authorName ?? ''),
        text: String(data.text ?? ''),
        createdAt: toDate(data.createdAt),
    };
}

function sortTicketsByActivity(tickets: Ticket[]): Ticket[] {
    return [...tickets].sort((a, b) => {
        const aTime = a.lastMessageAt?.getTime() ?? 0;
        const bTime = b.lastMessageAt?.getTime() ?? 0;
        return bTime - aTime;
    });
}

// ===== Subscriptions =====

/**
 * Live list of tickets owned by the given user, newest activity first.
 * Calls `onData` on every change. Returns an `Unsubscribe` function.
 */
export function subscribeToUserTickets(
    uid: string,
    onData: (tickets: Ticket[]) => void,
    onError?: (err: FirestoreError) => void,
): Unsubscribe {
    const q = query(
        collection(db, 'supportTickets'),
        where('userId', '==', uid),
        limit(100),
    );
    return onSnapshot(
        q,
        (snap) => {
            const items = sortTicketsByActivity(snap.docs.map((d) =>
                decodeTicket(d.id, d.data() as Record<string, unknown>),
            ));
            onData(items);
        },
        onError,
    );
}

export function subscribeToTicketInternalNotes(
    ticketId: string,
    onData: (notes: TicketInternalNote[]) => void,
    onError?: (err: FirestoreError) => void,
): Unsubscribe {
    const q = query(
        collection(db, 'supportTickets', ticketId, 'internalNotes'),
        orderBy('createdAt', 'asc'),
        limit(200),
    );
    return onSnapshot(
        q,
        (snap) => {
            const items = snap.docs.map((d) =>
                decodeInternalNote(d.id, d.data() as Record<string, unknown>),
            );
            onData(items);
        },
        onError,
    );
}

/** Live read of a single ticket. Emits `null` if the doc is missing. */
export function subscribeToTicket(
    ticketId: string,
    onData: (ticket: Ticket | null) => void,
    onError?: (err: FirestoreError) => void,
): Unsubscribe {
    return onSnapshot(
        doc(db, 'supportTickets', ticketId),
        (snap) => {
            if (!snap.exists()) {
                onData(null);
                return;
            }
            onData(decodeTicket(snap.id, snap.data() as Record<string, unknown>));
        },
        onError,
    );
}

/** Live list of chat messages for a ticket, oldest first. */
export function subscribeToTicketMessages(
    ticketId: string,
    onData: (messages: TicketMessage[]) => void,
    onError?: (err: FirestoreError) => void,
): Unsubscribe {
    const q = query(
        collection(db, 'supportTickets', ticketId, 'messages'),
        orderBy('createdAt', 'asc'),
        limit(500),
    );
    return onSnapshot(
        q,
        (snap) => {
            const items = snap.docs.map((d) =>
                decodeMessage(d.id, d.data() as Record<string, unknown>),
            );
            onData(items);
        },
        onError,
    );
}

// ===== User writes =====

/** Clear the user's unread flag on a ticket they own. No-op on failure. */
export async function markTicketReadForUser(ticketId: string): Promise<void> {
    try {
        await updateDoc(doc(db, 'supportTickets', ticketId), {
            unreadForUser: false,
        });
    } catch (err) {
        console.warn('[support] markTicketReadForUser failed', err);
    }
}

/**
 * Append a user reply to one of their own tickets. The Cloud Function
 * `onTicketMessageCreated` trigger keeps the parent's counters + unread
 * flags in sync.
 */
export async function sendUserMessage(
    ticketId: string,
    text: string,
    attachments?: TicketAttachment[]
): Promise<TicketResult> {
    const user = auth.currentUser;
    if (!user) return { ok: false, reason: 'permission' };
    const trimmed = text.trim();
    if ((!trimmed && (!attachments || attachments.length === 0)) || trimmed.length > MAX_MESSAGE) {
        return { ok: false, reason: 'invalid' };
    }
    try {
        const profile = currentUser();
        const messageData: any = {
            from: 'user',
            authorId: user.uid,
            authorName: formatUserDisplayName(profile ?? {
                name: user.displayName ?? '',
                email: user.email ?? '',
            }),
            text: trimmed,
            createdAt: serverTimestamp(),
        };
        if (attachments && attachments.length > 0) {
            messageData.attachments = attachments;
        }
        await addDoc(
            collection(db, 'supportTickets', ticketId, 'messages'),
            messageData
        );
        return { ok: true, ticketNumber: ticketId };
    } catch (err) {
        const code = (err as FirestoreError).code ?? '';
        if (code === 'permission-denied') {
            return { ok: false, reason: 'permission' };
        }
        if (code === 'unavailable' || code === 'deadline-exceeded') {
            return { ok: false, reason: 'network' };
        }
        console.error('[support] sendUserMessage failed', err);
        return { ok: false, reason: 'unknown' };
    }
}

// ===== Staff writes (allowed by rules when the caller has role claim) =====

/** Live list of every ticket (staff-only). Ordered by most recent activity. */
export function subscribeToAllTickets(
    onData: (tickets: Ticket[]) => void,
    opts: { status?: TicketStatus } = {},
    onError?: (err: FirestoreError) => void,
): Unsubscribe {
    const q = opts.status
        ? query(
            collection(db, 'supportTickets'),
            where('status', '==', opts.status),
            limit(200),
        )
        : query(
            collection(db, 'supportTickets'),
            limit(200),
        );
    return onSnapshot(
        q,
        (snap) => {
            const items = sortTicketsByActivity(snap.docs.map((d) =>
                decodeTicket(d.id, d.data() as Record<string, unknown>),
            ));
            onData(items);
        },
        onError,
    );
}

/** Append a staff reply. The caller must have role `staff` or `admin`. */
export async function sendStaffMessage(
    ticketId: string,
    text: string,
    attachments?: TicketAttachment[]
): Promise<TicketResult> {
    const user = auth.currentUser;
    if (!user) return { ok: false, reason: 'permission' };
    const trimmed = text.trim();
    if ((!trimmed && (!attachments || attachments.length === 0)) || trimmed.length > MAX_MESSAGE) {
        return { ok: false, reason: 'invalid' };
    }
    try {
        const profile = currentUser();
        const messageData: any = {
            from: 'staff',
            authorId: user.uid,
            authorName: formatUserDisplayName(profile ?? {
                name: user.displayName ?? 'Support',
                email: user.email ?? '',
            }),
            text: trimmed,
            createdAt: serverTimestamp(),
        };
        if (attachments && attachments.length > 0) {
            messageData.attachments = attachments;
        }
        await addDoc(
            collection(db, 'supportTickets', ticketId, 'messages'),
            messageData
        );
        return { ok: true, ticketNumber: ticketId };
    } catch (err) {
        const code = (err as FirestoreError).code ?? '';
        if (code === 'permission-denied') {
            return { ok: false, reason: 'permission' };
        }
        if (code === 'unavailable' || code === 'deadline-exceeded') {
            return { ok: false, reason: 'network' };
        }
        console.error('[support] sendStaffMessage failed', err);
        return { ok: false, reason: 'unknown' };
    }
}

/** Staff: delete a ticket. */
export async function staffDeleteTicket(ticketId: string): Promise<void> {
    const hasRole = await hasStaffRole();
    if (!hasRole) throw new Error('Not authorized');

    const ticketRef = doc(db, 'supportTickets', ticketId);
    await deleteDoc(ticketRef);
}

/** Staff: change lifecycle status of a ticket. */
export async function staffUpdateStatus(
    ticketId: string,
    status: TicketStatus,
): Promise<void> {
    await updateDoc(doc(db, 'supportTickets', ticketId), { status });
}

/** Staff: change the priority of a ticket. */
export async function staffUpdatePriority(
    ticketId: string,
    priority: TicketPriority,
): Promise<void> {
    await updateDoc(doc(db, 'supportTickets', ticketId), { priority });
}

export async function staffUpdateAssignment(
    ticketId: string,
    assignedStaffId: string | null,
    assignedStaffName: string,
): Promise<void> {
    await updateDoc(doc(db, 'supportTickets', ticketId), {
        assignedStaffId,
        assignedStaffName,
    });
}

export async function staffAddInternalNote(
    ticketId: string,
    text: string,
): Promise<TicketResult> {
    const user = auth.currentUser;
    if (!user) return { ok: false, reason: 'permission' };
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > MAX_MESSAGE) {
        return { ok: false, reason: 'invalid' };
    }

    try {
        const profile = currentUser();
        await addDoc(
            collection(db, 'supportTickets', ticketId, 'internalNotes'),
            {
                authorId: user.uid,
                authorName: formatUserDisplayName(profile ?? {
                    name: user.displayName ?? 'Support',
                    email: user.email ?? '',
                }),
                text: trimmed,
                createdAt: serverTimestamp(),
            },
        );
        return { ok: true, ticketNumber: ticketId };
    } catch (err) {
        const code = (err as FirestoreError).code ?? '';
        if (code === 'permission-denied') {
            return { ok: false, reason: 'permission' };
        }
        if (code === 'unavailable' || code === 'deadline-exceeded') {
            return { ok: false, reason: 'network' };
        }
        console.error('[support] staffAddInternalNote failed', err);
        return { ok: false, reason: 'unknown' };
    }
}

/** Staff: clear the staff-side unread flag. */
export async function markTicketReadForStaff(ticketId: string): Promise<void> {
    try {
        await updateDoc(doc(db, 'supportTickets', ticketId), {
            unreadForStaff: false,
        });
    } catch (err) {
        console.warn('[support] markTicketReadForStaff failed', err);
    }
}

/**
 * Check whether the currently signed-in user has a staff role claim.
 * Returns false if no user or no role. Forces a token refresh once to catch
 * a freshly-granted claim without requiring sign-out / sign-in.
 */
export async function hasStaffRole(): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;
    const res = await user.getIdTokenResult(/* forceRefresh */ true);
    const role = (res.claims.role as string | undefined) ?? '';
    return role === 'staff' || role === 'admin';
}
