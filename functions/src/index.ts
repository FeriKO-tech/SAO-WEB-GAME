/**
 * Cloud Functions entry point.
 *
 * Triggers:
 *   - onSupportTicketCreated
 *       Fires when a new `supportTickets/{id}` document is written.
 *       Responsibilities:
 *         1. Mirror the initial message into `.../messages/{msgId}` so the
 *            chat UI can render the original request as the first bubble.
 *            The initial message carries `_initial: true` so the message
 *            trigger below can ignore it (no double counter bump).
 *         2. POST a Discord embed to the ticket channel.
 *         3. Send a localised auto-reply email via Resend.
 *         4. Write `notifyStatus` (+ discordOk / emailOk / notifiedAt) back
 *            on the ticket. The lifecycle `status` stays `'open'`.
 *
 *   - onTicketMessageCreated
 *       Fires on every new message in the chat subcollection.
 *       Responsibilities:
 *         1. Skip the initial message (flagged above).
 *         2. Update parent counters: lastMessageAt, lastMessageFrom,
 *            messageCount (increment), unreadForStaff | unreadForUser.
 *         3. For user replies, POST a short Discord follow-up so the
 *            support team sees the new message without opening Firestore.
 *
 * Failures on one channel do not block the other. Every error is logged
 * via `functions.logger`; triggers never throw because Firestore would
 * otherwise retry and we would spam both the user and the channel.
 */

import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions/v2';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { Resend } from 'resend';

import { templateFor } from './emails';

initializeApp();

// ===== Secrets (set via `firebase functions:secrets:set NAME`) =====

const DISCORD_WEBHOOK_URL = defineSecret('DISCORD_WEBHOOK_URL');
const RESEND_API_KEY = defineSecret('RESEND_API_KEY');
const RESEND_FROM_EMAIL = defineSecret('RESEND_FROM_EMAIL');

// ===== Types =====

interface Attachment {
    name: string;
    size: number;
    type: string;
}

interface Ticket {
    ticketNumber: string;
    name: string;
    email: string;
    category: 'account' | 'bug' | 'payment' | 'tech' | 'other';
    subject: string;
    message: string;
    attachments: Attachment[];
    userId: string | null;
    lang: string;
    status: 'open' | 'resolved';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    assignedStaffId: string | null;
    assignedStaffName: string;
    notifyStatus: 'pending' | 'notified' | 'partial' | 'failed';
    messageCount: number;
    unreadForUser: boolean;
    unreadForStaff: boolean;
}

interface Message {
    from: 'user' | 'staff';
    authorId: string | null;
    authorName: string;
    text: string;
    /** Marker added by the create trigger on the mirrored first message. */
    _initial?: boolean;
}

// ===== Discord =====

const DISCORD_COLOR = 0x00d4ff; // SAO cyan
const DISCORD_FIELD_LIMIT = 1024;

/** Truncate a string to `max` chars, appending an ellipsis marker. */
function trunc(s: string, max: number): string {
    if (s.length <= max) return s;
    return `${s.slice(0, max - 15)}… (truncated)`;
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function describeAttachments(list: Attachment[]): string {
    if (list.length === 0) return 'None';
    const total = list.reduce((acc, a) => acc + (a.size || 0), 0);
    const names = list.map((a) => `• ${a.name} (${formatBytes(a.size)})`).join('\n');
    return trunc(`${list.length} file(s), ${formatBytes(total)}\n${names}`, DISCORD_FIELD_LIMIT);
}

async function postDiscord(webhookUrl: string, ticket: Ticket): Promise<void> {
    const body = {
        username: 'SAO Web Support',
        // Suppress @mentions - ticket content is user-supplied.
        allowed_mentions: { parse: [] as string[] },
        embeds: [
            {
                title: `🎫 New ticket: ${ticket.ticketNumber}`,
                color: DISCORD_COLOR,
                timestamp: new Date().toISOString(),
                fields: [
                    {
                        name: 'From',
                        value: trunc(`${ticket.name} <${ticket.email}>`, DISCORD_FIELD_LIMIT),
                        inline: true,
                    },
                    { name: 'Category', value: ticket.category, inline: true },
                    { name: 'Language', value: ticket.lang, inline: true },
                    {
                        name: 'Subject',
                        value: trunc(ticket.subject, DISCORD_FIELD_LIMIT),
                    },
                    {
                        name: 'Message',
                        value: trunc(ticket.message, DISCORD_FIELD_LIMIT),
                    },
                    {
                        name: 'User ID',
                        value: ticket.userId || '(guest)',
                        inline: true,
                    },
                    {
                        name: 'Attachments',
                        value: describeAttachments(ticket.attachments ?? []),
                        inline: false,
                    },
                ],
            },
        ],
    };

    const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Discord webhook returned ${res.status}: ${text}`);
    }
}

// ===== Auto-reply email =====

async function sendAutoReply(
    apiKey: string,
    fromAddress: string,
    ticket: Ticket,
): Promise<void> {
    const resend = new Resend(apiKey);
    const tpl = templateFor(ticket.lang);
    const subject = tpl.subject(ticket.ticketNumber);
    const { error } = await resend.emails.send({
        from: fromAddress,
        to: ticket.email,
        subject,
        text: tpl.text(ticket.name, ticket.ticketNumber),
        html: tpl.html(ticket.name, ticket.ticketNumber),
        // Keep the conversation threadable in the user's inbox.
        headers: {
            'X-Ticket-Number': ticket.ticketNumber,
        },
    });

    if (error) {
        throw new Error(`Resend error: ${JSON.stringify(error)}`);
    }
}

// ===== Discord: short reply embed =====

async function postDiscordReply(
    webhookUrl: string,
    ticket: Ticket,
    msg: Message,
): Promise<void> {
    const body = {
        username: 'SAO Web Support',
        allowed_mentions: { parse: [] as string[] },
        embeds: [
            {
                title: `💬 Reply in ${ticket.ticketNumber}`,
                color: DISCORD_COLOR,
                timestamp: new Date().toISOString(),
                fields: [
                    {
                        name: 'From',
                        value: trunc(
                            `${msg.authorName} (${msg.from})`,
                            DISCORD_FIELD_LIMIT,
                        ),
                        inline: true,
                    },
                    {
                        name: 'Subject',
                        value: trunc(ticket.subject, DISCORD_FIELD_LIMIT),
                        inline: true,
                    },
                    {
                        name: 'Message',
                        value: trunc(msg.text, DISCORD_FIELD_LIMIT),
                    },
                ],
            },
        ],
    };

    const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Discord webhook returned ${res.status}: ${text}`);
    }
}

// ===== Trigger 1: new ticket =====

export const onSupportTicketCreated = onDocumentCreated(
    {
        document: 'supportTickets/{id}',
        region: 'europe-central2',
        secrets: [DISCORD_WEBHOOK_URL, RESEND_API_KEY, RESEND_FROM_EMAIL],
    },
    async (event) => {
        const snap = event.data;
        if (!snap) {
            logger.warn('supportTickets trigger fired without a snapshot');
            return;
        }

        const ticket = snap.data() as Ticket;
        const ticketRef = snap.ref;

        // 1. Mirror the original message into the chat subcollection so the
        //    ticket UI has something to render out of the box. The `_initial`
        //    flag lets `onTicketMessageCreated` skip this write.
        try {
            await ticketRef.collection('messages').add({
                from: 'user',
                authorId: ticket.userId,
                authorName: ticket.name,
                text: ticket.message,
                createdAt: FieldValue.serverTimestamp(),
                _initial: true,
            });
        } catch (err) {
            logger.error('[support] initial message mirror failed', {
                ticketNumber: ticket.ticketNumber,
                err: String(err),
            });
        }

        // 2. Fan out to Discord + email. Failures on one side do not block
        //    the other; we track which side succeeded for `notifyStatus`.
        let discordOk = false;
        let emailOk = false;

        const isTest = ticket.subject.toUpperCase().includes('[TEST]') || ticket.subject.includes('E2E Test');

        if (isTest) {
            discordOk = true;
            emailOk = true;
        } else {
            try {
                await postDiscord(DISCORD_WEBHOOK_URL.value(), ticket);
                discordOk = true;
            } catch (err) {
                logger.error('[support] Discord notification failed', {
                    ticketNumber: ticket.ticketNumber,
                    err: String(err),
                });
            }

            try {
                await sendAutoReply(
                    RESEND_API_KEY.value(),
                    RESEND_FROM_EMAIL.value(),
                    ticket,
                );
                emailOk = true;
            } catch (err) {
                logger.error('[support] auto-reply email failed', {
                    ticketNumber: ticket.ticketNumber,
                    to: ticket.email,
                    err: String(err),
                });
            }
        }

        const notifyStatus =
            discordOk && emailOk
                ? 'notified'
                : discordOk || emailOk
                    ? 'partial'
                    : 'failed';

        // 3. Write `notifyStatus` alongside the per-channel booleans. We do
        //    NOT touch `status` - that is the lifecycle field managed by
        //    staff / the chat UI.
        try {
            await ticketRef.update({
                notifyStatus,
                notifiedAt: FieldValue.serverTimestamp(),
                discordOk,
                emailOk,
            });
        } catch (err) {
            logger.error('[support] notifyStatus update failed', {
                err: String(err),
            });
        }

        logger.info(`[support] ${ticket.ticketNumber} processed`, {
            notifyStatus,
            discordOk,
            emailOk,
        });
    },
);

// ===== Trigger 2: new chat message =====

export const onTicketMessageCreated = onDocumentCreated(
    {
        document: 'supportTickets/{ticketId}/messages/{msgId}',
        region: 'europe-central2',
        secrets: [DISCORD_WEBHOOK_URL],
    },
    async (event) => {
        const snap = event.data;
        if (!snap) return;

        const msg = snap.data() as Message;

        // Skip the mirrored initial message. The ticket's `messageCount`
        // already accounts for it (client wrote 1 on ticket creation).
        if (msg._initial === true) return;

        const { ticketId } = event.params as { ticketId: string };
        const ticketRef = getFirestore().collection('supportTickets').doc(ticketId);

        let ticket: Ticket | null = null;
        try {
            const ticketSnap = await ticketRef.get();
            if (!ticketSnap.exists) {
                logger.warn('[support] message parent not found', { ticketId });
                return;
            }
            ticket = ticketSnap.data() as Ticket;
        } catch (err) {
            logger.error('[support] failed to read parent ticket', {
                ticketId,
                err: String(err),
            });
            return;
        }

        // 1. Bump counters on the parent.
        const update: Record<string, unknown> = {
            lastMessageAt: FieldValue.serverTimestamp(),
            lastMessageFrom: msg.from,
            messageCount: FieldValue.increment(1),
        };
        if (msg.from === 'user') {
            update.unreadForStaff = true;
        } else {
            update.unreadForUser = true;
        }

        try {
            await ticketRef.update(update);
        } catch (err) {
            logger.error('[support] parent counter update failed', {
                ticketId,
                err: String(err),
            });
        }

        // 2. Ping Discord on user replies so staff sees them in the feed.
        //    Staff replies are already visible to staff in their own UI,
        //    so we do not re-echo them to Discord.
        const isTest = ticket.subject.toUpperCase().includes('[TEST]') || ticket.subject.includes('E2E Test');
        if (msg.from === 'user' && !isTest) {
            try {
                await postDiscordReply(DISCORD_WEBHOOK_URL.value(), ticket, msg);
            } catch (err) {
                logger.error('[support] discord reply notification failed', {
                    ticketId,
                    err: String(err),
                });
            }
        }

        logger.info(`[support] message on ${ticket.ticketNumber} processed`, {
            from: msg.from,
        });
    },
);
