/**
 * Auth-action page entry point.
 *
 * Handles the Firebase Auth email-link landing flows that the SDK normally
 * hosts at `<project>.firebaseapp.com/__/auth/action`:
 *
 *   - `mode=resetPassword`        — user opens link from "forgot password"
 *                                   email; we let them pick a new password.
 *   - `mode=verifyEmail`          — first-time email verification after
 *                                   `sendEmailVerification`.
 *   - `mode=verifyAndChangeEmail` — email-change flow triggered by
 *                                   `verifyBeforeUpdateEmail`.
 *   - `mode=recoverEmail`         — user clicks the "this wasn't me" link
 *                                   from an email-change notice; we revert
 *                                   the address.
 *
 * Setup requirement (Firebase Console → Authentication → Templates):
 *   For each template, edit Action URL and set it to
 *   `https://<your-domain>/auth-action`.
 */

import { FirebaseError } from 'firebase/app';
import {
    applyActionCode,
    checkActionCode,
    confirmPasswordReset,
    verifyPasswordResetCode,
} from 'firebase/auth';

import {
    applyAnimationPref,
    auth,
    byId,
    byIdMaybe,
    initI18n,
    initLangSwitcher,
    isSupportedLanguage,
    onLanguageChange,
    passwordStrengthDetailed,
    registerTranslations,
    setActiveLanguage,
    t,
    tArray,
    tFn,
} from '@lib';
import { buildDict } from '@translations';
import type { Language } from '@models/user';

// ===== Language sync with Firebase `lang` URL param =====

const BCP47_TO_INTERNAL: Record<string, Language> = {
    ru: 'RU',
    en: 'EN',
    de: 'DE',
    fr: 'FR',
    pl: 'PL',
    es: 'ES',
    cs: 'CZ',
    it: 'IT',
};

const params = new URLSearchParams(window.location.search);
const urlLang = params.get('lang')?.toLowerCase();
const urlLangInternal = urlLang ? BCP47_TO_INTERNAL[urlLang] : undefined;

// ===== Boot =====

applyAnimationPref();
registerTranslations(buildDict('authAction'));
initI18n();

// If Firebase passed a language hint, apply it — it matches the template the
// email was rendered in, so the page will match what the user just read.
if (urlLangInternal && isSupportedLanguage(urlLangInternal)) {
    setActiveLanguage(urlLangInternal);
}

initLangSwitcher({
    switcher: byId('lang-switcher'),
    button: byId('lang-btn'),
    currentLabel: byIdMaybe('current-lang'),
});

// Keep document title synced
const syncDocTitle = () => {
    document.title = `${t('loadingTitle')} | Sword Art Online`;
};
syncDocTitle();
onLanguageChange(syncDocTitle);

// ===== Elements =====

const viewLoading = byId('view-loading');
const viewResetForm = byId('view-reset-form');
const viewSuccess = byId('view-success');
const viewError = byId('view-error');

const resetEmailEl = byId('reset-email');
const resetForm = byId<HTMLFormElement>('reset-form');
const newPasswordInput = byId<HTMLInputElement>('new-password');
const confirmPasswordInput = byId<HTMLInputElement>('confirm-password');
const resetSubmitBtn = byId<HTMLButtonElement>('reset-submit');

const successTitle = byId('success-title');
const successMsg = byId('success-msg');
const successCta = byId<HTMLAnchorElement>('success-cta');

const errorTitleEl = byId('error-title');
const errorMsgEl = byId('error-msg');

const matchIndicator = byId('match-indicator');
const matchText = byId('match-text');
const passwordStrength = byId('password-strength');
const strengthBars = passwordStrength.querySelectorAll<HTMLDivElement>('.strength-bar');
const strengthText = byId('strength-text');
const strengthHint = byId('strength-hint');

// ===== View switcher =====

type ViewId = 'loading' | 'reset-form' | 'success' | 'error';
const VIEWS: Record<ViewId, HTMLElement> = {
    loading: viewLoading,
    'reset-form': viewResetForm,
    success: viewSuccess,
    error: viewError,
};

function showView(id: ViewId): void {
    for (const [key, el] of Object.entries(VIEWS) as [ViewId, HTMLElement][]) {
        if (key === id) el.removeAttribute('hidden');
        else el.setAttribute('hidden', '');
    }
}

// ===== Error helpers =====

interface ShowErrorOptions {
    /** Custom title. Defaults to `errorTitle`. */
    titleKey?: string;
    /** Translation key for the message body. */
    msgKey?: string;
    /** Already-localised message (takes precedence over `msgKey`). */
    msg?: string;
}

function showError({ titleKey, msgKey, msg }: ShowErrorOptions = {}): void {
    errorTitleEl.textContent = t(titleKey ?? 'errorTitle');
    errorMsgEl.textContent = msg ?? (msgKey ? t(msgKey) : t('errorUnknown'));
    showView('error');
}

function showSuccess(titleKey: string, msgOrKey: string, isRawMsg = false): void {
    successTitle.textContent = t(titleKey);
    successMsg.textContent = isRawMsg ? msgOrKey : t(msgOrKey);
    successCta.textContent = t('toLogin');
    // Keep CTA stable for success → always drives the user back to sign-in
    successCta.href = 'login.html';
    showView('success');
}

/** Translate a FirebaseError → user-visible message key. */
function errorKeyFor(err: unknown): string {
    if (!(err instanceof FirebaseError)) return 'errorUnknown';
    switch (err.code) {
        case 'auth/expired-action-code':
            return 'errorExpired';
        case 'auth/invalid-action-code':
            return 'errorInvalid';
        case 'auth/user-disabled':
            return 'errorUserDisabled';
        case 'auth/user-not-found':
            return 'errorUserNotFound';
        case 'auth/weak-password':
            return 'errorWeakPassword';
        case 'auth/network-request-failed':
            return 'errorNetwork';
        default:
            return 'errorUnknown';
    }
}

// ===== Param parsing =====

const mode = params.get('mode');
const oobCode = params.get('oobCode');

// ===== Set-field-error helper (mirrors login/register) =====

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

// ===== Password strength + match indicator =====

function updatePasswordStrength(): void {
    const value = newPasswordInput.value;
    if (value.length === 0) {
        passwordStrength.classList.remove('show');
        return;
    }
    passwordStrength.classList.add('show');

    const { level, hint } = passwordStrengthDetailed(value);
    strengthBars.forEach((bar, i) => {
        bar.className = 'strength-bar';
        if (i < level) bar.classList.add(`active-${level}`);
    });

    const labels = tArray('strength');
    strengthText.textContent = labels[level - 1] ?? '';
    strengthHint.textContent = t(`strengthHints.${hint}`);
}

function updateMatchIndicator(): void {
    const pwd = newPasswordInput.value;
    const confirm = confirmPasswordInput.value;

    if (confirm.length === 0) {
        matchIndicator.className = 'match-indicator';
        matchText.textContent = '';
        return;
    }

    if (pwd === confirm) {
        matchIndicator.className = 'match-indicator ok';
        matchText.textContent = t('matchOk');
    } else {
        matchIndicator.className = 'match-indicator err';
        matchText.textContent = t('matchFail');
    }
}

newPasswordInput.addEventListener('input', () => {
    setFieldError('new-password', false);
    updatePasswordStrength();
    updateMatchIndicator();
});
confirmPasswordInput.addEventListener('input', () => {
    setFieldError('confirm-password', false);
    updateMatchIndicator();
});

// Keep strength/match labels in-sync when user switches language mid-flow
onLanguageChange(() => {
    updatePasswordStrength();
    updateMatchIndicator();
    if (!resetSubmitBtn.disabled) {
        resetSubmitBtn.textContent = t('resetSubmit');
    }
});

// ===== Reset-password form submission =====

resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!oobCode) return;

    const pwd = newPasswordInput.value;
    const confirm = confirmPasswordInput.value;

    let valid = true;
    if (pwd.length < 6) {
        setFieldError('new-password', true, t('passwordErr'));
        valid = false;
    }
    if (pwd !== confirm) {
        setFieldError('confirm-password', true, t('confirmErr'));
        valid = false;
    }
    if (!valid) return;

    resetSubmitBtn.disabled = true;
    resetSubmitBtn.textContent = t('resetSubmitting');

    try {
        await confirmPasswordReset(auth, oobCode, pwd);
        showSuccess('resetSuccessTitle', 'resetSuccessMsg');
    } catch (err) {
        console.error('[auth-action] confirmPasswordReset failed', err);
        resetSubmitBtn.disabled = false;
        resetSubmitBtn.textContent = t('resetSubmit');

        if (err instanceof FirebaseError && err.code === 'auth/weak-password') {
            setFieldError('new-password', true, t('errorWeakPassword'));
            return;
        }
        showError({ msgKey: errorKeyFor(err) });
    }
});

// ===== Main dispatcher =====

async function handleAction(): Promise<void> {
    if (!oobCode || !mode) {
        showError({ msgKey: 'errorMissingCode' });
        return;
    }

    try {
        switch (mode) {
            case 'resetPassword': {
                const email = await verifyPasswordResetCode(auth, oobCode);
                resetEmailEl.textContent = email;
                showView('reset-form');
                window.setTimeout(() => newPasswordInput.focus(), 50);
                break;
            }

            case 'verifyEmail':
            case 'verifyAndChangeEmail': {
                await applyActionCode(auth, oobCode);
                showSuccess('verifyTitle', 'verifySuccessMsg');
                break;
            }

            case 'recoverEmail': {
                const info = await checkActionCode(auth, oobCode);
                const restoredEmail = info.data.email ?? '';
                await applyActionCode(auth, oobCode);
                showSuccess(
                    'recoverTitle',
                    tFn('recoverSuccessMsg', restoredEmail),
                    true,
                );
                break;
            }

            default:
                showError({ msgKey: 'errorUnknownMode' });
        }
    } catch (err) {
        console.error('[auth-action] action failed', err);
        showError({ msgKey: errorKeyFor(err) });
    }
}

void handleAction();
