import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export type ForumCategoryKey = 'announcements' | 'general' | 'guides' | 'support' | 'offtopic';

export interface ForumCategoryDoc {
  id: string;
  key: ForumCategoryKey;
  name: string;
  description: string;
  order: number;
  threads: number;
  posts: number;
  lastPost: {
    title: string;
    author: string;
    at: string;
  } | null;
}

export interface ForumThreadDoc {
  id: string;
  categoryId: string;
  category: ForumCategoryKey;
  title: string;
  content: string;
  author: string;
  authorUid: string;
  replies: number;
  views: number;
  lastActivity: string;
  createdAt: string;
  pinned: boolean;
  images?: string[];
  lastReplyId?: string;
}

export interface ForumPostDoc {
  id: string;
  author: string;
  authorUid: string;
  text: string;
  images?: string[];
  createdAt: string;
}

function mapDoc<T>(snap: QueryDocumentSnapshot<DocumentData>): T {
  return { id: snap.id, ...(snap.data() as object) } as T;
}

function mapSnap<T>(snap: DocumentSnapshot<DocumentData>): T | null {
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as object) } as T;
}

// ==========================================
// Server-Side Fetching (can be used in SSR)
// ==========================================

export async function getForumCategories(): Promise<ForumCategoryDoc[]> {
  const q = query(collection(db, 'forumCategories'), orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapDoc<ForumCategoryDoc>(d));
}

export async function getForumThreads(categoryId?: string): Promise<ForumThreadDoc[]> {
  let q = query(collection(db, 'forumThreads'), orderBy('lastActivity', 'desc'), limit(50));
  
  if (categoryId) {
    q = query(
      collection(db, 'forumThreads'),
      where('categoryId', '==', categoryId),
      orderBy('pinned', 'desc'),
      orderBy('lastActivity', 'desc'),
      limit(50)
    );
  }
  
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapDoc<ForumThreadDoc>(d));
}

export async function getForumThread(threadId: string): Promise<ForumThreadDoc | null> {
  const snap = await getDoc(doc(db, 'forumThreads', threadId));
  return mapSnap<ForumThreadDoc>(snap);
}

export async function getForumPosts(threadId: string): Promise<ForumPostDoc[]> {
  const q = query(
    collection(db, 'forumThreads', threadId, 'posts'),
    orderBy('createdAt', 'asc'),
    limit(200)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => mapDoc<ForumPostDoc>(d));
}

// ==========================================
// Client-Side Utilities
// ==========================================

export async function uploadForumImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'png';
  const filename = `forum/${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`;
  const fileRef = ref(storage, filename);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}

export async function getForumSettings(): Promise<{ publicVisible: boolean; postingEnabled: boolean }> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'forum'));
    if (snap.exists()) {
      const data = snap.data();
      return {
        publicVisible: data?.publicVisible ?? true,
        postingEnabled: data?.postingEnabled ?? true,
      };
    }
  } catch (err) {
    console.error("Failed to fetch forum settings", err);
  }
  
  return { publicVisible: true, postingEnabled: true };
}
