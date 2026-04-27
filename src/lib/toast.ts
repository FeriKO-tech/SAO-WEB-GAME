/**
 * Lightweight toast notifications.
 *
 * The toast DOM is created lazily on first call and reused thereafter.
 * Tailor the visual style in `src/styles/components/toast.css`.
 */

export type ToastType = 'ok' | 'err' | 'info';

interface ToastOptions {
    /** Duration before auto-hide, in ms (default 5000) */
    duration?: number;
    /** Override the icon character */
    icon?: string;
}

let toastEl: HTMLDivElement | null = null;
let iconEl: HTMLSpanElement | null = null;
let textEl: HTMLSpanElement | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

function ensureToastElement(): void {
    if (toastEl) return;

    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');

    iconEl = document.createElement('span');
    iconEl.className = 'toast-icon';

    textEl = document.createElement('span');
    textEl.className = 'toast-text';

    toastEl.appendChild(iconEl);
    toastEl.appendChild(textEl);
    document.body.appendChild(toastEl);
}

const DEFAULT_ICONS: Record<ToastType, string> = {
    ok: '✓',
    err: '✗',
    info: 'ℹ',
};

/**
 * Show a toast notification.
 *
 * @example
 * showToast('Profile saved', 'ok');
 * showToast('Invalid email', 'err', { duration: 3000 });
 */
export function showToast(
    message: string,
    type: ToastType = 'info',
    options: ToastOptions = {},
): void {
    ensureToastElement();
    if (!toastEl || !iconEl || !textEl) return;

    toastEl.classList.remove('ok', 'err', 'info');
    toastEl.classList.add(type);

    iconEl.textContent = options.icon ?? DEFAULT_ICONS[type];
    textEl.textContent = message;

    // Force reflow so the transition always plays
    void toastEl.offsetWidth;
    toastEl.classList.add('show');

    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
        toastEl?.classList.remove('show');
    }, options.duration ?? 5000);
}

/**
 * Immediately hide the active toast (if any).
 */
export function hideToast(): void {
    if (hideTimer) clearTimeout(hideTimer);
    toastEl?.classList.remove('show');
}
