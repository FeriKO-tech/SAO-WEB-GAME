/**
 * Waitlist subscription for the (not yet released) game client.
 *
 * Writes a single document per email to Firestore `waitlist/{emailKey}`,
 * where `emailKey` is the lowercased email with `@` and `.` replaced so it
 * is a safe Firestore document id.
 *
 * Using the email as the doc id means:
 *   - Duplicates fail with `permission-denied` at the rules level,
 *     because the security rule forbids updates. We surface that as
 *     a friendly "you are already on the list" message.
 *   - No one can enumerate the waitlist (reads are disabled in rules).
 */

import {
    collection,
    doc,
    FirestoreError,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore';

import { db } from './firebase';
import type { Language } from '@models/user';

/** Result of a waitlist submission attempt. */
export type WaitlistResult =
    | { ok: true }
    | { ok: false; reason: 'invalid-email' | 'already-signed-up' | 'network' | 'unknown' };

/** Safe email validator. Matches the one used on the register page. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Convert `user@example.com` to `user_at_example_dot_com` so it fits
 * Firestore's doc-id constraints (no `/`, `.`, `..`, etc.). Lowercased
 * first so `FOO@bar.com` and `foo@bar.com` collapse to the same record.
 */
function emailToDocId(email: string): string {
    return email
        .trim()
        .toLowerCase()
        .replace(/@/g, '_at_')
        .replace(/\./g, '_dot_');
}

/**
 * Add the given email to the game client waitlist.
 *
 * @param email  User-provided email.
 * @param lang   Current UI language, stored for future localised notifications.
 * @param source Where the submission came from (e.g. `'home-play-cta'`).
 */
export async function joinWaitlist(
    email: string,
    lang: Language,
    source = 'home-play-cta',
): Promise<WaitlistResult> {
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed) || trimmed.length > 254) {
        return { ok: false, reason: 'invalid-email' };
    }

    const docId = emailToDocId(trimmed);
    const ref = doc(collection(db, 'waitlist'), docId);

    try {
        await setDoc(ref, {
            email: trimmed.toLowerCase(),
            language: lang,
            createdAt: serverTimestamp(),
            source,
        });
        return { ok: true };
    } catch (err) {
        const code = (err as FirestoreError).code ?? '';
        if (code === 'permission-denied') {
            // Doc already exists - rules forbid updates, so this is the
            // "already signed up" case. Note: a malformed payload would
            // also trigger this, but we validated locally.
            return { ok: false, reason: 'already-signed-up' };
        }
        if (code === 'unavailable' || code === 'deadline-exceeded') {
            return { ok: false, reason: 'network' };
        }
        console.error('[waitlist] joinWaitlist failed', err);
        return { ok: false, reason: 'unknown' };
    }
}
