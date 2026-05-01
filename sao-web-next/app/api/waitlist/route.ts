import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { z } from 'zod';

const waitlistSchema = z.object({
  email: z.string().email(),
  locale: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = waitlistSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ ok: false, reason: 'invalid-email' }, { status: 400 });
    }

    const { email, locale } = result.data;
    const lowerEmail = email.trim().toLowerCase();
    
    // We use the email as the document ID for deduplication
    const docRef = doc(db, 'waitlist', lowerEmail);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return NextResponse.json({ ok: false, reason: 'already-signed-up' }, { status: 400 });
    }

    await setDoc(docRef, {
      email: lowerEmail,
      createdAt: serverTimestamp(),
      locale: locale || 'en'
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[waitlist] API error:', err);
    return NextResponse.json({ ok: false, reason: 'network' }, { status: 500 });
  }
}
