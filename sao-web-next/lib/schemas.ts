import { z } from 'zod';

export const waitlistSchema = z.object({
  email: z.string().email(),
});

export const ticketSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  category: z.enum(['account', 'bug', 'payment', 'tech', 'other']),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  lang: z.string().optional(),
  attachments: z.array(
    z.object({
      name: z.string(),
      size: z.number(),
      type: z.string(),
      url: z.string().optional()
    })
  ).optional(),
});

export const forumThreadSchema = z.object({
  categoryId: z.string().min(1),
  categoryKey: z.enum(['announcements', 'general', 'guides', 'support', 'offtopic']),
  title: z.string().min(3).max(140),
  content: z.string().min(10).max(10000),
  images: z.array(z.string()).optional(),
  author: z.string(),
  authorUid: z.string(),
});

export const forumReplySchema = z.object({
  threadId: z.string().min(1),
  text: z.string().min(1).max(5000),
  images: z.array(z.string()).optional(),
  author: z.string(),
  authorUid: z.string(),
});
