/**
 * Firestore subscriptions for public read-only content.
 *
 *   - `news`           \u2014 news posts (category, date, author, cover, ...)
 *   - `forumCategories`\u2014 category cards (counts + last-post summary)
 *   - `forumThreads`   \u2014 recent-threads list (pinned + lastActivity order)
 *
 * All three are subscribed via `onSnapshot` so the UI stays live when
 * an admin publishes a new post. Each subscribe* returns the Firestore
 * `Unsubscribe` fn \u2014 page entry points can ignore it, but SPA-style
 * navigation or HMR should call it to avoid leaked listeners.
 *
 * `ordered-by` fields are mirrored in `firestore.indexes.json` when
 * composite indexes are needed.
 */

import {
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
    type QueryDocumentSnapshot,
    type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';

// ===== Types =====

/**
 * News post document shape (collection `news`, doc id = slug).
 * Timestamps are stored as ISO 8601 strings for easy JSON seed.
 */
export interface NewsPostDoc {
    id: string;
    category: 'catUpdates' | 'catEvents' | 'catContests' | 'catAnnouncements';
    /** ISO 8601 \u2014 `YYYY-MM-DD`. */
    date: string;
    author: string;
    minRead: number;
    /** Absolute path under `/public` (e.g. `/Storyline.png`). */
    cover: string;
    title: string;
    excerpt: string;
    featured?: boolean;
}

export type ForumCategoryKey =
    | 'catDiscussions'
    | 'catGuides'
    | 'catBugs'
    | 'catSuggestions'
    | 'catOfftopic';

export interface ForumCategoryDoc {
    id: string;
    key: ForumCategoryKey;
    descKey: string;
    iconSvg: string;
    threads: number;
    posts: number;
    /** Display order \u2014 ascending. */
    order: number;
    lastPost: {
        title: string;
        author: string;
        /** ISO 8601 datetime. */
        at: string;
    } | null;
}

export interface ForumThreadDoc {
    id: string;
    category: ForumCategoryKey;
    title: string;
    author: string;
    /** UID of the author if the thread was created by a signed-in user. */
    authorUid?: string;
    replies: number;
    views: number;
    /** ISO 8601 datetime. */
    lastActivity: string;
    pinned?: boolean;
}

// ===== Helpers =====

function mapDoc<T>(snap: QueryDocumentSnapshot): T {
    return { id: snap.id, ...(snap.data() as object) } as T;
}

// ===== Subscriptions =====

/**
 * Subscribe to all news posts, newest first. Results are capped at 30.
 *
 * Ordering: `date` desc. No composite index needed \u2014 single-field sort.
 */
export function subscribeNews(
    onData: (posts: NewsPostDoc[]) => void,
    onError?: (err: Error) => void,
): Unsubscribe {
    const q = query(
        collection(db, 'news'),
        orderBy('date', 'desc'),
        limit(30),
    );
    return onSnapshot(
        q,
        (snap) => onData(snap.docs.map(d => mapDoc<NewsPostDoc>(d))),
        (err) => onError?.(err),
    );
}

/**
 * Subscribe to the forum category cards, sorted by `order`.
 *
 * Cards are a small static-ish list (5-10 docs) \u2014 no limit.
 */
export function subscribeForumCategories(
    onData: (cats: ForumCategoryDoc[]) => void,
    onError?: (err: Error) => void,
): Unsubscribe {
    const q = query(collection(db, 'forumCategories'), orderBy('order', 'asc'));
    return onSnapshot(
        q,
        (snap) => onData(snap.docs.map(d => mapDoc<ForumCategoryDoc>(d))),
        (err) => onError?.(err),
    );
}

/**
 * Subscribe to recent forum threads.
 *
 * Ordering: `pinned` desc, then `lastActivity` desc. This requires a
 * composite index on `(pinned desc, lastActivity desc)` \u2014 see
 * `firestore.indexes.json`.
 */
export function subscribeForumThreads(
    onData: (threads: ForumThreadDoc[]) => void,
    onError?: (err: Error) => void,
): Unsubscribe {
    const q = query(
        collection(db, 'forumThreads'),
        orderBy('pinned', 'desc'),
        orderBy('lastActivity', 'desc'),
        limit(50),
    );
    return onSnapshot(
        q,
        (snap) => onData(snap.docs.map(d => mapDoc<ForumThreadDoc>(d))),
        (err) => onError?.(err),
    );
}
