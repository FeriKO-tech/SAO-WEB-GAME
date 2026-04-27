/**
 * News management utilities.
 *
 * Provides functions for creating, updating, and managing news posts
 * in the Firestore news collection.
 */

import { 
    collection, 
    doc, 
    addDoc, 
    updateDoc, 
    deleteDoc,
    serverTimestamp,
    type DocumentData,
    type DocumentReference 
} from 'firebase/firestore';
import { db } from './firebase';
import { currentUser } from './auth';
import { hasStaffRole } from './support';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { NewsPostDoc } from './content';

// Extended interface for news creation (includes fields not in content.ts)
export interface NewsPostDocCreate extends Omit<NewsPostDoc, 'id' | 'date' | 'author' | 'minRead' | 'cover'> {
    slug: string;
    imageUrl?: string; // Optional since it might be uploaded
    content: string;
    tags: string[];
    lang: string;
}

/**
 * Uploads an image to Firebase Storage and returns the public URL
 */
export async function uploadNewsImage(file: File): Promise<string> {
    const storage = getStorage();
    // Create a unique filename: timestamp_originalName
    const filename = `news/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const storageRef = ref(storage, filename);
    
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
}

/**
 * Create a new news post in Firestore.
 * 
 * @param newsData - The news post data (without author/timestamp fields)
 * @returns Promise<DocumentReference> - Reference to the created document
 * @throws Error if user is not authenticated or lacks staff role
 */
export async function createNewsItem(newsData: NewsPostDocCreate): Promise<DocumentReference> {
    const user = currentUser();
    const authUser = getAuth().currentUser;
    
    if (!user || !authUser) {
        throw new Error('User must be authenticated to create news');
    }
    
    // Check staff role using custom claims
    const hasRole = await hasStaffRole();
    if (!hasRole) {
        throw new Error('User must have staff or admin role to create news');
    }
    
    const newsCollection = collection(db, 'news');
    
    const docData: DocumentData = {
        ...newsData,
        authorId: authUser.uid,
        authorName: user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}`
            : user.name || 'Unknown',
        publishedAt: serverTimestamp(),
    };
    
    try {
        const docRef = await addDoc(newsCollection, docData);
        console.log('[news] Created news item:', docRef.id);
        return docRef;
    } catch (error) {
        console.error('[news] Failed to create news item:', error);
        throw error;
    }
}

/**
 * Update an existing news post.
 * 
 * @param postId - The ID of the news post to update
 * @param updates - The fields to update (excluding author/timestamp fields)
 * @returns Promise<void>
 * @throws Error if user is not authenticated or lacks staff role
 */
export async function updateNewsItem(
    postId: string, 
    updates: Partial<NewsPostDocCreate>
): Promise<void> {
    const user = currentUser();
    const authUser = getAuth().currentUser;
    
    if (!user || !authUser) {
        throw new Error('User must be authenticated to update news');
    }
    
    // Check staff role using custom claims
    const hasRole = await hasStaffRole();
    if (!hasRole) {
        throw new Error('User must have staff or admin role to update news');
    }
    
    const docRef = doc(db, 'news', postId);
    
    try {
        await updateDoc(docRef, updates);
        console.log('[news] Updated news item:', postId);
    } catch (error) {
        console.error('[news] Failed to update news item:', error);
        throw error;
    }
}

/**
 * Delete a news post.
 * 
 * @param postId - The ID of the news post to delete
 * @returns Promise<void>
 * @throws Error if user is not authenticated or lacks staff role
 */
export async function deleteNewsItem(postId: string): Promise<void> {
    const user = currentUser();
    const authUser = getAuth().currentUser;
    
    if (!user || !authUser) {
        throw new Error('User must be authenticated to delete news');
    }
    
    // Check staff role using custom claims
    const hasRole = await hasStaffRole();
    if (!hasRole) {
        throw new Error('User must have staff or admin role to delete news');
    }
    
    const docRef = doc(db, 'news', postId);
    
    try {
        await deleteDoc(docRef);
        console.log('[news] Deleted news item:', postId);
    } catch (error) {
        console.error('[news] Failed to delete news item:', error);
        throw error;
    }
}

/**
 * Generate a URL-friendly slug from a title.
 * 
 * @param title - The title to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric chars except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Validate news post data according to Firestore rules.
 * 
 * @param data - The news post data to validate
 * @returns true if valid, throws Error if invalid
 */
export function validateNewsData(data: Partial<NewsPostDocCreate>): boolean {
    if (!data.title || typeof data.title !== 'string') {
        throw new Error('Title is required and must be a string');
    }
    
    if (data.title.length < 1 || data.title.length > 200) {
        throw new Error('Title must be between 1 and 200 characters');
    }
    
    if (!data.slug || typeof data.slug !== 'string') {
        throw new Error('Slug is required and must be a string');
    }
    
    if (!/^[a-z0-9-]+$/.test(data.slug)) {
        throw new Error('Slug must contain only lowercase letters, numbers, and hyphens');
    }
    
    if (data.slug.length < 1 || data.slug.length > 200) {
        throw new Error('Slug must be between 1 and 200 characters');
    }
    
    if (!data.category || !['catUpdates', 'catEvents', 'catContests', 'catAnnouncements'].includes(data.category)) {
        throw new Error('Category must be one of: catUpdates, catEvents, catContests, catAnnouncements');
    }
    
    if (!data.imageUrl || typeof data.imageUrl !== 'string') {
        throw new Error('Image URL is required and must be a string');
    }
    
    if (data.imageUrl.length < 1 || data.imageUrl.length > 500) {
        throw new Error('Image URL must be between 1 and 500 characters');
    }
    
    if (!data.excerpt || typeof data.excerpt !== 'string') {
        throw new Error('Excerpt is required and must be a string');
    }
    
    if (data.excerpt.length < 1 || data.excerpt.length > 300) {
        throw new Error('Excerpt must be between 1 and 300 characters');
    }
    
    if (!data.content || typeof data.content !== 'string') {
        throw new Error('Content is required and must be a string');
    }
    
    if (data.content.length < 1 || data.content.length > 10000) {
        throw new Error('Content must be between 1 and 10000 characters');
    }
    
    if (data.tags) {
        if (!Array.isArray(data.tags)) {
            throw new Error('Tags must be an array');
        }
        
        if (data.tags.length > 10) {
            throw new Error('Maximum 10 tags allowed');
        }
        
        const uniqueTags = new Set(data.tags);
        if (uniqueTags.size !== data.tags.length) {
            throw new Error('Tags must be unique');
        }
        
        for (const tag of data.tags) {
            if (typeof tag !== 'string') {
                throw new Error('All tags must be strings');
            }
            
            if (tag.length < 1 || tag.length > 30) {
                throw new Error('Each tag must be between 1 and 30 characters');
            }
        }
    }
    
    if (data.lang && typeof data.lang === 'string') {
        if (data.lang.length !== 2) {
            throw new Error('Language must be a 2-character ISO code');
        }
    }
    
    return true;
}
