/// <reference types="vite/client" />

/**
 * Firebase app bootstrap.
 *
 * Reads configuration from `VITE_FIREBASE_*` environment variables
 * (defined in `.env.local`) and exposes ready-to-use `auth` and `db`
 * singletons for the rest of the app.
 *
 * The Web API key is public by design — security is enforced through
 * Firebase Auth rules and Firestore security rules, not by hiding the
 * key. See `firestore.rules` for the access policy.
 */

import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
    type Auth,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

/**
 * Collect env vars and fail loudly if any are missing — a blank
 * `initializeApp({})` would swallow the problem and produce cryptic
 * errors deep in the SDK on first call.
 */
function readConfig() {
    const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    const missing = Object.entries(config)
        .filter(([, v]) => !v)
        .map(([k]) => k);

    if (missing.length > 0) {
        throw new Error(
            `Firebase config is incomplete. Missing fields: ${missing.join(', ')}. ` +
            `Check .env.local (copy from .env.example if needed).`,
        );
    }

    return config as Required<typeof config>;
}

const firebaseConfig = readConfig();

/** Singleton Firebase app — initialised exactly once at import time. */
export const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

/** Auth singleton — use `signIn…`, `signOut`, `onAuthStateChanged` from `firebase/auth`. */
export const auth: Auth = getAuth(firebaseApp);

/**
 * Persist the logged-in session in `localStorage` so it survives page
 * reloads and tab restarts (the default behaviour, but we set it
 * explicitly for clarity and in case Firebase changes defaults).
 */
void setPersistence(auth, browserLocalPersistence).catch(() => {
    /* persistence unavailable (e.g. private mode) — fall back silently */
});

/** Firestore client — use `collection`, `doc`, `getDoc`, `onSnapshot` from `firebase/firestore`. */
export const db: Firestore = getFirestore(firebaseApp);

/** Storage client — use `ref`, `uploadBytesResumable`, `getDownloadURL` from `firebase/storage`. */
export const storage: FirebaseStorage = getStorage(firebaseApp);
