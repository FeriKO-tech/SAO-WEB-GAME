import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, writeBatch, increment, getDoc } from 'firebase/firestore';
import { forumReplySchema } from '@/lib/schemas';
import { ForumThreadDoc } from '@/lib/forum';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forumReplySchema.parse(body);

    const now = new Date().toISOString();
    const threadRef = doc(db, 'forumThreads', parsed.threadId);
    const threadSnap = await getDoc(threadRef);
    
    if (!threadSnap.exists()) {
      return NextResponse.json({ success: false, error: 'Thread not found' }, { status: 404 });
    }

    const thread = threadSnap.data() as ForumThreadDoc;
    const postRef = doc(collection(db, 'forumThreads', parsed.threadId, 'posts'));
    const batch = writeBatch(db);

    const postData: any = {
      author: parsed.author,
      authorUid: parsed.authorUid,
      text: parsed.text.trim(),
      createdAt: now,
    };

    if (parsed.images && parsed.images.length > 0) {
      postData.images = parsed.images;
    }

    batch.set(postRef, postData);
    
    batch.update(threadRef, {
      replies: increment(1),
      lastActivity: now,
      lastReplyId: postRef.id,
    });

    if (thread.categoryId) {
      const categoryRef = doc(db, 'forumCategories', thread.categoryId);
      batch.update(categoryRef, {
        posts: increment(1),
        lastPost: {
          title: thread.title?.slice(0, 140) || '',
          author: parsed.author,
          at: now,
        },
      });
    }

    await batch.commit();

    return NextResponse.json({ success: true, id: postRef.id });
  } catch (error: any) {
    console.error('Forum reply create error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
