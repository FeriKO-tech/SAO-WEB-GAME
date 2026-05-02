"use client";

import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { NewsPostDoc } from '@/lib/news';
import { useAuth } from '@/hooks/useAuth';
import { hasStaffRole } from '@/lib/tickets';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface NewsViewProps {
  initialPosts: NewsPostDoc[];
}

type FilterValue = 'all' | NewsPostDoc['category'];

export default function NewsView({ initialPosts }: NewsViewProps) {
  const t = useTranslations('News');
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
  const [posts] = useState(initialPosts); // In a real app we might subscribe, but ISR means we just use initial

  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    if (user) {
      hasStaffRole().then(setIsStaff);
    }
  }, [user]);

  const filters: { value: FilterValue; labelKey: string }[] = [
    { value: 'all', labelKey: 'filterAll' },
    { value: 'catAnnouncements', labelKey: 'catAnnouncements' },
    { value: 'catUpdates', labelKey: 'catUpdates' },
    { value: 'catEvents', labelKey: 'catEvents' },
    { value: 'catCommunity', labelKey: 'catCommunity' },
  ];

  const filtered = useMemo(() => {
    return posts.filter(p => activeFilter === 'all' || p.category === activeFilter);
  }, [posts, activeFilter]);

  const featured = activeFilter === 'all' ? filtered.find(p => p.featured) : undefined;
  const rest = featured ? filtered.filter(p => p !== featured) : filtered;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="tablist">
          {filters.map(f => {
            const isActive = activeFilter === f.value;
            return (
              <Button
                key={f.value}
                variant={isActive ? 'default' : 'secondary'}
                onClick={() => setActiveFilter(f.value)}
                role="tab"
                aria-selected={isActive}
                className="rounded-full"
              >
                {t(f.labelKey)}
              </Button>
            );
          })}
        </div>

        {isStaff && (
          <Button variant="outline" className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            {t('createNews', { defaultMessage: 'Create News' })}
          </Button>
        )}
      </div>

      {featured && (
        <Link href={`/news/${featured.slug}`} className="group relative rounded-2xl overflow-hidden border bg-card hover:border-primary/50 transition-colors">
          <div className="aspect-[21/9] w-full overflow-hidden relative">
            <img 
              src={featured.cover} 
              alt={featured.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="default" className="bg-primary/90 hover:bg-primary">{t('featuredLabel')}</Badge>
              <Badge variant="secondary" className="bg-background/80 backdrop-blur">{t(featured.category)}</Badge>
            </div>
            
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 font-medium">
                <time dateTime={featured.date}>{format(new Date(featured.date), 'MMMM d, yyyy')}</time>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{featured.minRead} {t('minRead')}</span>
                </div>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-heading mb-3 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                {featured.title}
              </h2>
              <p className="text-muted-foreground line-clamp-2 max-w-3xl">
                {featured.excerpt}
              </p>
            </div>
          </div>
        </Link>
      )}

      {rest.length === 0 && !featured ? (
        <div className="py-20 text-center border rounded-2xl bg-card">
          <h3 className="text-xl font-bold mb-2">{t('emptyTitle')}</h3>
          <p className="text-muted-foreground">{t('emptyDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(post => (
            <Link key={post.id} href={`/news/${post.slug}`} className="group rounded-xl overflow-hidden border bg-card hover:border-primary/50 transition-colors flex flex-col h-full">
              <div className="aspect-[16/9] w-full overflow-hidden relative">
                <img 
                  src={post.cover} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge variant="secondary" className="absolute top-3 left-3 bg-background/80 backdrop-blur">
                  {t(post.category)}
                </Badge>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-medium">
                  <time dateTime={post.date}>{format(new Date(post.date), 'MMM d, yyyy')}</time>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{post.minRead} min</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold font-heading mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                  {post.excerpt}
                </p>
                <div className="text-sm font-medium text-primary flex items-center gap-1">
                  {t('readMore')}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
