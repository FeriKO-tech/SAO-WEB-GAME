import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot,
  addDoc
} from 'firebase/firestore';
import { db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export type NewsCategory = 'catAnnouncements' | 'catUpdates' | 'catEvents' | 'catCommunity';

export interface NewsPostDoc {
  id: string;
  title: string;
  slug: string;
  category: NewsCategory;
  cover: string;
  excerpt: string;
  content: string;
  author: string;
  authorUid: string;
  date: string; // ISO string
  minRead: number;
  featured: boolean;
  tags: string[];
  lang: string;
}

function mapDoc<T>(snap: QueryDocumentSnapshot<DocumentData>): T {
  return { id: snap.id, ...(snap.data() as object) } as T;
}

function mapSnap<T>(snap: DocumentSnapshot<DocumentData>): T | null {
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as object) } as T;
}

// Server-side fetching
export async function getNewsPosts(lang: string = 'en'): Promise<NewsPostDoc[]> {
  const q = query(
    collection(db, 'news'),
    orderBy('date', 'desc'),
    limit(50)
  );
  
  const snap = await getDocs(q);
  // Filtering by lang on the client/server after fetch if needed, 
  // since indexing by lang might not be setup.
  const posts = snap.docs.map(d => mapDoc<NewsPostDoc>(d));
  // Optional: return posts.filter(p => p.lang === lang || p.lang === 'all');
  return posts;
}

export async function getNewsPostBySlug(slug: string): Promise<NewsPostDoc | null> {
  const q = query(
    collection(db, 'news'),
    where('slug', '==', slug),
    limit(1)
  );
  
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return mapDoc<NewsPostDoc>(snap.docs[0]);
}

// Client-side uploads
export async function uploadNewsImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() || 'png';
  const filename = `news/${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`;
  const fileRef = ref(storage, filename);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}
