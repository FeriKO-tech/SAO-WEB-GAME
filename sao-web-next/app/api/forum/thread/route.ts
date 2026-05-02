import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, writeBatch, increment } from 'firebase/firestore';
import { forumThreadSchema } from '@/lib/schemas';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = forumThreadSchema.parse(body);

    const now = new Date().toISOString();
    const threadRef = doc(collection(db, 'forumThreads'));
    const categoryRef = doc(db, 'forumCategories', parsed.categoryId);

    const batch = writeBatch(db);

    const threadData: any = {
      categoryId: parsed.categoryId,
      category: parsed.categoryKey,
      title: parsed.title.trim(),
      content: parsed.content.trim(),
      author: parsed.author,
      authorUid: parsed.authorUid,
      replies: 0,
      views: 0,
      lastActivity: now,
      createdAt: now,
      pinned: false,
    };

    if (parsed.images && parsed.images.length > 0) {
      threadData.images = parsed.images;
    }

    batch.set(threadRef, threadData);

    batch.update(categoryRef, {
      threads: increment(1),
      posts: increment(1),
      lastPost: {
        title: parsed.title.trim().slice(0, 140),
        author: parsed.author,
        at: now,
      },
    });

    await batch.commit();

    return NextResponse.json({ success: true, id: threadRef.id });
  } catch (error: any) {
    console.error('Forum thread create error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
