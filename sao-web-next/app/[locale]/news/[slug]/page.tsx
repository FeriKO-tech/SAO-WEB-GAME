import { getTranslations } from 'next-intl/server';
import { getNewsPostBySlug } from '@/lib/news';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const p = await params;
  const post = await getNewsPostBySlug(p.slug);
  
  if (!post) {
    return { title: 'Not Found' };
  }

  return {
    title: `${post.title} | SAO News`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.cover],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    }
  };
}

export default async function NewsArticlePage(props: PageProps) {
  const params = await props.params;
  const post = await getNewsPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const t = await getTranslations({ locale: params.locale, namespace: 'News' });

  // Structured Data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    image: [post.cover],
    datePublished: post.date,
    dateModified: post.date,
    author: [{
      '@type': 'Person',
      name: post.author
    }],
    description: post.excerpt
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <article className="container max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <Link href="/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={16} />
          {t('back', { defaultMessage: 'Back to News' })}
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{t(post.category)}</Badge>
            {post.tags?.map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm font-medium border-b pb-6">
            <div className="flex items-center gap-2">
              <span className="text-foreground">{post.author}</span>
            </div>
            <span>•</span>
            <time dateTime={post.date}>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{post.minRead} {t('minRead')}</span>
            </div>
          </div>
        </header>

        {post.cover && (
          <div className="rounded-2xl overflow-hidden mb-12 border bg-muted">
            <img 
              src={post.cover} 
              alt={post.title} 
              className="w-full h-auto max-h-[60vh] object-cover"
            />
          </div>
        )}

        <div 
          className="prose prose-invert prose-lg max-w-none 
                     prose-headings:font-heading prose-headings:font-bold 
                     prose-a:text-primary hover:prose-a:text-primary/80 
                     prose-img:rounded-xl prose-img:border"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </>
  );
}
