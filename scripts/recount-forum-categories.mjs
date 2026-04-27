/**
 * Recalculate forum category counters from real thread/reply data.
 *
 * Usage:
 *   node scripts/recount-forum-categories.mjs
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
    console.error(`Could not read ${serviceAccountPath}`);
    console.error(err);
    process.exit(1);
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function recountCategory(categoryDoc) {
    const categoryId = categoryDoc.id;
    const threadsSnap = await db.collection('forumThreads').where('categoryId', '==', categoryId).get();

    let posts = 0;
    let lastPost = null;

    for (const threadDoc of threadsSnap.docs) {
        const thread = threadDoc.data();
        posts += 1; // root thread post

        const repliesSnap = await db.collection('forumThreads').doc(threadDoc.id).collection('posts').get();
        posts += repliesSnap.size;

        const candidateAt = String(thread.lastActivity ?? '');
        const lastAt = String(lastPost?.at ?? '');
        if (!lastPost || candidateAt > lastAt) {
            lastPost = {
                title: String(thread.title ?? '').slice(0, 140),
                author: String(thread.author ?? '').slice(0, 80),
                at: candidateAt,
            };
        }
    }

    await categoryDoc.ref.set(
        {
            threads: Math.max(0, threadsSnap.size),
            posts: Math.max(0, posts),
            lastPost,
        },
        { merge: true },
    );

    console.log(`- ${categoryId}: threads=${threadsSnap.size}, posts=${posts}`);
}

async function main() {
    console.log(`Recount forum categories in project: ${serviceAccount.project_id}`);
    const categoriesSnap = await db.collection('forumCategories').get();
    for (const categoryDoc of categoriesSnap.docs) {
        await recountCategory(categoryDoc);
    }
    console.log('Done.');
}

main().catch((err) => {
    console.error('Recount failed');
    console.error(err);
    process.exit(1);
});
