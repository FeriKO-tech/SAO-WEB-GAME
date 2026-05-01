import {
    applyAnimationPref,
    auth,
    byId,
    byIdMaybe,
    formatUserDisplayName,
    getCurrentLanguage,
    getUserProfileById,
    hasStaffRole,
    initI18n,
    initLangSwitcher,
    onLanguageChange,
    registerTranslations,
    subscribeToAllTickets,
    whenAuthReady,
    type Ticket,
    type TicketCategory,
    type TicketPriority,
    type TicketStatus,
} from '@lib';
import type { User } from '@models/user';
import { buildDict, ticketsTranslations } from '@translations';
import type { TicketsDict } from '@translations';

applyAnimationPref();
registerTranslations(buildDict('adminTickets'));
initI18n();

initLangSwitcher({
    switcher: byId('lang-switcher'),
    button: byId('lang-btn'),
    currentLabel: byIdMaybe('current-lang'),
});

const listEl = byId<HTMLDivElement>('admin-tickets-list');
const emptyEl = byId<HTMLDivElement>('admin-tickets-empty');
const searchInputEl = byId<HTMLInputElement>('admin-search-input');
const unreadToggleEl = byId<HTMLInputElement>('admin-unread-toggle');
const unreadCountEl = byId<HTMLSpanElement>('admin-unread-count');
const notifyBtnEl = byId<HTMLButtonElement>('admin-notify-btn');
const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('.filter-tab'));
const tabCounts = new Map<string, HTMLSpanElement>(
    Array.from(document.querySelectorAll<HTMLSpanElement>('.filter-tab-count'))
        .map((el) => [el.dataset.count ?? '', el] as const),
);

const notificationsSupported = 'Notification' in window;
const previousTicketState = new Map<string, { unread: boolean; lastActivity: number }>();
let receivedFirstSnapshot = false;

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

let statusFilter: TicketStatus | undefined;
let tickets: Ticket[] = [];
let loaded = false;
let allowed = false;
let searchQuery = '';
let unreadOnly = false;
let unsubscribe: (() => void) | null = null;
const requesterProfiles = new Map<string, User | null>();
const PRIORITY_ORDER: Record<TicketPriority, number> = {
    low: 0,
    normal: 1,
    high: 2,
    urgent: 3,
};

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
    document.title = `${dict().adminTitle} | Sword Art Online`;
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

function formatActivity(date: Date | null): string {
    if (!date) return '';
    return new Intl.DateTimeFormat(LOCALE_MAP[getCurrentLanguage()], {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

function normalizeSearch(value: string): string {
    return value.trim().toLowerCase();
}

function renderSkeletons(): string {
    return Array.from({ length: 4 }, () => `
        <div class="ticket-card" aria-hidden="true">
            <div class="ticket-card-body">
                <div class="skeleton-line skeleton-line--lg"></div>
                <div class="skeleton-line skeleton-line--sm"></div>
            </div>
        </div>
    `).join('');
}

function renderCard(ticket: Ticket): string {
    const unread = ticket.unreadForStaff ? '<span class="unread-dot"></span>' : '';
    const primary = requesterPrimary(ticket);
    const secondary = requesterSecondary(ticket, primary);
    const requesterLine = [primary, secondary].filter(Boolean).join(' · ');
    const priority = ticket.priority !== 'normal'
        ? `<span class="priority-badge priority-badge--${ticket.priority}">${escapeHtml(priorityLabel(ticket.priority))}</span>`
        : '';
    const assignedName = ticket.assignedStaffId === auth.currentUser?.uid
        ? dict().userLabel
        : ticket.assignedStaffName || dict().staffLabel;
    const assignment = ticket.assignedStaffId
        ? `<span class="assignment-badge${ticket.assignedStaffId === auth.currentUser?.uid ? ' assignment-badge--mine' : ''}">${escapeHtml(`${dict().assignmentLabel}: ${assignedName}`)}</span>`
        : '';
    return `
        <a class="ticket-card" href="ticket.html?id=${encodeURIComponent(ticket.id)}">
            <div class="ticket-card-body">
                <div class="ticket-card-subject">${escapeHtml(ticket.subject || ticket.ticketNumber)}</div>
                <div class="ticket-card-requester">${escapeHtml(requesterLine)}</div>
                <div class="ticket-card-meta">
                    <span>${escapeHtml(ticket.ticketNumber)}</span>
                    <span class="cat-tag">${escapeHtml(categoryLabel(ticket.category))}</span>
                    ${priority}
                    ${assignment}
                    <span>${escapeHtml(formatActivity(ticket.lastMessageAt))}</span>
                </div>
            </div>
            <div class="ticket-card-right">
                ${unread}
                <span class="status-badge ${statusClass(ticket.status)}">${escapeHtml(statusLabel(ticket.status))}</span>
            </div>
        </a>
    `;
}

function requesterPrimary(ticket: Ticket): string {
    const profile = ticket.userId ? requesterProfiles.get(ticket.userId) : null;
    return formatUserDisplayName(profile ?? {
        name: ticket.name,
        email: ticket.email,
    });
}

function requesterSecondary(ticket: Ticket, primary: string): string {
    const profile = ticket.userId ? requesterProfiles.get(ticket.userId) : null;
    const pieces: string[] = [];
    const username = profile?.name?.trim() ?? '';
    const email = (profile?.email ?? ticket.email ?? '').trim();

    if (username && primary.toLowerCase() !== username.toLowerCase()) {
        pieces.push(`@${username}`);
    }
    if (email && primary.toLowerCase() !== email.toLowerCase()) {
        pieces.push(email);
    }

    return pieces.join(' · ');
}

function matchesSearch(ticket: Ticket): boolean {
    if (!searchQuery) return true;

    const profile = ticket.userId ? requesterProfiles.get(ticket.userId) : null;
    const primary = requesterPrimary(ticket);
    const secondary = requesterSecondary(ticket, primary);
    const haystack = [
        ticket.ticketNumber,
        ticket.subject,
        ticket.name,
        ticket.email,
        ticket.assignedStaffName,
        profile?.name,
        profile?.email,
        profile?.firstName,
        profile?.lastName,
        primary,
        secondary,
    ]
        .filter((value): value is string => Boolean(value))
        .join('\n')
        .toLowerCase();

    return haystack.includes(searchQuery);
}

function compareTickets(a: Ticket, b: Ticket): number {
    const priorityDelta = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
    if (priorityDelta !== 0) return priorityDelta;

    const aTime = a.lastMessageAt?.getTime() ?? 0;
    const bTime = b.lastMessageAt?.getTime() ?? 0;
    if (aTime !== bTime) return bTime - aTime;

    return a.ticketNumber.localeCompare(b.ticketNumber);
}

function visibleTickets(): Ticket[] {
    return tickets
        .filter((ticket) => {
            if (statusFilter && ticket.status !== statusFilter) return false;
            if (unreadOnly && !ticket.unreadForStaff) return false;
            return matchesSearch(ticket);
        })
        .sort(compareTickets);
}

async function syncRequesterProfiles(items: Ticket[]): Promise<void> {
    const missing = Array.from(new Set(items
        .map((ticket) => ticket.userId)
        .filter((uid): uid is string => Boolean(uid))
        .filter((uid) => !requesterProfiles.has(uid))));
 
    if (missing.length === 0) return;
 
    const loadedProfiles = await Promise.all(missing.map(async (uid) => {
        try {
            return [uid, await getUserProfileById(uid)] as const;
        } catch (err) {
            console.warn('[admin-tickets] requester profile load failed', uid, err);
            return [uid, null] as const;
        }
    }));
 
    for (const [uid, profile] of loadedProfiles) {
        requesterProfiles.set(uid, profile);
    }
 
    render();
}

function render(): void {
    emptyEl.hidden = true;
    updateCounters();

    if (!allowed) {
        listEl.innerHTML = '';
        emptyEl.hidden = false;
        emptyEl.textContent = dict().chatForbidden;
        return;
    }

    if (!loaded) {
        listEl.innerHTML = renderSkeletons();
        return;
    }

    const visible = visibleTickets();
    if (visible.length === 0) {
        listEl.innerHTML = '';
        emptyEl.hidden = false;
        emptyEl.textContent = searchQuery || unreadOnly || statusFilter
            ? dict().adminNoResults
            : dict().adminNoTickets;
        return;
    }

    listEl.innerHTML = visible.map(renderCard).join('');
}

function setFilter(next: TicketStatus | undefined): void {
    statusFilter = next;
    tabs.forEach((tab) => {
        const isActive = (tab.dataset.filter === 'all' && !next)
            || tab.dataset.filter === next;
        tab.classList.toggle('active', isActive);
    });
    render();
}

function updateCounters(): void {
    let openCount = 0;
    let resolvedCount = 0;
    let unreadCount = 0;
    for (const ticket of tickets) {
        if (ticket.status === 'resolved') resolvedCount += 1;
        else openCount += 1;
        if (ticket.unreadForStaff) unreadCount += 1;
    }
    const totalCount = tickets.length;

    const setBadge = (el: HTMLSpanElement | undefined, value: number): void => {
        if (!el) return;
        if (value <= 0) {
            el.hidden = true;
            el.textContent = '';
            return;
        }
        el.hidden = false;
        el.textContent = String(value);
    };

    setBadge(tabCounts.get('all'), totalCount);
    setBadge(tabCounts.get('open'), openCount);
    setBadge(tabCounts.get('resolved'), resolvedCount);
    setBadge(unreadCountEl, unreadCount);
}

function startSubscription(): void {
    unsubscribe?.();
    unsubscribe = subscribeToAllTickets(
        (items) => {
            const previouslyLoaded = receivedFirstSnapshot;
            tickets = items;
            loaded = true;
            receivedFirstSnapshot = true;
            if (previouslyLoaded) {
                notifyAboutChanges(items);
            }
            updateTicketStateSnapshot(items);
            render();
            void syncRequesterProfiles(items);
        },
        {},
        (err) => {
            console.error('[admin-tickets] subscription failed', err);
            loaded = true;
            tickets = [];
            render();
        },
    );
}

function updateTicketStateSnapshot(items: Ticket[]): void {
    previousTicketState.clear();
    for (const ticket of items) {
        previousTicketState.set(ticket.id, {
            unread: Boolean(ticket.unreadForStaff),
            lastActivity: ticket.lastMessageAt?.getTime() ?? 0,
        });
    }
}

function updateNotifyButton(): void {
    if (!notificationsSupported || !allowed) {
        notifyBtnEl.hidden = true;
        return;
    }
    notifyBtnEl.hidden = Notification.permission !== 'default';
}

function notifyAboutChanges(items: Ticket[]): void {
    if (!canNotify()) return;

    for (const ticket of items) {
        const prev = previousTicketState.get(ticket.id);
        const isNewTicket = !prev;
        const activity = ticket.lastMessageAt?.getTime() ?? 0;
        const hasNewUserActivity = Boolean(ticket.unreadForStaff)
            && ticket.lastMessageFrom === 'user'
            && activity > (prev?.lastActivity ?? 0);

        if (isNewTicket && ticket.unreadForStaff) {
            showTicketNotification(ticket, dict().adminNotificationNewTicket);
        } else if (hasNewUserActivity) {
            showTicketNotification(ticket, dict().adminNotificationNewMessage);
        }
    }
}

function canNotify(): boolean {
    if (!notificationsSupported) return false;
    if (Notification.permission !== 'granted') return false;
    if (document.visibilityState === 'visible' && document.hasFocus()) return false;
    return true;
}

function showTicketNotification(ticket: Ticket, title: string): void {
    try {
        const body = `${ticket.ticketNumber} · ${ticket.subject || ''}`.trim();
        const n = new Notification(title, {
            body,
            tag: `ticket-${ticket.id}`,
            renotify: true,
        } as NotificationOptions);
        n.onclick = () => {
            window.focus();
            window.location.href = `ticket.html?id=${encodeURIComponent(ticket.id)}`;
            n.close();
        };
    } catch (err) {
        console.warn('[admin-tickets] notification failed', err);
    }
}

async function handleNotifyToggleClick(): Promise<void> {
    if (!notificationsSupported) return;
    if (Notification.permission === 'granted') {
        updateNotifyButton();
        return;
    }
    try {
        await Notification.requestPermission();
    } catch (err) {
        console.warn('[admin-tickets] notify request failed', err);
    }
    updateNotifyButton();
}

syncTitle();
render();

onLanguageChange(() => {
    syncTitle();
    render();
});

searchInputEl.addEventListener('input', () => {
    searchQuery = normalizeSearch(searchInputEl.value);
    render();
});

unreadToggleEl.addEventListener('change', () => {
    unreadOnly = unreadToggleEl.checked;
    render();
});

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        const raw = tab.dataset.filter;
        if (raw === 'open' || raw === 'resolved') {
            setFilter(raw);
        } else {
            setFilter(undefined);
        }
    });
});

notifyBtnEl.addEventListener('click', () => {
    void handleNotifyToggleClick();
});

void (async () => {
    await whenAuthReady();
    if (!auth.currentUser) {
        redirectToLogin();
        return;
    }

    allowed = await hasStaffRole().catch(() => false);
    if (!allowed) {
        loaded = true;
        render();
        return;
    }

    updateNotifyButton();
    startSubscription();
})();

window.addEventListener('beforeunload', () => {
    unsubscribe?.();
});
