/**
 * Register page entry point.
 *
 * Responsibilities:
 *   1. Register translations and initialise i18n.
 *   2. Wire the language switcher.
 *   3. Real-time validation:
 *      - Username availability (length + charset + Firestore uniqueness).
 *      - Email structure + TLD + popular-brand check.
 *      - Password strength meter (4 levels + localised hint).
 *      - Password/confirm match indicator.
 *   4. Handle form submission → Firebase `signUp` → success screen.
 *
 * Email uniqueness is enforced by Firebase Auth on submit (no pre-check
 * possible without exposing registered emails to anonymous readers).
 */

import { FirebaseError } from 'firebase/app';
import {
    appendReturnTo,
    applyAnimationPref,
    byId,
    byIdMaybe,
    debounce,
    getCurrentLanguage,
    getReturnTo,
    initI18n,
    initLangSwitcher,
    isUsernameAvailable,
    markWelcome,
    onLanguageChange,
    passwordStrengthDetailed,
    registerTranslations,
    showToast,
    signInWithGoogle,
    signUp,
    t,
    validateEmailDetailed,
    validateUsernameDetailed,
} from '@lib';
import {
    buildDict,
    common as commonDict,
    registerTranslations as registerDict,
} from '@translations';
import type { CommonDict, RegisterDict } from '@translations';

// ===== Boot =====

applyAnimationPref();
registerTranslations(buildDict('register'));
initI18n();

const submitBtn = byId<HTMLButtonElement>('submit-btn');
const googleBtn = byIdMaybe<HTMLButtonElement>('google-btn');

initLangSwitcher({
    switcher: byId('lang-switcher'),
    button: byId('lang-btn'),
    currentLabel: byIdMaybe('current-lang'),
});

// Keep <title> in sync with current language
const syncDocTitle = () => {
    document.title = `${t('title')} | Sword Art Online`;
};
syncDocTitle();
onLanguageChange(syncDocTitle);

// Re-run all live validators when language changes (messages need re-rendering)
onLanguageChange(() => {
    renderAgreeText();
    checkUsername();
    checkEmail();
    renderPasswordStrength();
    renderPasswordMatch();
    if (!submitBtn.disabled) submitBtn.textContent = t('submit');
});

// ===== DOM references =====

const form = byId<HTMLFormElement>('register-form');
const container = byId<HTMLDivElement>('register-container');
const successView = byId<HTMLDivElement>('success-view');

const usernameInput = byId<HTMLInputElement>('username');
const usernameIndicator = byId('username-indicator');
const usernameText = byId('username-text');

const emailInput = byId<HTMLInputElement>('email');
const emailIndicator = byId('email-indicator');
const emailText = byId('email-text');

const passwordInput = byId<HTMLInputElement>('password');
const strengthWrap = byId('password-strength');
const strengthText = byId('strength-text');
const strengthHint = byId('strength-hint');

const confirmInput = byId<HTMLInputElement>('password-confirm');
const matchIndicator = byId('match-indicator');
const matchText = byId('match-text');

const agreeInput = byId<HTMLInputElement>('agree');
const agreeText = byId('agree-text');

// ===== Helpers =====

function enterSuccessState(): void {
    container.classList.add('done');
    successView.classList.add('show');

    let count = 3;
    const countdownEl = byId('countdown');
    countdownEl.textContent = String(count);
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

/**
 * Read the merged (common + register) dictionary for the active language.
 *
 * `emailMsg` lives in `common.ts` (shared with login), `nameMsg` /
 * `strengthHints` / `strength` live in `register.ts`. Merging here gives
 * call sites one typed object without having to juggle two imports.
 *
 * Equivalent in spirit to `buildDict('register')` but returns a single
 * locale's slice and keeps the intersection type (not flattened to
 * `TranslationDict`), so nested objects are strongly typed.
 */
function currentDict(): CommonDict & RegisterDict {
    const lang = getCurrentLanguage();
    return { ...commonDict[lang], ...registerDict[lang] };
}

/** Per-field error toggle (attached to `.form-error[data-for="..."]`). */
function setFieldError(fieldId: string, show: boolean): void {
    const input = byId<HTMLInputElement>(fieldId);
    const err = document.querySelector<HTMLElement>(`[data-for="${fieldId}"]`);
    if (!err) return;

    if (show) {
        input.classList.add('error');
        err.classList.add('show');
    } else {
        input.classList.remove('error');
        err.classList.remove('show');
    }
}

/** Render the agreement checkbox (contains `<a>` tags — needs innerHTML). */
function renderAgreeText(): void {
    agreeText.innerHTML = currentDict().agree;
}
renderAgreeText();

// Clear per-field error on input
['username', 'email', 'password', 'password-confirm'].forEach((id) => {
    byId<HTMLInputElement>(id).addEventListener('input', () => setFieldError(id, false));
});

// ===== Username availability =====

/**
 * Username availability is checked against Firestore. We track a monotonic
 * request token so an earlier slow response cannot overwrite a newer one.
 */
let usernameCheckToken = 0;

async function runUsernameAvailability(val: string, token: number): Promise<void> {
    const nm = currentDict().nameMsg;
    try {
        const free = await isUsernameAvailable(val);
        if (token !== usernameCheckToken) return; // superseded

        if (!free) {
            usernameIndicator.classList.remove('ok');
            usernameIndicator.classList.add('fail');
            usernameText.textContent = nm.taken;
            usernameInput.classList.remove('match-ok');
            return;
        }

        usernameIndicator.classList.remove('fail');
        usernameIndicator.classList.add('ok');
        usernameText.textContent = nm.ok;
        usernameInput.classList.add('match-ok');
    } catch {
        // Offline or Firestore unreachable — don't block registration here,
        // the real uniqueness check runs on submit anyway.
        if (token !== usernameCheckToken) return;
        usernameIndicator.classList.remove('fail');
        usernameIndicator.classList.add('ok');
        usernameText.textContent = nm.ok;
    }
}

const debouncedAvailability = debounce(
    (val: string, token: number) => {
        void runUsernameAvailability(val, token);
    },
    350,
);

function checkUsername(): void {
    const val = usernameInput.value.trim();
    const nm = currentDict().nameMsg;
    const token = ++usernameCheckToken;

    if (val.length === 0) {
        usernameIndicator.classList.remove('show', 'ok', 'fail');
        usernameInput.classList.remove('match-ok');
        return;
    }

    usernameIndicator.classList.add('show');
    usernameIndicator.classList.remove('ok', 'fail');
    usernameInput.classList.remove('match-ok');

    const result = validateUsernameDetailed(val);
    if (result.state === 'tooShort') {
        usernameIndicator.classList.add('fail');
        usernameText.textContent = nm.tooShort;
        return;
    }
    if (result.state === 'tooLong') {
        usernameIndicator.classList.add('fail');
        usernameText.textContent = nm.tooLong;
        return;
    }
    if (result.state === 'badChars') {
        // Not surfaced in legacy dictionary — reuse `tooShort` wording
        usernameIndicator.classList.add('fail');
        usernameText.textContent = nm.tooShort;
        return;
    }

    // Optimistic "checking" state — green kicks in once Firestore confirms
    usernameText.textContent = nm.ok;
    debouncedAvailability(val, token);
}

usernameInput.addEventListener('input', checkUsername);

// ===== Email validation =====

function checkEmail(): void {
    const val = emailInput.value.trim().toLowerCase();

    if (val.length === 0) {
        emailIndicator.classList.remove('show', 'ok', 'fail');
        emailInput.classList.remove('match-ok');
        return;
    }

    emailIndicator.classList.add('show');
    emailIndicator.classList.remove('ok', 'fail');
    emailInput.classList.remove('match-ok');

    const em = currentDict().emailMsg;
    const result = validateEmailDetailed(val);

    if (result.state !== 'ok') {
        emailIndicator.classList.add('fail');
        if (result.state === 'noTld') {
            emailText.textContent = em.noTld(result.tld);
        } else {
            emailText.textContent = em[result.state];
        }
        return;
    }

    // Structural check is all we can do client-side; Firebase reports
    // duplicates on submit with `auth/email-already-in-use`.
    emailIndicator.classList.add('ok');
    emailText.textContent = em.ok;
    emailInput.classList.add('match-ok');
}

emailInput.addEventListener('input', checkEmail);

// ===== Password strength =====

function renderPasswordStrength(): void {
    const pwd = passwordInput.value;
    if (pwd.length === 0) {
        strengthWrap.classList.remove('show');
        return;
    }
    strengthWrap.classList.add('show');

    const { level, hint } = passwordStrengthDetailed(pwd);
    strengthWrap.dataset.level = String(level);

    const dict = currentDict();
    strengthText.textContent = dict.strength[level - 1] ?? dict.strength[0] ?? '';
    strengthHint.textContent = dict.strengthHints[hint];
}

passwordInput.addEventListener('input', () => {
    renderPasswordStrength();
    renderPasswordMatch(); // password change also retests confirm
});

// ===== Password / confirm match =====

function renderPasswordMatch(): void {
    const pwd = passwordInput.value;
    const confirm = confirmInput.value;

    if (confirm.length === 0) {
        matchIndicator.classList.remove('show', 'ok', 'fail');
        confirmInput.classList.remove('match-ok');
        return;
    }

    matchIndicator.classList.add('show');

    if (pwd === confirm) {
        matchIndicator.classList.add('ok');
        matchIndicator.classList.remove('fail');
        matchText.textContent = t('matchOk');
        confirmInput.classList.add('match-ok');
    } else {
        matchIndicator.classList.add('fail');
        matchIndicator.classList.remove('ok');
        matchText.textContent = t('matchFail');
        confirmInput.classList.remove('match-ok');
    }
}

confirmInput.addEventListener('input', renderPasswordMatch);

// ===== Form submission =====

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const passwordConfirm = confirmInput.value;
    const agreed = agreeInput.checked;

    let valid = true;

    const nameCheck = validateUsernameDetailed(username);
    if (nameCheck.state !== 'ok') {
        setFieldError('username', true);
        valid = false;
    }

    const emailCheck = validateEmailDetailed(email);
    if (emailCheck.state !== 'ok') {
        setFieldError('email', true);
        valid = false;
    }

    if (password.length < 6) {
        setFieldError('password', true);
        valid = false;
    }

    if (password !== passwordConfirm || passwordConfirm.length === 0) {
        setFieldError('password-confirm', true);
        valid = false;
    }

    if (!agreed) {
        showToast(t('agreeAlert'), 'err');
        valid = false;
    }

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = t('submitting');
    if (googleBtn) googleBtn.disabled = true;

    try {
        await signUp(username, email, password, getCurrentLanguage());
        // Let the post-auth page show a one-shot "welcome" toast.
        markWelcome('new');
        enterSuccessState();
    } catch (err) {
        resetAuthButtons();

        // Our own "username taken" error from signUp()
        if (err instanceof Error && err.message === 'Username already taken') {
            const nm = currentDict().nameMsg;
            usernameIndicator.classList.add('show', 'fail');
            usernameIndicator.classList.remove('ok');
            usernameText.textContent = nm.taken;
            setFieldError('username', true);
            return;
        }

        if (err instanceof FirebaseError) {
            switch (err.code) {
                case 'auth/email-already-in-use': {
                    const em = currentDict().emailMsg;
                    emailIndicator.classList.add('show', 'fail');
                    emailIndicator.classList.remove('ok');
                    emailText.textContent = em.taken;
                    setFieldError('email', true);
                    return;
                }
                case 'auth/invalid-email':
                    setFieldError('email', true);
                    showToast(t('invalidEmailToast'), 'err');
                    return;
                case 'auth/weak-password':
                    setFieldError('password', true);
                    showToast(t('weakPasswordToast'), 'err');
                    return;
                case 'auth/too-many-requests':
                    showToast(t('tooManyRequestsToast'), 'err', { duration: 6000 });
                    return;
                case 'auth/network-request-failed':
                    showToast(t('networkErrorToast'), 'err');
                    return;
            }
        }

        console.error('[register] unexpected sign-up error', err);
        showToast(
            err instanceof Error ? err.message : String(err),
            'err',
        );
    }
});

googleBtn?.addEventListener('click', async () => {
    if (!agreeInput.checked) {
        showToast(t('agreeAlert'), 'err');
        return;
    }

    submitBtn.disabled = true;
    googleBtn.disabled = true;

    try {
        const result = await signInWithGoogle();
        markWelcome(result.isNewUser ? 'new' : 'back');

        if (result.isNewUser) {
            enterSuccessState();
            return;
        }

        window.location.href = getReturnTo();
    } catch (err) {
        resetAuthButtons();

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
                    showToast(t('networkErrorToast'), 'err');
                    return;
            }
        }

        console.error('[register] google sign-in failed', err);
        showToast(t('googleSignInError'), 'err');
    }
});

// Forward ?returnTo onto the "Sign in" link so users who click through
// to login retain the deep-link target they started with.
const loginLink = document.querySelector<HTMLAnchorElement>('.form-footer a[href="login.html"]');
if (loginLink) loginLink.href = appendReturnTo('login.html');

