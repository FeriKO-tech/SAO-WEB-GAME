/**
 * Seed Firestore with the initial news + forum content.
 *
 * Prereq: download a service-account JSON from
 *   Firebase Console → Project Settings → Service accounts → "Generate key"
 * and save it as `service-account.json` in the repo root (it's gitignored).
 *
 * Usage:
 *   npm run seed                 # idempotent upsert of every document
 *   npm run seed -- --reset      # delete all target docs first, then write
 *
 * The script bypasses Firestore security rules (it's the Admin SDK), so
 * no additional "admin" claim is needed to run it.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import admin from 'firebase-admin';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const serviceAccountPath = resolve(repoRoot, 'service-account.json');
let serviceAccount;
try {
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} catch (err) {
    console.error(
        `\nCould not read ${serviceAccountPath}.\n\n` +
        `Download a service-account JSON key from:\n` +
        `  Firebase Console → Project Settings → Service accounts →\n` +
        `  Generate new private key\n\n` +
        `Save it as "service-account.json" in the repo root.\n`,
    );
    console.error(err);
    process.exit(1);
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// =========================================================================
// Seed data
// =========================================================================

// No news yet — the collection stays empty until we have a real
// announcement to publish. `news.ts` renders a localised empty-state
// in that case.
const NEWS = [];

// Forum skeleton: five structural categories with zero counters and
// no "last post" shown. Gives the forum a recognisable shape without
// inventing content the game doesn't yet have.
const FORUM_CATEGORIES = [
    {
        id: 'discussions',
        key: 'catDiscussions',
        descKey: 'catDiscussionsDesc',
        order: 0,
        iconSvg:
            'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
        threads: 0,
        posts: 0,
        lastPost: null,
    },
    {
        id: 'guides',
        key: 'catGuides',
        descKey: 'catGuidesDesc',
        order: 1,
        iconSvg:
            'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
        threads: 0,
        posts: 0,
        lastPost: null,
    },
    {
        id: 'bugs',
        key: 'catBugs',
        descKey: 'catBugsDesc',
        order: 2,
        iconSvg:
            'M12 20h.01M12 4v1M12 9v6M4.93 4.93l.7.7M19.07 4.93l-.7.7M2 12h1M21 12h1M7 8a5 5 0 0 1 10 0v5a5 5 0 0 1-10 0z',
        threads: 0,
        posts: 0,
        lastPost: null,
    },
    {
        id: 'suggestions',
        key: 'catSuggestions',
        descKey: 'catSuggestionsDesc',
        order: 3,
        iconSvg:
            'M12 2a7 7 0 0 0-4 12.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26A7 7 0 0 0 12 2zM9 22h6',
        threads: 0,
        posts: 0,
        lastPost: null,
    },
    {
        id: 'offtopic',
        key: 'catOfftopic',
        descKey: 'catOfftopicDesc',
        order: 4,
        iconSvg:
            'M17 8h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7l-4 4V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2zM7 12h.01M12 12h.01',
        threads: 0,
        posts: 0,
        lastPost: null,
    },
];

// No threads yet — empty-state handled client-side.
const FORUM_THREADS = [];

// =========================================================================
// Writers
// =========================================================================

async function deleteCollection(path) {
    const ref = db.collection(path);
    const snap = await ref.get();
    if (snap.empty) return;
    const batch = db.batch();
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
    console.log(`  · cleared ${snap.size} docs from ${path}`);
}

async function upsertCollection(path, items) {
    const batch = db.batch();
    for (const item of items) {
        const { id, ...data } = item;
        batch.set(db.collection(path).doc(id), data, { merge: true });
    }
    await batch.commit();
    console.log(`  · wrote ${items.length} docs to ${path}`);
}

// =========================================================================
// Main
// =========================================================================

async function main() {
    const reset = process.argv.includes('--reset');

    console.log(`\nSeeding Firestore (project: ${serviceAccount.project_id})\n`);

    if (reset) {
        console.log('Reset mode — clearing target collections first:');
        await deleteCollection('news');
        await deleteCollection('forumCategories');
        await deleteCollection('forumThreads');
        console.log('');
    }

    console.log('Writing fresh data:');
    await upsertCollection('news', NEWS);
    await upsertCollection('forumCategories', FORUM_CATEGORIES);
    await upsertCollection('forumThreads', FORUM_THREADS);

    console.log('\nDone.\n');
}

main().catch((err) => {
    console.error('\nSeeding failed:');
    console.error(err);
    process.exit(1);
});
