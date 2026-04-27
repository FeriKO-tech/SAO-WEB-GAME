/**
 * Tiny cross-page UI helpers.
 *
 * Kept intentionally minimal — no component framework. These are plain
 * functions that wrap common DOM patterns used across the site.
 */

/**
 * Strongly-typed `document.getElementById`. Throws if the element is missing,
 * which is almost always what you want in page-init code (fail loudly).
 */
export function byId<T extends HTMLElement = HTMLElement>(id: string): T {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Element #${id} not found`);
    return el as T;
}

/**
 * Non-throwing counterpart — returns `null` if element is absent.
 */
export function byIdMaybe<T extends HTMLElement = HTMLElement>(
    id: string,
): T | null {
    return (document.getElementById(id) as T | null) ?? null;
}

/**
 * Attach an `Escape` key handler. Returns a disposer for cleanup.
 */
export function onEscape(handler: () => void): () => void {
    const listener = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handler();
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
}

/**
 * Close a dropdown when clicking outside of a given container.
 */
export function onClickOutside(
    container: HTMLElement,
    handler: () => void,
): () => void {
    const listener = (e: MouseEvent) => {
        if (!container.contains(e.target as Node)) handler();
    };
    document.addEventListener('click', listener);
    return () => document.removeEventListener('click', listener);
}

/**
 * Debounce a function call.
 */
export function debounce<T extends (...args: never[]) => void>(
    fn: T,
    delay = 300,
): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Format bytes as a human-readable string.
 */
export function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Safely read a `?returnTo=...` parameter from the current URL.
 *
 * Protects against open-redirect: only same-origin relative paths are allowed
 * (must not start with `//` and must not contain a URL scheme). Long values
 * are rejected so attackers cannot smuggle huge payloads through the URL.
 *
 * @param fallback Where to go when no valid returnTo is present.
 */
export function getReturnTo(fallback = 'index.html'): string {
    try {
        const raw = new URLSearchParams(window.location.search).get('returnTo');
        if (!raw) return fallback;

        // Block protocol-relative `//evil.com` and explicit schemes like `http://` / `javascript:`.
        if (raw.startsWith('//')) return fallback;
        if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) return fallback;

        const decoded = decodeURIComponent(raw);
        if (decoded.length === 0 || decoded.length > 200) return fallback;

        return decoded;
    } catch {
        return fallback;
    }
}

/**
 * Forward the current page's `returnTo` onto another URL. Used on login/register
 * pages so clicking "Sign up" / "Sign in" preserves the deep-link target.
 *
 * @param href Destination URL (relative or absolute).
 */
export function appendReturnTo(href: string): string {
    try {
        const current = new URLSearchParams(window.location.search).get('returnTo');
        if (!current) return href;
        const separator = href.includes('?') ? '&' : '?';
        return `${href}${separator}returnTo=${encodeURIComponent(current)}`;
    } catch {
        return href;
    }
}

/**
 * Pre-render guard that disables animations when the user has opted out.
 * This mirrors the inline `<script>` currently used at the top of every page.
 */
export function applyAnimationPref(): void {
    try {
        const raw = localStorage.getItem('sao_prefs');
        if (!raw) return;
        const prefs = JSON.parse(raw) as { anim?: boolean };
        if (prefs.anim === false) {
            document.documentElement.classList.add('no-anim');
        }
    } catch {
        /* ignore */
    }
}
