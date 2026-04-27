/**
 * Settings page entry point.
 *
 * Responsibilities:
 *   1. Auth guard (redirect to login.html if anonymous).
 *   2. Translations + language switcher.
 *   3. Tab navigation (profile / security / preferences / account).
 *   4. Profile edit: live email validation, username/email uniqueness, save.
 *   5. Security: change password for local users; lock UI for Google users.
 *   6. Preferences: sound + anim toggles persisted in `sao_prefs`.
 *   7. Account: logout + delete-account modal with confirm-by-typing-username.
 */

import type { User } from '@models/user';
import { FirebaseError } from 'firebase/app';
import {
    applyAnimationPref,
    byId,
    byIdMaybe,
    changeEmail,
    changePassword,
    deleteCurrentUser,
    formatUserDisplayName,
    getCurrentLanguage,
    getPrefs,
    initI18n,
    initLangSwitcher,
    isUsernameAvailable,
    onLanguageChange,
    registerTranslations,
    requireAuth,
    setPrefs,
    showToast,
    signOut,
    t,
    updateUser,
    validateEmailDetailed,
    validateUsernameDetailed,
    whenAuthReady,
} from '@lib';
import {
    buildDict,
    common as commonDict,
    settingsTranslations as settingsDict,
} from '@translations';
import type { CommonDict, SettingsDict } from '@translations';

// ===== Boot =====

applyAnimationPref();
registerTranslations(buildDict('settings'));
initI18n();

// Auth guard — redirects to /login.html and throws if anonymous
let user!: User;
let isGoogle = false;
let authResolved = false;
const authReady = whenAuthReady().then(() => {
    user = requireAuth('login.html');
    isGoogle = user.provider === 'google';
    authResolved = true;
    renderProfile();
    renderSecurity();
    syncDeleteConfirmState();
    deletePasswordRow.hidden = isGoogle;
});

void authReady.catch((err) => {
    if (err instanceof Error && err.message === 'Not authenticated') {
        return;
    }
    console.error('[settings] auth init failed', err);
});

initLangSwitcher({
    switcher: byId('lang-switcher'),
    button: byId('lang-btn'),
    currentLabel: byIdMaybe('current-lang'),
});

// Keep <title> in sync with the active language
const syncDocTitle = () => {
    document.title = `${t('title')} | Sword Art Online`;
};
syncDocTitle();
onLanguageChange(syncDocTitle);

// ===== Typed dict access =====

/**
 * Return merged (common + settings) dictionary for the active locale.
 * Needed because `emailMsg` lives in common.ts, and `msg` lives in settings.ts.
 */
function currentDict(): CommonDict & SettingsDict {
    const lang = getCurrentLanguage();
    return { ...commonDict[lang], ...settingsDict[lang] };
}

// ===== Tab switching =====

const tabs = Array.from(document.querySelectorAll<HTMLElement>('.nav-item'));
tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        if (!target) return;
        tabs.forEach((b) => b.classList.toggle('active', b === btn));
        document.querySelectorAll<HTMLElement>('.tab').forEach((panel) => {
            panel.classList.toggle('active', panel.id === `tab-${target}`);
        });
    });
});

// ===== Profile tab =====

const avatarDisplay = byId<HTMLDivElement>('avatar-display');
const avatarName = byId<HTMLHeadingElement>('avatar-name');
const avatarEmail = byId('avatar-email');
const providerBadge = byId('provider-badge');
const inputUsername = byId<HTMLInputElement>('input-username');
const inputFirstName = byId<HTMLInputElement>('input-first-name');
const inputLastName = byId<HTMLInputElement>('input-last-name');
const inputEmail = byId<HTMLInputElement>('input-email');
const usernameMsg = byId('username-msg');
const emailMsg = byId('email-msg');

function renderProfile(): void {
    const displayName = formatUserDisplayName(user);
    if (user.avatar) {
        const img = document.createElement('img');
        img.src = user.avatar;
        img.alt = displayName;
        img.referrerPolicy = 'no-referrer';
        avatarDisplay.replaceChildren(img);
    } else {
        avatarDisplay.textContent = (displayName || '?').charAt(0).toUpperCase();
    }
    avatarName.textContent = displayName || '-';
    avatarEmail.textContent = user.email || '-';
    providerBadge.textContent = user.provider || 'local';

    inputUsername.value = user.name || '';
    inputFirstName.value = user.firstName || '';
    inputLastName.value = user.lastName || '';
    inputEmail.value = user.email || '';
    inputEmail.disabled = isGoogle;
}

function resetMsg(msgEl: HTMLElement, inputEl: HTMLInputElement): void {
    msgEl.classList.remove('show', 'ok', 'err');
    inputEl.classList.remove('error');
}

function setMsg(
    msgEl: HTMLElement,
    inputEl: HTMLInputElement,
    text: string,
    kind: 'ok' | 'err',
): void {
    msgEl.textContent = text;
    msgEl.classList.add('show', kind);
    inputEl.classList.toggle('error', kind === 'err');
}

byId<HTMLButtonElement>('save-profile-btn').addEventListener('click', async () => {
    await authReady;
    if (!authResolved) return;
    resetMsg(usernameMsg, inputUsername);
    resetMsg(emailMsg, inputEmail);

    const dict = currentDict();

    const newUsername = inputUsername.value.trim();
    const newFirstName = inputFirstName.value.trim();
    const newLastName = inputLastName.value.trim();
    const newEmail = inputEmail.value.trim();
    const emailChanged = newEmail.toLowerCase() !== (user.email || '').toLowerCase();
    const firstNameChanged = newFirstName !== (user.firstName || '').trim();
    const lastNameChanged = newLastName !== (user.lastName || '').trim();

    // ---- Username validation ----
    const usernameValidation = validateUsernameDetailed(newUsername);
    if (usernameValidation.state !== 'ok') {
        setMsg(usernameMsg, inputUsername, dict.msg.usernameShort, 'err');
        return;
    }

    // ---- Email validation (only if the field changed) ----
    if (emailChanged) {
        if (validateEmailDetailed(newEmail).state !== 'ok') {
            setMsg(emailMsg, inputEmail, dict.msg.emailBad, 'err');
            return;
        }
    }

    const lowerNew = newUsername.toLowerCase();
    const currentLower = (user.name || '').toLowerCase();
    const usernameChanged = lowerNew !== currentLower;

    const profileUpdates: Partial<User> = {};
    if (usernameChanged) profileUpdates.name = newUsername;
    if (firstNameChanged) profileUpdates.firstName = newFirstName;
    if (lastNameChanged) profileUpdates.lastName = newLastName;

    // Nothing to do
    if (Object.keys(profileUpdates).length === 0 && !emailChanged) {
        showToast(dict.msg.profileSaved, 'ok');
        return;
    }

    // ---- Username: uniqueness + save ----
    if (usernameChanged) {
        try {
            if (!(await isUsernameAvailable(lowerNew))) {
                setMsg(usernameMsg, inputUsername, dict.msg.usernameTaken, 'err');
                return;
            }
        } catch {
            // Best-effort pre-check; if it fails the write itself will catch conflicts.
        }
    }

    if (Object.keys(profileUpdates).length > 0) {
        try {
            const saved = await updateUser(profileUpdates);
            if (saved) {
                user.name = saved.name;
                user.firstName = saved.firstName;
                user.lastName = saved.lastName;
                user.avatar = saved.avatar;
                renderProfile();
            }
        } catch (err) {
            console.error('[settings] profile save failed', err);
            showToast(
                err instanceof Error ? err.message : String(err),
                'err',
            );
            return;
        }
    }

    // ---- Email: defer to the verification modal ----
    if (emailChanged) {
        openEmailChangeModal(newEmail);
        return;
    }

    showToast(dict.msg.profileSaved, 'ok');
});

// ===== Email-change verification modal =====

const emailModal = byId<HTMLDivElement>('email-modal');
const emailModalPw = byId<HTMLInputElement>('email-modal-pw');
const emailModalMsg = byId<HTMLDivElement>('email-modal-msg');
const emailModalCancel = byId<HTMLButtonElement>('email-modal-cancel');
const emailModalSubmit = byId<HTMLButtonElement>('email-modal-submit');
let pendingNewEmail = '';

function openEmailChangeModal(newEmail: string): void {
    pendingNewEmail = newEmail;
    emailModalPw.value = '';
    emailModalMsg.className = 'form-msg';
    emailModalMsg.textContent = '';
    emailModal.classList.add('show');
    window.setTimeout(() => emailModalPw.focus(), 50);
}

function closeEmailChangeModal(): void {
    emailModal.classList.remove('show');
    pendingNewEmail = '';
}

function setEmailModalMsg(kind: 'ok' | 'err', text: string): void {
    emailModalMsg.className = `form-msg show ${kind}`;
    emailModalMsg.textContent = text;
}

emailModalCancel.addEventListener('click', () => {
    closeEmailChangeModal();
    // Revert the input to avoid a stale "pending" value.
    inputEmail.value = user.email || '';
});

emailModal.addEventListener('click', (e) => {
    if (e.target === emailModal) closeEmailChangeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && emailModal.classList.contains('show')) {
        closeEmailChangeModal();
    }
});

emailModalSubmit.addEventListener('click', async () => {
    await authReady;
    if (!authResolved) return;
    const dict = currentDict();
    const pw = emailModalPw.value;

    if (!pw) {
        setEmailModalMsg('err', dict.msg.currentPwRequired);
        return;
    }
    if (!pendingNewEmail) {
        closeEmailChangeModal();
        return;
    }

    emailModalSubmit.disabled = true;
    const originalLabel = emailModalSubmit.textContent ?? '';
    emailModalSubmit.textContent = t('submitting');

    try {
        await changeEmail(pendingNewEmail, pw);
        showToast(dict.msg.emailChangeSent, 'ok', { duration: 8000 });
        closeEmailChangeModal();
        // Don't mutate user.email yet — it's only real once the link is clicked.
    } catch (err) {
        if (err instanceof FirebaseError) {
            switch (err.code) {
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    setEmailModalMsg('err', dict.msg.pwCurrentWrong);
                    break;
                case 'auth/invalid-email':
                    setEmailModalMsg('err', dict.msg.emailBad);
                    break;
                case 'auth/email-already-in-use':
                    setEmailModalMsg('err', dict.msg.emailTaken);
                    break;
                case 'auth/requires-recent-login':
                    setEmailModalMsg('err', dict.msg.reauthRequired);
                    break;
                case 'auth/too-many-requests':
                    setEmailModalMsg('err', dict.msg.pwTooManyRequests);
                    break;
                default:
                    console.error('[settings] changeEmail failed', err);
                    setEmailModalMsg('err', dict.msg.unknownError);
            }
        } else {
            console.error('[settings] changeEmail failed', err);
            setEmailModalMsg(
                'err',
                err instanceof Error ? err.message : String(err),
            );
        }
    } finally {
        emailModalSubmit.disabled = false;
        emailModalSubmit.textContent = originalLabel;
    }
});

// ===== Security tab =====

function renderSecurity(): void {
    const localBlock = byId('security-local');
    const googleBlock = byId('security-google');
    if (isGoogle) {
        localBlock.style.display = 'none';
        googleBlock.style.display = '';
    } else {
        localBlock.style.display = '';
        googleBlock.style.display = 'none';
    }
}

const currentPwInput = byIdMaybe<HTMLInputElement>('current-password');
const newPwInput = byIdMaybe<HTMLInputElement>('new-password');
const confirmPwInput = byIdMaybe<HTMLInputElement>('confirm-password');
const pwMsg = byIdMaybe('pw-msg');
const changePwBtn = byIdMaybe<HTMLButtonElement>('change-pw-btn');

if (changePwBtn && currentPwInput && newPwInput && confirmPwInput && pwMsg) {
    changePwBtn.addEventListener('click', async () => {
        await authReady;
        if (!authResolved) return;
        const dict = currentDict();
        resetMsg(pwMsg, currentPwInput);
        newPwInput.classList.remove('error');
        confirmPwInput.classList.remove('error');

        const current = currentPwInput.value;
        const newPw = newPwInput.value;
        const confirm = confirmPwInput.value;

        if (current.length === 0) {
            setMsg(pwMsg, currentPwInput, dict.msg.pwCurrentWrong, 'err');
            return;
        }

        if (newPw.length < 6) {
            setMsg(pwMsg, newPwInput, dict.msg.pwShort, 'err');
            return;
        }

        if (newPw !== confirm) {
            setMsg(pwMsg, confirmPwInput, dict.msg.pwMismatch, 'err');
            return;
        }

        changePwBtn.disabled = true;
        try {
            await changePassword(current, newPw);
            currentPwInput.value = '';
            newPwInput.value = '';
            confirmPwInput.value = '';
            showToast(dict.msg.pwChanged, 'ok');
        } catch (err) {
            if (err instanceof FirebaseError) {
                if (
                    err.code === 'auth/wrong-password' ||
                    err.code === 'auth/invalid-credential'
                ) {
                    setMsg(pwMsg, currentPwInput, dict.msg.pwCurrentWrong, 'err');
                    return;
                }
                if (err.code === 'auth/weak-password') {
                    setMsg(pwMsg, newPwInput, dict.msg.pwShort, 'err');
                    return;
                }
                if (err.code === 'auth/too-many-requests') {
                    showToast(dict.msg.pwTooManyRequests, 'err', { duration: 6000 });
                    return;
                }
            }
            console.error('[settings] change password failed', err);
            showToast(
                err instanceof Error ? err.message : String(err),
                'err',
            );
        } finally {
            changePwBtn.disabled = false;
        }
    });
}

// ===== Preferences tab (sound / anim toggles) =====

function setupToggle(elementId: string, prefKey: 'sound' | 'anim'): void {
    const el = byId(elementId);
    // Default sound = off, default anim = on (matches legacy behaviour)
    const defaults = { sound: false, anim: true } as const;
    const initial = getPrefs()[prefKey] ?? defaults[prefKey];
    el.classList.toggle('on', initial);

    el.addEventListener('click', () => {
        const prefs = getPrefs();
        const next = !(prefs[prefKey] ?? defaults[prefKey]);
        setPrefs({ ...prefs, [prefKey]: next });
        el.classList.toggle('on', next);

        // Anim has an immediate visual effect on the current page
        if (prefKey === 'anim') {
            document.documentElement.classList.toggle('no-anim', !next);
        }
    });
}

setupToggle('toggle-sound', 'sound');
setupToggle('toggle-anim', 'anim');

// ===== Account tab =====

byId<HTMLButtonElement>('logout-btn').addEventListener('click', async () => {
    try {
        await signOut();
    } catch (err) {
        console.error('[settings] signOut failed', err);
    }
    showToast(currentDict().msg.loggedOut, 'ok');
    window.setTimeout(() => {
        window.location.href = 'index.html';
    }, 800);
});

// Delete-account modal
const deleteModal = byId('delete-modal');
const deleteBtn = byId<HTMLButtonElement>('delete-btn');
const deleteCancelBtn = byId<HTMLButtonElement>('delete-cancel');
const deleteConfirmBtn = byId<HTMLButtonElement>('delete-confirm');
const deleteInput = byId<HTMLInputElement>('delete-confirm-input');
const deletePasswordRow = byId<HTMLDivElement>('delete-password-row');
const deletePasswordInput = byId<HTMLInputElement>('delete-password-input');
const deleteModalMsg = byId<HTMLDivElement>('delete-modal-msg');

function resetDeleteModalState(): void {
    deleteModalMsg.className = 'form-msg';
    deleteModalMsg.textContent = '';
    deletePasswordInput.classList.remove('error');
}

function setDeleteModalMsg(kind: 'ok' | 'err', text: string): void {
    deleteModalMsg.className = `form-msg show ${kind}`;
    deleteModalMsg.textContent = text;
}

function syncDeleteConfirmState(): void {
    if (!authResolved) {
        deleteConfirmBtn.disabled = true;
        return;
    }
    const usernameMatches = deleteInput.value.trim() === user.name;
    const passwordReady = isGoogle || deletePasswordInput.value.length > 0;
    deleteConfirmBtn.disabled = !usernameMatches || !passwordReady;
}

deleteBtn.addEventListener('click', () => {
    if (!authResolved) return;
    deleteInput.value = '';
    deletePasswordInput.value = '';
    deletePasswordRow.hidden = isGoogle;
    resetDeleteModalState();
    syncDeleteConfirmState();
    deleteModal.classList.add('show');
    deleteInput.focus();
});

deleteCancelBtn.addEventListener('click', () => {
    deleteModal.classList.remove('show');
});

deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) deleteModal.classList.remove('show');
});

deleteInput.addEventListener('input', () => {
    syncDeleteConfirmState();
});

deletePasswordInput.addEventListener('input', () => {
    deletePasswordInput.classList.remove('error');
    resetDeleteModalState();
    syncDeleteConfirmState();
});

deleteConfirmBtn.addEventListener('click', async () => {
    await authReady;
    if (!authResolved) return;
    const dict = currentDict();
    resetDeleteModalState();

    const currentPassword = deletePasswordInput.value;
    if (!isGoogle && currentPassword.length === 0) {
        deletePasswordInput.classList.add('error');
        setDeleteModalMsg('err', dict.msg.currentPwRequired);
        syncDeleteConfirmState();
        return;
    }

    deleteConfirmBtn.disabled = true;
    try {
        await deleteCurrentUser(currentPassword);
        deleteModal.classList.remove('show');
        showToast(dict.msg.accountDeleted, 'ok');
        window.setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (err) {
        if (err instanceof FirebaseError) {
            if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                deletePasswordInput.classList.add('error');
                setDeleteModalMsg('err', dict.msg.pwCurrentWrong);
                return;
            }
            if (err.code === 'auth/popup-blocked') {
                setDeleteModalMsg('err', dict.msg.reauthRequired);
                return;
            }
            if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
                setDeleteModalMsg('err', dict.msg.reauthRequired);
                return;
            }
            if (err.code === 'auth/requires-recent-login') {
                setDeleteModalMsg('err', dict.msg.reauthRequired);
                return;
            }
        }
        console.error('[settings] delete account failed', err);
        showToast(
            err instanceof Error ? err.message : String(err),
            'err',
        );
    } finally {
        syncDeleteConfirmState();
    }
});

// ===== Init =====
