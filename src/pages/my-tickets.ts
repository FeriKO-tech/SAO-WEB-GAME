import {
    applyAnimationPref,
    auth,
    byId,
    byIdMaybe,
    getCurrentLanguage,
    initI18n,
    initLangSwitcher,
    onLanguageChange,
    registerTranslations,
    subscribeToUserTickets,
    whenAuthReady,
    type Ticket,
    type TicketCategory,
    type TicketStatus,
} from '@lib';
import { buildDict, ticketsTranslations } from '@translations';
import type { TicketsDict } from '@translations';

applyAnimationPref();
registerTranslations(buildDict('myTickets'));
initI18n();

initLangSwitcher({
    switcher: byId('lang-switcher'),
    button: byId('lang-btn'),
    currentLabel: byIdMaybe('current-lang'),
});

const listEl = byId<HTMLDivElement>('my-tickets-list');
const emptyEl = byId<HTMLDivElement>('my-tickets-empty');

let tickets: Ticket[] = [];
let loaded = false;
let unsubscribe: (() => void) | null = null;

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
    document.title = `${dict().pageTitle} | Sword Art Online`;
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

function formatActivity(date: Date | null): string {
    if (!date) return '';
    const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
    return dict().timeAgo(seconds);
}

function renderSkeletons(): string {
    return Array.from({ length: 3 }, () => `
        <div class="ticket-card" aria-hidden="true">
            <div class="ticket-card-body">
                <div class="skeleton-line skeleton-line--lg"></div>
                <div class="ticket-card-meta">
                    <div class="skeleton-line skeleton-line--sm"></div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderCard(ticket: Ticket): string {
    const d = dict();
    const href = `ticket.html?id=${encodeURIComponent(ticket.id)}`;
    return `
        <a class="ticket-card" href="${href}">
            <div class="ticket-card-body">
                <div class="ticket-card-subject">${escapeHtml(ticket.subject || ticket.ticketNumber)}</div>
                <div class="ticket-card-meta">
                    <span>${escapeHtml(ticket.ticketNumber)}</span>
                    <span class="cat-tag">${escapeHtml(categoryLabel(ticket.category))}</span>
                    <span>${escapeHtml(d.msgCount(ticket.messageCount))}</span>
                    <span>${escapeHtml(formatActivity(ticket.lastMessageAt))}</span>
                </div>
            </div>
            <div class="ticket-card-right">
                ${ticket.unreadForUser ? `<span class="unread-dot" title="${escapeHtml(d.unreadBadge)}"></span>` : ''}
                <span class="status-badge ${statusClass(ticket.status)}">${escapeHtml(statusLabel(ticket.status))}</span>
            </div>
        </a>
    `;
}

function render(): void {
    emptyEl.hidden = true;

    if (!loaded) {
        listEl.innerHTML = renderSkeletons();
        return;
    }

    if (tickets.length === 0) {
        listEl.innerHTML = '';
        emptyEl.hidden = false;
        emptyEl.textContent = dict().noTickets;
        return;
    }

    listEl.innerHTML = tickets.map(renderCard).join('');
}

syncTitle();
render();
onLanguageChange(() => {
    syncTitle();
    render();
});

void (async () => {
    await whenAuthReady();
    const uid = auth.currentUser?.uid;
    if (!uid) {
        redirectToLogin();
        return;
    }

    unsubscribe = subscribeToUserTickets(
        uid,
        (items) => {
            tickets = items;
            loaded = true;
            render();
        },
        (err) => {
            console.error('[my-tickets] subscription failed', err);
            loaded = true;
            tickets = [];
            render();
        },
    );
})();

window.addEventListener('beforeunload', () => {
    unsubscribe?.();
});
