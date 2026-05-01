/**
 * Authentication layer — Firebase Auth + Firestore-backed.
 *
 * Design:
 *   * Firebase Auth owns credentials; Firestore `users/{uid}` owns profile.
 *   * `onAuthStateChanged` is our source of truth — it fires on app boot,
 *     after sign-in/out, and across tabs. We mirror the result into a
 *     `localStorage` cache so synchronous callers (`currentUser()`,
 *     `requireAuth()`) can return something without awaiting Firestore
 *     on every page load.
 *   * The cache is eventually-consistent: it may be stale for a few
 *     milliseconds after a page load, but a subscribed listener will
 *     correct it as soon as Firestore responds.
 *
 * Public API (what pages consume):
 *   * `currentUser()`           — sync, cached snapshot (nullable)
 *   * `onCurrentUserChange(fn)` — subscribe to live changes
 *   * `whenAuthReady()`         — resolves once the initial auth state is
 *                                 known (for pages that cannot render on
 *                                 stale data)
 *   * `signUp(u, e, p)`         — async, creates Auth user + profile doc
 *   * `signIn(email, password)` — async, verifies credentials
 *   * `signOut()`               — async, clears session
 *   * `updateUser(partial)`     — async, updates `users/{uid}` + cache
 *   * `deleteCurrentUser()`     — async, deletes profile + Auth user
 *   * `isUsernameAvailable(u)`  — async, read `usernames/{u.toLowerCase()}`
 *   * `requireAuth(redirect?)`  — sync; redirects if cache says anonymous
 */

import {
    EmailAuthProvider,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    deleteUser,
    onAuthStateChanged,
    reauthenticateWithCredential,
    reauthenticateWithPopup,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut as firebaseSignOut,
    updatePassword,
    updateProfile,
    verifyBeforeUpdateEmail,
    type User as FirebaseUser,
} from 'firebase/auth';
import {
    deleteField,
    doc,
    getDoc,
    serverTimestamp,
    updateDoc,
    writeBatch,
    type Timestamp,
} from 'firebase/firestore';

import type { Language, User } from '../models/user'
import { auth, db } from './firebase';
import { getCurrentLanguage } from './i18n';
import { getCurrentUser, setCurrentUser, clearCurrentUser } from './storage';

/**
 * Map our internal language codes to the BCP-47 tags Firebase Auth
 * expects on `auth.languageCode`. Anything Firebase doesn't have a
 * template for silently falls back to English on their side.
 */
const LANGUAGE_TO_BCP47: Record<Language, string> = {
    ru: 'ru',
    en: 'en',
    de: 'de',
    fr: 'fr',
    pl: 'pl',
    es: 'es',
    cz: 'cz',
    it: 'it',
    ua: 'ua',
};

/**
 * Sync `auth.languageCode` with the active UI language. Called right
 * before every email-dispatching call so Firebase picks the matching
 * template (password-reset, verify-email, email-change).
 */
function applyAuthLanguage(): void {
    auth.languageCode = LANGUAGE_TO_BCP47[getCurrentLanguage()] ?? 'en';
}

// ===== Cache + subscription machinery =====

type Listener = (user: User | null) => void;
const listeners = new Set<Listener>();
let cachedUser: User | null = getCurrentUser();
let authReady = false;
const authReadyPromise = new Promise<void>((resolve) => {
    // Resolved by the first onAuthStateChanged tick below.
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
        try {
            if (fbUser) {
                const profile = await loadProfile(fbUser);
                updateCache(profile);
            } else {
                updateCache(null);
            }
        } finally {
            if (!authReady) {
                authReady = true;
                resolve();
                unsub(); // first-tick subscription served its purpose
                // Re-subscribe for subsequent auth events.
                onAuthStateChanged(auth, (u) => {
                    void (async () => {
                        if (u) {
                            updateCache(await loadProfile(u));
                        } else {
                            updateCache(null);
                        }
                    })();
                });
            }
        }
    });
});

function updateCache(next: User | null): void {
    cachedUser = next;
    if (next) {
        setCurrentUser(next);
    } else {
        clearCurrentUser();
    }
    for (const fn of listeners) fn(next);
}

// ===== Profile loader =====

interface UserProfileDoc {
    username: string;
    email: string;
    createdAt: Timestamp;
    language: Language;
    preferences?: Record<string, unknown>;
    avatar?: string;
    firstName?: string;
    lastName?: string;
}

async function syncProfileEmail(
    fbUser: FirebaseUser,
    data: UserProfileDoc | null,
): Promise<void> {
    const authEmail = fbUser.email?.trim() ?? '';
    const profileEmail = data?.email?.trim() ?? '';
    if (!authEmail || !data || authEmail === profileEmail) return;

    try {
        await fbUser.getIdToken(true);
        await updateDoc(doc(db, 'users', fbUser.uid), {
            email: authEmail,
        });
    } catch (err) {
        console.warn('[auth] profile email sync failed', err);
    }
}

async function loadProfile(fbUser: FirebaseUser): Promise<User> {
    const snap = await getDoc(doc(db, 'users', fbUser.uid));
    const data = snap.exists() ? (snap.data() as UserProfileDoc) : null;
    void syncProfileEmail(fbUser, data);

    return {
        name: data?.username ?? fbUser.displayName ?? fbUser.email?.split('@')[0] ?? '',
        email: fbUser.email ?? data?.email ?? '',
        firstName: data?.firstName,
        lastName: data?.lastName,
        provider: fbUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'local',
        createdAt: data?.createdAt?.toDate().toISOString() ?? new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        avatar: data?.avatar ?? fbUser.photoURL ?? undefined,
    };
}

export async function getUserProfileById(uid: string): Promise<User | null> {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;

    const data = snap.data() as UserProfileDoc;
    return {
        name: data.username ?? '',
        email: data.email ?? '',
        firstName: data.firstName,
        lastName: data.lastName,
        createdAt: data.createdAt?.toDate().toISOString() ?? undefined,
        avatar: data.avatar,
    };
}

export function formatUserDisplayName(user: Pick<User, 'name' | 'email' | 'firstName' | 'lastName'> | null | undefined): string {
    const firstName = user?.firstName?.trim() ?? '';
    const lastName = user?.lastName?.trim() ?? '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
    if (fullName) return fullName.slice(0, 80).trim();

    const username = user?.name?.trim() ?? '';
    if (username) return username.slice(0, 80).trim();

    const emailLocal = user?.email?.split('@')[0]?.trim() ?? '';
    if (emailLocal) return emailLocal.slice(0, 80).trim();

    return 'User';
}

// ===== Public API =====

/** Synchronous snapshot of the cached session. Nullable. */
export function currentUser(): User | null {
    return cachedUser;
}

/** Subscribe to live changes. Returns an unsubscribe fn. */
export function onCurrentUserChange(fn: Listener): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
}

/** Resolves when the first `onAuthStateChanged` tick has landed. */
export function whenAuthReady(): Promise<void> {
    return authReadyPromise;
}

/** Availability check for the registration form. Case-insensitive. */
export async function isUsernameAvailable(username: string): Promise<boolean> {
    const key = username.trim().toLowerCase();
    if (!key) return false;
    const snap = await getDoc(doc(db, 'usernames', key));
    return !snap.exists();
}

function sanitizeUsernameSeed(value: string | null | undefined): string {
    return (value ?? '')
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^A-Za-z0-9_-]+/g, '')
        .slice(0, 20);
}

function googleUsernameBase(fbUser: FirebaseUser): string {
    const fromDisplayName = sanitizeUsernameSeed(fbUser.displayName);
    const fromEmail = sanitizeUsernameSeed(fbUser.email?.split('@')[0] ?? '');
    const fallback = `player${fbUser.uid.replace(/[^A-Za-z0-9]/g, '').slice(0, 10)}`;
    const candidate = fromDisplayName || fromEmail || fallback;
    if (candidate.length >= 3) return candidate;
    return `${candidate}${fbUser.uid.replace(/[^A-Za-z0-9]/g, '').slice(0, 20 - candidate.length)}`.slice(0, 20);
}

async function generateGoogleUsername(fbUser: FirebaseUser): Promise<string> {
    const base = googleUsernameBase(fbUser);
    if (await isUsernameAvailable(base)) return base;

    for (let index = 2; index < 200; index++) {
        const suffix = String(index);
        const candidate = `${base.slice(0, Math.max(3, 20 - suffix.length))}${suffix}`;
        if (await isUsernameAvailable(candidate)) return candidate;
    }

    return `g${fbUser.uid.replace(/[^A-Za-z0-9]/g, '').slice(0, 19)}`;
}

function splitGoogleDisplayName(displayName: string | null | undefined): Pick<UserProfileDoc, 'firstName' | 'lastName'> {
    const parts = (displayName ?? '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return {};

    const firstName = parts[0]?.slice(0, 40);
    const lastName = parts.slice(1).join(' ').slice(0, 40);
    return {
        ...(firstName ? { firstName } : {}),
        ...(lastName ? { lastName } : {}),
    };
}

async function ensureGoogleProfile(fbUser: FirebaseUser): Promise<boolean> {
    const profileRef = doc(db, 'users', fbUser.uid);
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) return false;

    const username = await generateGoogleUsername(fbUser);
    const nameParts = splitGoogleDisplayName(fbUser.displayName);
    const batch = writeBatch(db);
    batch.set(profileRef, {
        username,
        email: fbUser.email?.trim() ?? '',
        createdAt: serverTimestamp(),
        language: getCurrentLanguage(),
        preferences: {},
        ...(fbUser.photoURL ? { avatar: fbUser.photoURL } : {}),
        ...nameParts,
    });
    batch.set(doc(db, 'usernames', username.toLowerCase()), { uid: fbUser.uid });
    await batch.commit();
    return true;
}

export interface GoogleSignInResult {
    user: User;
    isNewUser: boolean;
}

export interface GoogleSignInOptions {
    allowProfileBootstrap?: boolean;
}

export const GOOGLE_PROFILE_SETUP_REQUIRED_ERROR = 'Google profile setup required';

/**
 * Sign up a brand-new user.
 *
 * Sequence:
 *   1. `createUserWithEmailAndPassword` — may throw `auth/email-already-in-use`
 *   2. `updateProfile` sets `displayName`
 *   3. Batch: `users/{uid}` profile doc + `usernames/{lower}` reservation
 *   4. Update local cache so `currentUser()` is immediately populated
 *
 * Email uniqueness is guaranteed by Firebase Auth; username uniqueness is
 * best-effort (a race between two sign-ups picking the same name is
 * possible — the loser's batch write will fail and they should retry).
 */
export async function signUp(
    username: string,
    email: string,
    password: string,
    language: Language = 'ru',
): Promise<User> {
    const usernameLower = username.trim().toLowerCase();

    // Pre-check for a nicer error than a rules rejection
    if (!(await isUsernameAvailable(usernameLower))) {
        throw new Error('Username already taken');
    }

    const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
    );

    try {
        await updateProfile(cred.user, { displayName: username });

        const batch = writeBatch(db);
        batch.set(doc(db, 'users', cred.user.uid), {
            username,
            email: email.trim(),
            createdAt: serverTimestamp(),
            language,
            preferences: {},
        });
        batch.set(doc(db, 'usernames', usernameLower), { uid: cred.user.uid });
        await batch.commit();
    } catch (err) {
        // If profile write fails, delete the orphaned Auth user so the email
        // is freed for a retry. Best-effort; swallow delete errors.
        await deleteUser(cred.user).catch(() => { /* noop */ });
        throw err;
    }

    const user = await loadProfile(cred.user);
    updateCache(user);
    return user;
}

/** Sign in with email + password. Throws on invalid credentials. */
export async function signIn(email: string, password: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = await loadProfile(cred.user);
    updateCache(user);
    return user;
}

export async function signInWithGoogle(options: GoogleSignInOptions = {}): Promise<GoogleSignInResult> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const cred = await signInWithPopup(auth, provider);
    const allowProfileBootstrap = options.allowProfileBootstrap ?? true;
    if (!allowProfileBootstrap) {
        const profileSnap = await getDoc(doc(db, 'users', cred.user.uid));
        if (!profileSnap.exists()) {
            await firebaseSignOut(auth);
            updateCache(null);
            throw new Error(GOOGLE_PROFILE_SETUP_REQUIRED_ERROR);
        }
    }
    const isNewUser = await ensureGoogleProfile(cred.user);
    const user = await loadProfile(cred.user);
    updateCache(user);
    return { user, isNewUser };
}

/** End the current session. */
export async function signOut(): Promise<void> {
    await firebaseSignOut(auth);
    updateCache(null);
}

/**
 * Patch the Firestore profile document. `email` and `createdAt` are
 * rejected by the security rules, so we strip them here too.
 */
export async function updateUser(updates: Partial<User>): Promise<User | null> {
    const fbUser = auth.currentUser;
    if (!fbUser) return null;

    const current = await loadProfile(fbUser);
    const patch: Record<string, unknown> = {};
    const nextUsername = updates.name?.trim();
    const currentUsername = current.name.trim();
    const usernameChanged = nextUsername !== undefined
        && nextUsername.toLowerCase() !== currentUsername.toLowerCase();

    if (nextUsername !== undefined) patch.username = nextUsername;
    if (updates.avatar !== undefined) patch.avatar = updates.avatar;
    if (updates.firstName !== undefined) {
        patch.firstName = updates.firstName.trim() || deleteField();
    }
    if (updates.lastName !== undefined) {
        patch.lastName = updates.lastName.trim() || deleteField();
    }

    if (Object.keys(patch).length > 0) {
        if (usernameChanged && nextUsername) {
            const nextUsernameLower = nextUsername.toLowerCase();
            const reserved = await getDoc(doc(db, 'usernames', nextUsernameLower));
            if (reserved.exists() && reserved.data()?.uid !== fbUser.uid) {
                throw new Error('Username already taken');
            }

            const batch = writeBatch(db);
            batch.update(doc(db, 'users', fbUser.uid), patch);
            if (currentUsername) {
                batch.delete(doc(db, 'usernames', currentUsername.toLowerCase()));
            }
            batch.set(doc(db, 'usernames', nextUsernameLower), { uid: fbUser.uid });
            await batch.commit();
        } else {
            await updateDoc(doc(db, 'users', fbUser.uid), patch);
        }
    }

    if (nextUsername !== undefined && nextUsername !== fbUser.displayName) {
        await updateProfile(fbUser, { displayName: nextUsername });
    }

    const user = await loadProfile(fbUser);
    updateCache(user);
    return user;
}

/**
 * Change the current user's password. Firebase requires a fresh credential
 * (within ~5 minutes of sign-in) for `updatePassword`; if it's been too
 * long the caller will receive `auth/requires-recent-login`. We work
 * around that by reauthenticating inline using the currently-entered
 * password — which is exactly what the Settings form asks for anyway.
 */
export async function changePassword(
    currentPassword: string,
    newPassword: string,
): Promise<void> {
    const fbUser = auth.currentUser;
    if (!fbUser || !fbUser.email) {
        throw new Error('Not authenticated');
    }

    const credential = EmailAuthProvider.credential(fbUser.email, currentPassword);
    await reauthenticateWithCredential(fbUser, credential);
    await updatePassword(fbUser, newPassword);
}

/**
 * Send a password-reset email to the given address. The link Firebase
 * sends carries a one-time token which, when clicked, lets the user pick
 * a new password without needing the old one. We swallow silent success
 * on unknown emails to avoid leaking which addresses are registered.
 */
export async function requestPasswordReset(email: string): Promise<void> {
    applyAuthLanguage();
    await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Begin an email-change flow. Firebase sends a verification link to the
 * **new** address; the change only takes effect once the user clicks it.
 * The current-password reauthentication satisfies Firebase's recent-login
 * requirement and gives the UI a chance to validate the user before
 * triggering an email.
 *
 * The local Firestore `users/{uid}.email` field is NOT updated here —
 * it's read-only in the rules. When the user clicks the verification
 * link their Auth record updates; on next sign-in the cache reloads
 * from `auth.currentUser.email`.
 */
export async function changeEmail(
    newEmail: string,
    currentPassword: string,
): Promise<void> {
    const fbUser = auth.currentUser;
    if (!fbUser || !fbUser.email) {
        throw new Error('Not authenticated');
    }

    const credential = EmailAuthProvider.credential(fbUser.email, currentPassword);
    await reauthenticateWithCredential(fbUser, credential);
    applyAuthLanguage();
    await verifyBeforeUpdateEmail(fbUser, newEmail.trim());
}

/**
 * Permanently delete the account. Removes the Firestore profile, frees
 * the username reservation, and deletes the Firebase Auth user. The
 * Auth deletion can fail with `auth/requires-recent-login`; caller
 * should re-authenticate and retry in that case.
 */
export async function deleteCurrentUser(currentPassword = ''): Promise<boolean> {
    const fbUser = auth.currentUser;
    if (!fbUser) return false;

    const usesGoogle = fbUser.providerData.some((provider) => provider.providerId === 'google.com');
    if (usesGoogle) {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        await reauthenticateWithPopup(fbUser, provider);
    } else {
        if (!fbUser.email) {
            throw new Error('Not authenticated');
        }
        const credential = EmailAuthProvider.credential(fbUser.email, currentPassword);
        await reauthenticateWithCredential(fbUser, credential);
    }

    const cached = cachedUser;
    const profileSnap = await getDoc(doc(db, 'users', fbUser.uid));
    const usernameLower = profileSnap.exists()
        ? String(profileSnap.data()?.username ?? '').trim().toLowerCase()
        : (cached?.name?.trim().toLowerCase() ?? '');

    const batch = writeBatch(db);
    batch.delete(doc(db, 'users', fbUser.uid));
    if (usernameLower) {
        batch.delete(doc(db, 'usernames', usernameLower));
    }
    await batch.commit();

    await deleteUser(fbUser);
    updateCache(null);
    return true;
}

/**
 * Sync guard: redirect to `login.html` when the cache says anonymous.
 * For pages that **must not** render stale data, await `whenAuthReady()`
 * before calling this.
 */
export function requireAuth(redirectTo = 'login.html'): User {
    const user = currentUser();
    if (!user) {
        window.location.href = redirectTo;
        throw new Error('Not authenticated');
    }
    return user;
}
