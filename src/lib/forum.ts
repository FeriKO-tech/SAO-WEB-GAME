import type { User } from '@models/user';
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    increment,
    limit,
    onSnapshot,
    orderBy,
    query,
    runTransaction,
    setDoc,
    updateDoc,
    where,
    writeBatch,
    type DocumentData,
    type DocumentSnapshot,
    type QueryDocumentSnapshot,
    type Unsubscribe,
} from 'firebase/firestore';
import { currentUser } from './auth';
import type { ForumCategoryKey, ForumThreadDoc } from './content';
import { auth, db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface ForumThreadDetailDoc extends ForumThreadDoc {
    categoryId?: string;
    content?: string;
    images?: string[];
    createdAt?: string;
    lastReplyId?: string;
}

export interface ForumPostDoc {
    id: string;
    author: string;
    authorUid?: string;
    text: string;
    images?: string[];
    createdAt: string;
}

export interface CreateForumThreadInput {
    categoryId: string;
    categoryKey: ForumCategoryKey;
    title: string;
    content: string;
    images?: string[];
}

export interface CreateForumReplyInput {
    threadId: string;
    text: string;
    images?: string[];
}

function mapDoc<T>(snap: QueryDocumentSnapshot<DocumentData>): T {
    return { id: snap.id, ...(snap.data() as object) } as T;
}

function mapSnap<T>(snap: DocumentSnapshot<DocumentData>): T | null {
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as object) } as T;
}

function currentForumAuthor(): { uid: string; author: string; profile: User } {
    const authUser = auth.currentUser;
    const profile = currentUser();
    const author = profile?.name?.trim()
        || authUser?.displayName?.trim()
        || authUser?.email?.split('@')[0]?.trim()
        || '';

    if (!authUser || !profile || !author) {
        throw new Error('Authentication required');
    }

    return {
        uid: authUser.uid,
        author: author.slice(0, 80),
        profile,
    };
}

export function subscribeForumThread(
    threadId: string,
    onData: (thread: ForumThreadDetailDoc | null) => void,
    onError?: (err: Error) => void,
): Unsubscribe {
    return onSnapshot(
        doc(db, 'forumThreads', threadId),
        (snap) => onData(mapSnap<ForumThreadDetailDoc>(snap)),
        (err) => onError?.(err),
    );
}

export function subscribeForumPosts(
    threadId: string,
    onData: (posts: ForumPostDoc[]) => void,
    onError?: (err: Error) => void,
): Unsubscribe {
    const q = query(
        collection(db, 'forumThreads', threadId, 'posts'),
        orderBy('createdAt', 'asc'),
        limit(200),
    );
    return onSnapshot(
        q,
        (snap) => onData(snap.docs.map((docSnap) => mapDoc<ForumPostDoc>(docSnap))),
        (err) => onError?.(err),
    );
}

export async function uploadForumImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop() || 'png';
    const filename = `forum/${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`;
    const fileRef = ref(storage, filename);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
}

export async function createForumThread(input: CreateForumThreadInput): Promise<string> {
    const { uid, author } = currentForumAuthor();
    const now = new Date().toISOString();
    const threadRef = doc(collection(db, 'forumThreads'));
    const categoryRef = doc(db, 'forumCategories', input.categoryId);

    const batch = writeBatch(db);

    const threadData: any = {
        categoryId: input.categoryId,
        category: input.categoryKey,
        title: input.title.trim(),
        content: input.content.trim(),
        author,
        authorUid: uid,
        replies: 0,
        views: 0,
        lastActivity: now,
        createdAt: now,
        pinned: false,
    };
    if (input.images && input.images.length > 0) {
        threadData.images = input.images;
    }

    batch.set(threadRef, threadData);

    batch.update(categoryRef, {
        threads: increment(1),
        posts: increment(1),
        lastPost: {
            title: input.title.trim().slice(0, 140),
            author,
            at: now,
        },
    });

    await batch.commit();
    return threadRef.id;
}

export async function createForumReply(input: CreateForumReplyInput): Promise<string> {
    const { uid, author } = currentForumAuthor();
    const now = new Date().toISOString();
    const threadRef = doc(db, 'forumThreads', input.threadId);
    const threadSnap = await getDoc(threadRef);
    if (!threadSnap.exists()) {
        throw new Error('Thread not found');
    }

    const thread = threadSnap.data() as ForumThreadDetailDoc;
    const postRef = doc(collection(db, 'forumThreads', input.threadId, 'posts'));
    const batch = writeBatch(db);

    const postData: any = {
        author,
        authorUid: uid,
        text: input.text.trim(),
        createdAt: now,
    };
    if (input.images && input.images.length > 0) {
        postData.images = input.images;
    }

    batch.set(postRef, postData);
    batch.update(threadRef, {
        replies: increment(1),
        lastActivity: now,
        lastReplyId: postRef.id,
    });

    // Update category counters
    if (thread.categoryId) {
        const categoryRef = doc(db, 'forumCategories', thread.categoryId);
        batch.update(categoryRef, {
            posts: increment(1),
            lastPost: {
                title: thread.title?.slice(0, 140) || '',
                author,
                at: now,
            },
        });
    }

    await batch.commit();
    return postRef.id;
}

/**
 * Increment the views counter on a thread. Fire-and-forget.
 * Silently catches errors (e.g. if user is not signed in).
 */
export async function incrementThreadViews(threadId: string): Promise<void> {
    try {
        const authUser = auth.currentUser;
        if (!authUser?.uid) return;

        const threadRef = doc(db, 'forumThreads', threadId);
        const viewRef = doc(db, 'forumThreads', threadId, 'views', authUser.uid);

        await runTransaction(db, async (tx) => {
            const [threadSnap, viewSnap] = await Promise.all([
                tx.get(threadRef),
                tx.get(viewRef),
            ]);

            if (!threadSnap.exists()) return;
            if (viewSnap.exists()) return;

            tx.set(viewRef, {
                uid: authUser.uid,
                viewedAt: new Date().toISOString(),
            });
            tx.update(threadRef, { views: increment(1) });
        });
    } catch {
        // Silently ignore — views are best-effort
    }
}

/**
 * Delete an entire forum thread and all its posts. Staff only.
 * Also decrements the category counters.
 */
export async function deleteForumThread(threadId: string): Promise<void> {
    const threadRef = doc(db, 'forumThreads', threadId);
    const threadSnap = await getDoc(threadRef);
    if (!threadSnap.exists()) throw new Error('Thread not found');

    const thread = threadSnap.data() as ForumThreadDetailDoc;

    // Delete all posts in the thread first
    const [postsSnap, viewsSnap] = await Promise.all([
        getDocs(collection(db, 'forumThreads', threadId, 'posts')),
        getDocs(collection(db, 'forumThreads', threadId, 'views')),
    ]);
    const batch = writeBatch(db);
    for (const postDoc of postsSnap.docs) {
        batch.delete(postDoc.ref);
    }
    for (const viewDoc of viewsSnap.docs) {
        batch.delete(viewDoc.ref);
    }

    // Delete the thread itself
    batch.delete(threadRef);

    // Decrement category counters
    if (thread.categoryId) {
        const categoryRef = doc(db, 'forumCategories', thread.categoryId);
        const totalPosts = 1 + postsSnap.size; // root thread message + replies subcollection
        batch.update(categoryRef, {
            threads: increment(-1),
            posts: increment(-totalPosts),
        });
    }

    await batch.commit();
    if (thread.categoryId) {
        await reconcileForumCategoryCounters(thread.categoryId);
    }
}

/**
 * Delete a single reply post from a thread. Staff only.
 * Decrements the thread reply count and category post count.
 */
export async function deleteForumPost(threadId: string, postId: string): Promise<void> {
    const threadRef = doc(db, 'forumThreads', threadId);
    const threadSnap = await getDoc(threadRef);
    if (!threadSnap.exists()) throw new Error('Thread not found');

    const thread = threadSnap.data() as ForumThreadDetailDoc;
    const postRef = doc(db, 'forumThreads', threadId, 'posts', postId);
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) throw new Error('Post not found');

    const batch = writeBatch(db);

    batch.delete(postRef);
    batch.update(threadRef, {
        replies: increment(-1),
    });

    if (thread.categoryId) {
        const categoryRef = doc(db, 'forumCategories', thread.categoryId);
        batch.update(categoryRef, {
            posts: increment(-1),
        });
    }

    await batch.commit();
    if (thread.categoryId) {
        await reconcileForumCategoryCounters(thread.categoryId);
    }
}

async function reconcileForumCategoryCounters(categoryId: string): Promise<void> {
    const categoryRef = doc(db, 'forumCategories', categoryId);
    const threadsSnap = await getDocs(
        query(collection(db, 'forumThreads'), where('categoryId', '==', categoryId)),
    );

    let posts = 0;
    let lastThread: ForumThreadDetailDoc | null = null;
    for (const threadDoc of threadsSnap.docs) {
        const threadData = threadDoc.data() as ForumThreadDetailDoc;
        posts += 1; // root thread post

        const repliesSnap = await getDocs(collection(db, 'forumThreads', threadDoc.id, 'posts'));
        posts += repliesSnap.size;

        if (!lastThread || threadData.lastActivity > (lastThread.lastActivity ?? '')) {
            lastThread = threadData;
        }
    }

    await updateDoc(categoryRef, {
        threads: Math.max(0, threadsSnap.size),
        posts: Math.max(0, posts),
        lastPost: lastThread
            ? {
                title: (lastThread.title ?? '').slice(0, 140),
                author: (lastThread.author ?? '').slice(0, 80),
                at: lastThread.lastActivity,
            }
            : null,
    });
}
