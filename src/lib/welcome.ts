/**
 * One-shot "welcome" flag passed from login/register to the post-auth page.
 *
 * Stored in `sessionStorage` so it survives the full-page navigation after
 * a successful auth flow but disappears when the tab closes. The flag is
 * read and immediately cleared by `consumeWelcome()` - so it shows up once.
 */

const WELCOME_KEY = 'sao_welcome';

export type WelcomeKind = 'back' | 'new';

function isWelcomeKind(v: unknown): v is WelcomeKind {
    return v === 'back' || v === 'new';
}

/**
 * Called by login/register right before redirecting to the return URL.
 */
export function markWelcome(kind: WelcomeKind): void {
    try {
        sessionStorage.setItem(WELCOME_KEY, kind);
    } catch {
        /* sessionStorage unavailable (private mode) - skip */
    }
}

/**
 * Called by the landing page (or whichever page the user lands on) to
 * display a greeting toast. Returns the pending kind and clears it.
 */
export function consumeWelcome(): WelcomeKind | null {
    try {
        const raw = sessionStorage.getItem(WELCOME_KEY);
        if (!isWelcomeKind(raw)) return null;
        sessionStorage.removeItem(WELCOME_KEY);
        return raw;
    } catch {
        return null;
    }
}
