import {
    applyAnimationPref,
    auth,
    byId,
    byIdMaybe,
    currentUser,
    formatUserDisplayName,
    getCurrentLanguage,
    getUserProfileById,
    hasStaffRole,
    initI18n,
    initLangSwitcher,
    markTicketReadForStaff,
    markTicketReadForUser,
    onLanguageChange,
    registerTranslations,
    staffAddInternalNote,
    staffUpdateAssignment,
    sendStaffMessage,
    sendUserMessage,
    showToast,
    staffDeleteTicket,
    staffUpdatePriority,
    staffUpdateStatus,
    subscribeToTicket,
    subscribeToTicketInternalNotes,
    subscribeToTicketMessages,
    uploadTicketAttachment,
    whenAuthReady,
    type Ticket,
    type TicketInternalNote,
    type TicketAttachment,
    type TicketCategory,
    type TicketMessage,
    type TicketPriority,
    type TicketStatus,
} from '@lib';
import type { User } from '@models/user';
import { buildDict, ticketsTranslations } from '@translations';
import type { TicketsDict } from '@translations';

applyAnimationPref();
registerTranslations(buildDict('ticket'));
initI18n();

initLangSwitcher({
    switcher: byId('lang-switcher'),
    button: byId('lang-btn'),
    currentLabel: byIdMaybe('current-lang'),
});

const backLink = byId<HTMLAnchorElement>('ticket-back-link');
const stateEl = byId<HTMLDivElement>('ticket-state');
const screenEl = byId<HTMLElement>('ticket-screen');
const subjectEl = byId<HTMLDivElement>('ticket-subject');
const numberEl = byId<HTMLDivElement>('ticket-number');
const requesterEl = byId<HTMLDivElement>('ticket-requester');
const requesterPrimaryEl = byId<HTMLDivElement>('ticket-requester-primary');
const requesterSecondaryEl = byId<HTMLDivElement>('ticket-requester-secondary');
const statusEl = byId<HTMLSpanElement>('ticket-status');
const priorityBadgeEl = byId<HTMLSpanElement>('ticket-priority-badge');
const prioritySelectEl = byId<HTMLSelectElement>('ticket-priority-select');
const assignmentEl = byId<HTMLDivElement>('ticket-assignment');
const assignmentValueEl = byId<HTMLSpanElement>('ticket-assignment-value');
const assignSelfBtn = byId<HTMLButtonElement>('ticket-assign-self-btn');
const unassignBtn = byId<HTMLButtonElement>('ticket-unassign-btn');
const toggleStatusBtn = byId<HTMLButtonElement>('ticket-toggle-status');
const deleteBtn = byId<HTMLButtonElement>('ticket-delete-btn');
const messagesEl = byId<HTMLDivElement>('ticket-messages');
const notesSectionEl = byId<HTMLElement>('ticket-internal-notes');
const notesListEl = byId<HTMLDivElement>('ticket-notes-list');
const noteFormEl = byId<HTMLFormElement>('ticket-note-form');
const noteInputEl = byId<HTMLTextAreaElement>('ticket-note-input');
const noteSubmitBtn = byId<HTMLButtonElement>('ticket-note-submit');
const statusBarEl = byId<HTMLDivElement>('ticket-status-bar');
const formEl = byId<HTMLFormElement>('ticket-reply-form');
const inputEl = byId<HTMLTextAreaElement>('ticket-reply-input');
const sendBtn = byId<HTMLButtonElement>('ticket-send-btn');
const fileInputEl = byId<HTMLInputElement>('ticket-file-input');
const attachmentsListEl = byId<HTMLDivElement>('ticket-attachments-list');
const inputWrapperEl = document.querySelector('.chat-reply-input-wrapper') as HTMLDivElement;

const ticketId = new URLSearchParams(window.location.search).get('id')?.trim() ?? '';

const LOCALE_MAP = {
    RU: 'ru-RU',
    EN: 'en-US',
    DE: 'de-DE',
    FR: 'fr-FR',
    PL: 'pl-PL',
    ES: 'es-ES',
    CZ: 'cs-CZ',
    IT: 'it-IT',
    UA: 'uk-UA',
} as const;

let isStaff = false;
let ticket: Ticket | null = null;
let messages: TicketMessage[] = [];
let notes: TicketInternalNote[] = [];
let requesterProfile: User | null = null;
let requesterProfileUid: string | null = null;
let state: 'loading' | 'ready' | 'notfound' | 'forbidden' = ticketId ? 'loading' : 'notfound';
let ticketUnsub: (() => void) | null = null;
let messagesUnsub: (() => void) | null = null;
let notesUnsub: (() => void) | null = null;
let selectedFiles: File[] = [];

function dict(): TicketsDict {
    return ticketsTranslations[getCurrentLanguage()];
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function redirectToLogin(): void {
    const returnTo = `${window.location.pathname}${window.location.search}`;
    window.location.href = `login.html?returnTo=${encodeURIComponent(returnTo)}`;
}

function syncTitle(): void {
    const title = ticket?.subject?.trim() || dict().chatTitle;
    document.title = `${title} | Sword Art Online`;
}

function categoryLabel(category: TicketCategory): string {
    const d = dict();
    switch (category) {
        case 'account':
            return d.categoryAccount;
        case 'bug':
            return d.categoryBug;
        case 'payment':
            return d.categoryPayment;
        case 'tech':
            return d.categoryTech;
        default:
            return d.categoryOther;
    }
}

function statusLabel(status: TicketStatus): string {
    return status === 'resolved' ? dict().statusResolved : dict().statusOpen;
}

function statusClass(status: TicketStatus): string {
    return status === 'resolved' ? 'status-badge--resolved' : 'status-badge--open';
}

function priorityLabel(priority: TicketPriority): string {
    const d = dict();
    switch (priority) {
        case 'low':
            return d.priorityLow;
        case 'high':
            return d.priorityHigh;
        case 'urgent':
            return d.priorityUrgent;
        default:
            return d.priorityNormal;
    }
}

function syncPriorityOptions(): void {
    const currentValue = prioritySelectEl.value;
    const options: TicketPriority[] = ['low', 'normal', 'high', 'urgent'];
    prioritySelectEl.innerHTML = options
        .map((value) => `<option value="${value}">${escapeHtml(priorityLabel(value))}</option>`)
        .join('');
    prioritySelectEl.setAttribute('aria-label', dict().priorityLabel);
    prioritySelectEl.value = options.includes(currentValue as TicketPriority)
        ? currentValue
        : 'normal';
}

function formatDateTime(date: Date | null): string {
    if (!date) return '';
    return new Intl.DateTimeFormat(LOCALE_MAP[getCurrentLanguage()], {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

function messageAuthor(message: TicketMessage): string {
    if (message.from === 'staff') {
        if (isStaff) {
            return message.authorName || dict().staffLabel;
        }
        return dict().staffLabel;
    }
    if (!isStaff && message.authorId && message.authorId === auth.currentUser?.uid) {
        return dict().userLabel;
    }
    return message.authorName || dict().userLabel;
}

function requesterPrimary(): string {
    if (!ticket) return '';
    return formatUserDisplayName(requesterProfile ?? {
        name: ticket.name,
        email: ticket.email,
    });
}

function requesterSecondary(primary: string): string {
    if (!ticket) return '';
    const pieces: string[] = [];
    const username = requesterProfile?.name?.trim() ?? '';
    const email = (requesterProfile?.email ?? ticket.email ?? '').trim();

    if (username && primary.toLowerCase() !== username.toLowerCase()) {
        pieces.push(`@${username}`);
    }
    if (email && primary.toLowerCase() !== email.toLowerCase()) {
        pieces.push(email);
    }

    return pieces.join(' · ');
}

function currentStaffDisplayName(): string {
    const profile = currentUser();
    return formatUserDisplayName(profile ?? {
        name: auth.currentUser?.displayName ?? dict().staffLabel,
        email: auth.currentUser?.email ?? '',
    });
}

function assignmentDisplayName(): string {
    if (!ticket?.assignedStaffId) return dict().assignmentUnassigned;
    if (ticket.assignedStaffId === auth.currentUser?.uid) return dict().userLabel;
    return ticket.assignedStaffName.trim() || dict().staffLabel;
}

function replyErrorText(reason: 'invalid' | 'network' | 'permission' | 'unknown'): string {
    if (!isStaff && reason === 'permission' && ticket?.status === 'resolved') {
        return dict().chatClosed;
    }
    if (reason === 'permission') {
        return dict().chatForbidden;
    }
    if (reason === 'network') {
        return dict().chatNetworkError;
    }
    return dict().chatSendError;
}

function internalNoteErrorText(reason: 'invalid' | 'network' | 'permission' | 'unknown'): string {
    if (reason === 'permission') {
        return dict().chatForbidden;
    }
    if (reason === 'network') {
        return dict().internalNotesNetworkError;
    }
    return dict().internalNotesSaveError;
}

async function loadRequesterProfile(): Promise<void> {
    const uid = ticket?.userId ?? null;
    if (!isStaff || !uid) {
        requesterProfile = null;
        requesterProfileUid = uid;
        render();
        return;
    }

    if (requesterProfileUid === uid) return;
    requesterProfileUid = uid;
    requesterProfile = null;

    try {
        const profile = await getUserProfileById(uid);
        if (requesterProfileUid !== uid) return;
        requesterProfile = profile;
        render();
    } catch (err) {
        console.warn('[ticket] requester profile load failed', uid, err);
    }
}

function isSafeUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

function renderMessages(): void {
    messagesEl.innerHTML = '';
    
    if (messages.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'chat-state';
        emptyDiv.textContent = dict().chatEmpty;
        messagesEl.appendChild(emptyDiv);
        return;
    }

    for (const message of messages) {
        const cls = message.from === 'staff' ? 'chat-bubble--staff' : 'chat-bubble--user';
        const roleText = message.from === 'staff' ? dict().staffLabel : dict().userLabel;

        const article = document.createElement('article');
        article.className = `chat-bubble ${cls}`;

        const header = document.createElement('div');
        header.className = 'chat-bubble-header';

        const authorDiv = document.createElement('div');
        authorDiv.className = 'chat-bubble-author';
        authorDiv.textContent = messageAuthor(message) + ' ';
        
        const roleSpan = document.createElement('span');
        roleSpan.className = 'chat-bubble-role';
        roleSpan.textContent = roleText;
        authorDiv.appendChild(roleSpan);

        const timeDiv = document.createElement('div');
        timeDiv.className = 'chat-bubble-time';
        timeDiv.textContent = formatDateTime(message.createdAt);

        header.appendChild(authorDiv);
        header.appendChild(timeDiv);
        article.appendChild(header);

        if (message.text) {
            const textDiv = document.createElement('div');
            textDiv.className = 'chat-bubble-text';
            textDiv.textContent = message.text;
            article.appendChild(textDiv);
        }

        if (message.attachments && message.attachments.length > 0) {
            const attachContainer = document.createElement('div');
            attachContainer.className = 'chat-bubble-attachments';

            for (const att of message.attachments) {
                const safeUrl = isSafeUrl(att.url) ? att.url : '#';
                
                if (att.type.startsWith('image/')) {
                    const link = document.createElement('a');
                    link.href = safeUrl;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.className = 'attachment-image-link';

                    const img = document.createElement('img');
                    img.src = safeUrl;
                    img.alt = att.name;
                    img.className = 'attachment-image-img';
                    
                    link.appendChild(img);
                    attachContainer.appendChild(link);
                } else {
                    const link = document.createElement('a');
                    link.href = safeUrl;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.className = 'attachment-preview attachment-file-link';

                    const svgNS = "http://www.w3.org/2000/svg";
                    const svg = document.createElementNS(svgNS, "svg");
                    svg.setAttribute("width", "16");
                    svg.setAttribute("height", "16");
                    svg.setAttribute("viewBox", "0 0 24 24");
                    svg.setAttribute("fill", "none");
                    svg.setAttribute("stroke", "currentColor");
                    svg.setAttribute("stroke-width", "2");
                    svg.setAttribute("stroke-linecap", "round");
                    svg.setAttribute("stroke-linejoin", "round");
                    svg.setAttribute("class", "attachment-file-icon");
                    
                    const path = document.createElementNS(svgNS, "path");
                    path.setAttribute("d", "M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z");
                    const polyline = document.createElementNS(svgNS, "polyline");
                    polyline.setAttribute("points", "13 2 13 9 20 9");
                    
                    svg.appendChild(path);
                    svg.appendChild(polyline);

                    const nameSpan = document.createElement('span');
                    nameSpan.className = 'attachment-preview-name';
                    nameSpan.textContent = att.name;

                    link.appendChild(svg);
                    link.appendChild(nameSpan);
                    attachContainer.appendChild(link);
                }
            }
            article.appendChild(attachContainer);
        }

        messagesEl.appendChild(article);
    }

    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function renderAttachmentsPreview(): void {
    if (selectedFiles.length === 0) {
        attachmentsListEl.hidden = true;
        attachmentsListEl.innerHTML = '';
        return;
    }

    attachmentsListEl.hidden = false;
    attachmentsListEl.innerHTML = selectedFiles.map((file, index) => `
        <div class="attachment-preview">
            <span class="attachment-preview-name">${escapeHtml(file.name)}</span>
            <button type="button" class="attachment-preview-remove" data-index="${index}" aria-label="Remove attachment">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
    `).join('');

    attachmentsListEl.querySelectorAll('.attachment-preview-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = Number((e.currentTarget as HTMLButtonElement).dataset.index);
            selectedFiles.splice(index, 1);
            renderAttachmentsPreview();
        });
    });
}

function renderNotes(): void {
    if (!isStaff) {
        notesSectionEl.hidden = true;
        return;
    }

    notesSectionEl.hidden = false;
    if (notes.length === 0) {
        notesListEl.innerHTML = `<div class="ticket-notes-empty">${escapeHtml(dict().internalNotesEmpty)}</div>`;
        return;
    }

    notesListEl.innerHTML = notes.map((note) => `
        <article class="ticket-note-item">
            <div class="ticket-note-meta">
                <span class="ticket-note-author">${escapeHtml(note.authorName || dict().staffLabel)}</span>
                <span class="ticket-note-time">${escapeHtml(formatDateTime(note.createdAt))}</span>
            </div>
            <div class="ticket-note-text">${escapeHtml(note.text)}</div>
        </article>
    `).join('');
    notesListEl.scrollTop = notesListEl.scrollHeight;
}

function render(): void {
    syncTitle();

    if (state !== 'ready' || !ticket) {
        screenEl.hidden = true;
        stateEl.hidden = false;
        stateEl.textContent = state === 'forbidden'
            ? dict().chatForbidden
            : state === 'notfound'
                ? dict().chatNotFound
                : dict().chatLoading;
        return;
    }

    stateEl.hidden = true;
    screenEl.hidden = false;
    backLink.href = isStaff ? 'admin-tickets.html' : 'my-tickets.html';
    backLink.textContent = dict().chatBack;

    subjectEl.textContent = ticket.subject || dict().chatTitle;
    numberEl.textContent = `${ticket.ticketNumber} · ${categoryLabel(ticket.category)}`;
    const primary = requesterPrimary();
    const secondary = requesterSecondary(primary);
    syncPriorityOptions();
    priorityBadgeEl.className = `priority-badge priority-badge--${ticket.priority}`;
    priorityBadgeEl.textContent = priorityLabel(ticket.priority);
    priorityBadgeEl.hidden = isStaff;
    prioritySelectEl.hidden = !isStaff;
    prioritySelectEl.value = ticket.priority;
    prioritySelectEl.disabled = !isStaff;
    assignmentEl.hidden = !isStaff;
    assignmentValueEl.textContent = assignmentDisplayName();
    assignSelfBtn.hidden = !isStaff || ticket.assignedStaffId === auth.currentUser?.uid;
    assignSelfBtn.textContent = ticket.assignedStaffId ? dict().assignmentTakeTicket : dict().assignmentAssignToMe;
    unassignBtn.hidden = !isStaff || !ticket.assignedStaffId;
    unassignBtn.textContent = dict().assignmentUnassign;
    requesterEl.hidden = !isStaff;
    requesterPrimaryEl.textContent = primary;
    requesterSecondaryEl.textContent = secondary;
    requesterSecondaryEl.hidden = !secondary;
    statusEl.className = `status-badge ${statusClass(ticket.status)}`;
    statusEl.textContent = statusLabel(ticket.status);

    toggleStatusBtn.hidden = !isStaff;
    deleteBtn.hidden = !isStaff;
    if (isStaff) {
        toggleStatusBtn.textContent = ticket.status === 'open' ? dict().chatResolve : dict().chatReopen;
        deleteBtn.textContent = dict().deleteTicket;
    }

    const replyLocked = ticket.status === 'resolved';
    statusBarEl.hidden = !replyLocked;
    formEl.hidden = replyLocked;
    inputEl.disabled = replyLocked;
    sendBtn.disabled = replyLocked;
    fileInputEl.disabled = replyLocked;
    renderMessages();
    renderNotes();
}

fileInputEl.addEventListener('change', () => {
    if (fileInputEl.files) {
        const newFiles = Array.from(fileInputEl.files);
        if (selectedFiles.length + newFiles.length > 5) {
            showToast('Можно прикрепить не более 5 файлов', 'err');
            return;
        }
        
        const validFiles = newFiles.filter(file => {
            if (file.size > 5 * 1024 * 1024) {
                showToast(`Файл ${file.name} слишком большой (макс. 5MB)`, 'err');
                return false;
            }
            return true;
        });

        selectedFiles = [...selectedFiles, ...validFiles];
        renderAttachmentsPreview();
    }
    fileInputEl.value = ''; // Reset to allow selecting the same file again
});

inputWrapperEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (!inputEl.disabled) {
        inputWrapperEl.classList.add('drag-over');
    }
});

inputWrapperEl.addEventListener('dragleave', (e) => {
    e.preventDefault();
    inputWrapperEl.classList.remove('drag-over');
});

inputWrapperEl.addEventListener('drop', (e) => {
    e.preventDefault();
    inputWrapperEl.classList.remove('drag-over');
    
    if (inputEl.disabled || !e.dataTransfer?.files) return;
    
    const newFiles = Array.from(e.dataTransfer.files);
    if (selectedFiles.length + newFiles.length > 5) {
        showToast('Можно прикрепить не более 5 файлов', 'err');
        return;
    }
    
    const validFiles = newFiles.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
            showToast(`Файл ${file.name} слишком большой (макс. 5MB)`, 'err');
            return false;
        }
        return true;
    });

    selectedFiles = [...selectedFiles, ...validFiles];
    renderAttachmentsPreview();
});

inputEl.addEventListener('input', () => {
    inputEl.style.height = '0px';
    inputEl.style.height = `${Math.min(inputEl.scrollHeight, 120)}px`;
});

formEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!ticket) return;
    if (ticket.status === 'resolved') {
        showToast(dict().chatClosed, 'err');
        return;
    }

    const text = inputEl.value.trim();
    if (!text && selectedFiles.length === 0) return;

    sendBtn.disabled = true;
    sendBtn.textContent = 'Отправка...';
    inputEl.disabled = true;
    
    try {
        const uploadedAttachments: TicketAttachment[] = [];
        
        if (selectedFiles.length > 0) {
            for (const file of selectedFiles) {
                const attachment = await uploadTicketAttachment(file, ticket.id);
                if (attachment) {
                    uploadedAttachments.push(attachment);
                } else {
                    showToast(`Не удалось загрузить файл ${file.name}`, 'err');
                }
            }
        }

        const result = isStaff
            ? await sendStaffMessage(ticket.id, text, uploadedAttachments)
            : await sendUserMessage(ticket.id, text, uploadedAttachments);
        
        if (!result.ok) {
            showToast(replyErrorText(result.reason), 'err');
            return;
        }

        inputEl.value = '';
        inputEl.style.height = '80px'; // Reset to new min-height
        selectedFiles = [];
        renderAttachmentsPreview();
        
        // Ensure scroll jumps to bottom after our own message
        setTimeout(() => {
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }, 50);
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = dict().chatSend;
        inputEl.disabled = false;
    }
});

noteFormEl.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!ticket || !isStaff) return;

    const text = noteInputEl.value.trim();
    if (!text) return;

    noteSubmitBtn.disabled = true;
    const result = await staffAddInternalNote(ticket.id, text);
    noteSubmitBtn.disabled = false;

    if (!result.ok) {
        showToast(internalNoteErrorText(result.reason), 'err');
        return;
    }

    noteInputEl.value = '';
    noteInputEl.style.height = '42px';
});

deleteBtn.addEventListener('click', async () => {
    if (!ticket || !isStaff) return;
    if (!window.confirm(dict().deleteConfirm || 'Are you sure you want to delete this ticket?')) return;

    deleteBtn.disabled = true;
    try {
        await staffDeleteTicket(ticket.id);
        window.location.href = 'admin-tickets.html';
    } catch (err) {
        console.error('[ticket] delete failed', err);
        showToast('Failed to delete ticket', 'err');
        deleteBtn.disabled = false;
    }
});

toggleStatusBtn.addEventListener('click', async () => {
    if (!ticket || !isStaff) return;
    toggleStatusBtn.disabled = true;
    try {
        await staffUpdateStatus(ticket.id, ticket.status === 'open' ? 'resolved' : 'open');
    } catch (err) {
        console.error('[ticket] status update failed', err);
        showToast(dict().statusUpdateError, 'err');
    } finally {
        toggleStatusBtn.disabled = false;
    }
});

prioritySelectEl.addEventListener('change', async () => {
    if (!ticket || !isStaff) return;
    const nextPriority = prioritySelectEl.value as TicketPriority;
    if (!nextPriority || nextPriority === ticket.priority) {
        prioritySelectEl.value = ticket.priority;
        return;
    }

    prioritySelectEl.disabled = true;
    try {
        await staffUpdatePriority(ticket.id, nextPriority);
    } catch (err) {
        console.error('[ticket] priority update failed', err);
        prioritySelectEl.value = ticket.priority;
        showToast(dict().priorityUpdateError, 'err');
    } finally {
        prioritySelectEl.disabled = false;
    }
});

assignSelfBtn.addEventListener('click', async () => {
    if (!ticket || !isStaff) return;
    assignSelfBtn.disabled = true;
    try {
        await staffUpdateAssignment(ticket.id, auth.currentUser?.uid ?? null, currentStaffDisplayName());
    } catch (err) {
        console.error('[ticket] assignment update failed', err);
        showToast(dict().assignmentUpdateError, 'err');
    } finally {
        assignSelfBtn.disabled = false;
    }
});

unassignBtn.addEventListener('click', async () => {
    if (!ticket || !isStaff) return;
    unassignBtn.disabled = true;
    try {
        await staffUpdateAssignment(ticket.id, null, '');
    } catch (err) {
        console.error('[ticket] assignment clear failed', err);
        showToast(dict().assignmentUpdateError, 'err');
    } finally {
        unassignBtn.disabled = false;
    }
});

noteInputEl.addEventListener('input', () => {
    noteInputEl.style.height = '0px';
    noteInputEl.style.height = `${Math.min(noteInputEl.scrollHeight, 120)}px`;
});

onLanguageChange(() => {
    render();
});

void (async () => {
    if (!ticketId) {
        render();
        return;
    }

    await whenAuthReady();
    if (!auth.currentUser) {
        redirectToLogin();
        return;
    }

    isStaff = await hasStaffRole().catch(() => false);
    render();

    ticketUnsub = subscribeToTicket(
        ticketId,
        (next) => {
            if (!next) {
                ticket = null;
                state = 'notfound';
                render();
                return;
            }

            ticket = next;
            state = 'ready';
            render();
            void loadRequesterProfile();

            if (isStaff) {
                if (next.unreadForStaff) void markTicketReadForStaff(ticketId);
            } else if (next.unreadForUser) {
                void markTicketReadForUser(ticketId);
            }

            if (!messagesUnsub) {
                messagesUnsub = subscribeToTicketMessages(
                    ticketId,
                    (items) => {
                        messages = items;
                        render();
                    },
                    (err) => {
                        console.error('[ticket] messages subscription failed', err);
                        if (err.code === 'permission-denied') {
                            state = 'forbidden';
                            render();
                        }
                    },
                );
            }

            if (isStaff && !notesUnsub) {
                notesUnsub = subscribeToTicketInternalNotes(
                    ticketId,
                    (items) => {
                        notes = items;
                        renderNotes();
                    },
                    (err) => {
                        console.error('[ticket] notes subscription failed', err);
                    },
                );
            }
        },
        (err) => {
            console.error('[ticket] ticket subscription failed', err);
            state = err.code === 'permission-denied' ? 'forbidden' : 'notfound';
            render();
        },
    );
})();

window.addEventListener('beforeunload', () => {
    ticketUnsub?.();
    messagesUnsub?.();
    notesUnsub?.();
});
