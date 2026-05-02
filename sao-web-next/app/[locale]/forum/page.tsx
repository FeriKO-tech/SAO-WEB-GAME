import { getTranslations } from 'next-intl/server';
import { getForumCategories, getForumThreads, getForumSettings } from '@/lib/forum';
import ForumView from '@/components/features/forum/ForumView';
import { use } from 'react';

export const revalidate = 0; // Disable static rendering since it's a dynamic forum

interface PageProps {
  searchParams: Promise<{ category?: string }>;
  params: Promise<{ locale: string }>;
}

export default async function ForumPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  
  const locale = params.locale;
  const categoryId = searchParams.category;

  const t = await getTranslations({ locale, namespace: 'Forum' });

  const [categories, threads, settings] = await Promise.all([
    getForumCategories(),
    getForumThreads(categoryId),
    getForumSettings(),
  ]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <header className="mb-4">
          <h1 className="text-4xl font-bold font-heading mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </header>
        
        <ForumView 
          initialCategories={categories}
          initialThreads={threads}
          activeCategory={categoryId}
          settings={settings}
        />
      </div>
    </div>
  );
}
