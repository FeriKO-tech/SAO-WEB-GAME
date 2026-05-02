import { getTranslations } from 'next-intl/server';
import { getNewsPosts } from '@/lib/news';
import NewsView from '@/components/features/news/NewsView';

export const revalidate = 300; // ISR with 5 minutes revalidation

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewsPage(props: PageProps) {
  const params = await props.params;
  const t = await getTranslations({ locale: params.locale, namespace: 'News' });
  const posts = await getNewsPosts(params.locale);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold font-heading mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </header>

        <NewsView initialPosts={posts} />
      </div>
    </div>
  );
}
