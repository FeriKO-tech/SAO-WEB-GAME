import { getTranslations } from 'next-intl/server';
import { getForumThread, getForumPosts, getForumSettings } from '@/lib/forum';
import ThreadView from '@/components/features/forum/ThreadView';
import { notFound } from 'next/navigation';

export const revalidate = 0; // Dynamic data

interface PageProps {
  params: Promise<{ locale: string; threadId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const p = await params;
  const thread = await getForumThread(p.threadId);
  
  if (!thread) {
    return { title: 'Thread Not Found' };
  }

  return {
    title: `${thread.title} | SAO Forum`,
    description: thread.content.substring(0, 160) || `Read more about ${thread.title}`,
    openGraph: {
      title: thread.title,
      description: thread.content.substring(0, 160),
    }
  };
}

export default async function ThreadPage(props: PageProps) {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: 'Forum' });

  const [thread, posts, settings] = await Promise.all([
    getForumThread(params.threadId),
    getForumPosts(params.threadId),
    getForumSettings(),
  ]);

  if (!thread) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <ThreadView 
        thread={thread} 
        initialPosts={posts} 
        settings={settings}
      />
    </div>
  );
}
