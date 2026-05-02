import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ticketSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  category: z.enum(['account', 'bug', 'payment', 'tech', 'other']),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  lang: z.string().optional(),
  // For now we just accept metadata about files if any
  attachments: z.array(
    z.object({
      name: z.string(),
      size: z.number(),
      type: z.string(),
    })
  ).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ticketSchema.parse(body);

    // 1. Write to Firestore
    const ticketData = {
      ...parsed,
      status: 'open',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'supportTickets'), ticketData);

    // 2. Send Discord Webhook (if configured)
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [
              {
                title: `New Support Ticket: ${parsed.subject}`,
                description: parsed.message,
                fields: [
                  { name: 'ID', value: docRef.id, inline: true },
                  { name: 'Category', value: parsed.category, inline: true },
                  { name: 'From', value: `${parsed.name} (${parsed.email})`, inline: true },
                  { name: 'Language', value: parsed.lang || 'N/A', inline: true },
                ],
                color: 0x3498db, // Blue
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        });
      } catch (e) {
        console.error('Failed to send Discord webhook:', e);
        // Don't fail the request if webhook fails
      }
    }

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error('Support ticket error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.format() }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
