/**
 * Login page entry point.
 *
 * Responsibilities:
 *   1. Register translations and initialise i18n.
 *   2. Wire the language switcher.
 *   3. Handle form submission: validate → `signIn` (Firebase) → success screen.
 *
 * Firebase `signInWithEmailAndPassword` rejects with a `FirebaseError` whose
 * `.code` we map to localised field errors.
 */

import { FirebaseError } from 'firebase/app';
import {
    GOOGLE_PROFILE_SETUP_REQUIRED_ERROR,
    appendReturnTo,
    applyAnimationPref,
    byId,
    byIdMaybe,
    getReturnTo,
    initI18n,
    initLangSwitcher,
    markWelcome,
    onLanguageChange,
    registerTranslations,
    requestPasswordReset,
    showToast,
    signIn,
    signInWithGoogle,
    t,
    validateEmailDetailed,
} from '@lib';
import { buildDict } from '@translations';

// ===== Boot =====

applyAnimationPref();
registerTranslations(buildDict('login'));
initI18n();

const submitBtn = byId<HTMLButtonElement>('submit-btn');

initLangSwitcher({
    switcher: byId('lang-switcher'),
    button: byId('lang-btn'),
    currentLabel: byIdMaybe('current-lang'),
});

// Keep `<title>` in sync with the current language
const syncDocTitle = () => {
    document.title = `${t('title')} | Sword Art Online`;
};
syncDocTitle();
onLanguageChange(syncDocTitle);

// Reset submit-button label on each language change (in case user triggered
// `submitting` state and then changed language)
onLanguageChange(() => {
    if (!submitBtn.disabled) submitBtn.textContent = t('submit');
});

// ===== Form elements =====

const form = byId<HTMLFormElement>('login-form');
const container = byId<HTMLDivElement>('login-container');
const successView = byId<HTMLDivElement>('success-view');
const emailInput = byId<HTMLInputElement>('email');
const passwordInput = byId<HTMLInputElement>('password');
const googleBtn = byIdMaybe<HTMLButtonElement>('google-btn');

/**
 * Toggle error state for a field + its adjacent `[data-for="..."]` message.
 */
function setFieldError(fieldId: string, show: boolean, msg?: string): void {
    const input = byId<HTMLInputElement>(fieldId);
    const err = document.querySelector<HTMLElement>(`[data-for="${fieldId}"]`);
    if (!err) return;

    if (show) {
        input.classList.add('error');
        err.classList.add('show');
        if (msg) err.textContent = msg;
    } else {
        input.classList.remove('error');
        err.classList.remove('show');
    }
}

// Clear per-field error as the user types
['email', 'password'].forEach((id) => {
    byId<HTMLInputElement>(id).addEventListener('input', () => setFieldError(id, false));
});

/**
 * Show success screen, then redirect after a 3-second countdown.
 */
function enterSuccessState(): void {
    container.classList.add('done');
    successView.classList.add('show');

    let count = 3;
    const countdownEl = byId('countdown');
    const timer = window.setInterval(() => {
        count--;
        if (count <= 0) {
            window.clearInterval(timer);
            window.location.href = getReturnTo();
        } else {
            countdownEl.textContent = String(count);
        }
    }, 1000);
}

function resetAuthButtons(): void {
    submitBtn.disabled = false;
    submitBtn.textContent = t('submit');
    if (googleBtn) {
        googleBtn.disabled = false;
    }
}

// ===== Form submission =====

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailVal = emailInput.value.trim();
    const password = passwordInput.value;

    let valid = true;

    if (emailVal.length === 0) {
        setFieldError('email', true, t('loginErr'));
        valid = false;
    } else if (validateEmailDetailed(emailVal).state !== 'ok') {
        setFieldError('email', true, t('invalidEmail'));
        valid = false;
    }

    if (password.length === 0) {
        setFieldError('password', true, t('passwordErr'));
        valid = false;
    }
    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = t('submitting');
    if (googleBtn) googleBtn.disabled = true;

    try {
        await signIn(emailVal, password);
        // Let the post-auth page show a one-shot "welcome back" toast.
        markWelcome('back');
        // Small UX pause before swapping to the success screen
        window.setTimeout(enterSuccessState, 400);
    } catch (err) {
        resetAuthButtons();

        if (err instanceof FirebaseError) {
            // Firebase >=9 mostly returns `auth/invalid-credential` for both
            // user-not-found and wrong-password (security hardening). We map
            // the old codes too for robustness on older SDK builds.
            switch (err.code) {
                case 'auth/user-not-found':
                    setFieldError('email', true, t('accountNotFound'));
                    return;
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    setFieldError('password', true, t('wrongPassword'));
                    return;
                case 'auth/invalid-email':
                    setFieldError('email', true, t('invalidEmail'));
                    return;
                case 'auth/too-many-requests':
                    showToast(t('tooManyRequests'), 'err', { duration: 6000 });
                    return;
                case 'auth/network-request-failed':
                    showToast(t('networkError'), 'err');
                    return;
                case 'auth/user-disabled':
                    showToast(t('userDisabled'), 'err');
                    return;
            }
        }

        // Unknown error — surface it so we have something in the console
        console.error('[login] unexpected auth error', err);
        showToast(t('unknownError'), 'err');
    }
});

googleBtn?.addEventListener('click', async () => {
    submitBtn.disabled = true;
    googleBtn.disabled = true;

    try {
        const result = await signInWithGoogle({ allowProfileBootstrap: false });
        markWelcome(result.isNewUser ? 'new' : 'back');
        window.setTimeout(enterSuccessState, 400);
    } catch (err) {
        resetAuthButtons();

        if (err instanceof Error && err.message === GOOGLE_PROFILE_SETUP_REQUIRED_ERROR) {
            showToast(t('googleRegisterRequired'), 'err', { duration: 6000 });
            window.setTimeout(() => {
                window.location.href = appendReturnTo('register.html');
            }, 1200);
            return;
        }

        if (err instanceof FirebaseError) {
            switch (err.code) {
                case 'auth/popup-closed-by-user':
                case 'auth/cancelled-popup-request':
                    return;
                case 'auth/popup-blocked':
                    showToast(t('googlePopupBlocked'), 'err', { duration: 6000 });
                    return;
                case 'auth/account-exists-with-different-credential':
                    showToast(t('googleProviderConflict'), 'err', { duration: 6000 });
                    return;
                case 'auth/network-request-failed':
                    showToast(t('networkError'), 'err');
                    return;
            }
        }

        console.error('[login] google auth failed', err);
        showToast(t('googleSignInError'), 'err');
    }
});

// Forward ?returnTo onto the "Sign up" link so the target survives either path.
const registerLink = document.querySelector<HTMLAnchorElement>('.form-footer a[href="register.html"]');
if (registerLink) registerLink.href = appendReturnTo('register.html');

// ===== Forgot-password modal =====

const forgotLink = document.querySelector<HTMLButtonElement>('.forgot-link');
const forgotModal = byId<HTMLDivElement>('forgot-modal');
const forgotEmailInput = byId<HTMLInputElement>('forgot-email');
const forgotMsg = byId<HTMLDivElement>('forgot-msg');
const forgotCancel = byId<HTMLButtonElement>('forgot-cancel');
const forgotSubmit = byId<HTMLButtonElement>('forgot-submit');

function openForgotModal(): void {
    forgotEmailInput.value = emailInput.value.trim();
    forgotMsg.className = 'form-msg';
    forgotMsg.textContent = '';
    forgotModal.classList.add('show');
    window.setTimeout(() => forgotEmailInput.focus(), 50);
}

function closeForgotModal(): void {
    forgotModal.classList.remove('show');
}

function setForgotMsg(kind: 'ok' | 'err', text: string): void {
    forgotMsg.className = `form-msg show ${kind}`;
    forgotMsg.textContent = text;
}

forgotLink?.addEventListener('click', (e) => {
    e.preventDefault();
    openForgotModal();
});

forgotCancel.addEventListener('click', closeForgotModal);

forgotModal.addEventListener('click', (e) => {
    if (e.target === forgotModal) closeForgotModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && forgotModal.classList.contains('show')) {
        closeForgotModal();
    }
});

forgotSubmit.addEventListener('click', async () => {
    const email = forgotEmailInput.value.trim();

    if (!email || validateEmailDetailed(email).state !== 'ok') {
        setForgotMsg('err', t('invalidEmail'));
        return;
    }

    forgotSubmit.disabled = true;
    const originalLabel = forgotSubmit.textContent ?? '';
    forgotSubmit.textContent = t('submitting');

    try {
        await requestPasswordReset(email);
        showToast(t('forgotSuccess'), 'ok', { duration: 6000 });
        closeForgotModal();
    } catch (err) {
        if (err instanceof FirebaseError) {
            switch (err.code) {
                case 'auth/invalid-email':
                    setForgotMsg('err', t('invalidEmail'));
                    break;
                case 'auth/user-not-found':
                    // Silently succeed — don't leak registered addresses
                    showToast(t('forgotSuccess'), 'ok', { duration: 6000 });
                    closeForgotModal();
                    break;
                case 'auth/too-many-requests':
                    setForgotMsg('err', t('tooManyRequests'));
                    break;
                case 'auth/network-request-failed':
                    setForgotMsg('err', t('networkError'));
                    break;
                default:
                    console.error('[login] forgot-password failed', err);
                    setForgotMsg('err', t('unknownError'));
            }
        } else {
            console.error('[login] forgot-password failed', err);
            setForgotMsg('err', t('unknownError'));
        }
    } finally {
        forgotSubmit.disabled = false;
        forgotSubmit.textContent = originalLabel;
    }
});
