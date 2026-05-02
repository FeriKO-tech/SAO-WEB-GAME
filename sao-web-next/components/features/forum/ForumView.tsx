"use client";

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { ForumCategoryDoc, ForumThreadDoc } from '@/lib/forum';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare, Eye, Pin, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CreateThreadModal from './CreateThreadModal';
import { formatDistanceToNow } from 'date-fns';

interface ForumViewProps {
  initialCategories: ForumCategoryDoc[];
  initialThreads: ForumThreadDoc[];
  activeCategory?: string;
  settings: { publicVisible: boolean; postingEnabled: boolean };
}

export default function ForumView({ initialCategories, initialThreads, activeCategory, settings }: ForumViewProps) {
  const t = useTranslations('Forum');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const router = useRouter();

  const filteredThreads = useMemo(() => {
    if (!searchQuery.trim()) return initialThreads;
    const q = searchQuery.toLowerCase();
    return initialThreads.filter(th => 
      th.title.toLowerCase().includes(q) || th.author.toLowerCase().includes(q)
    );
  }, [initialThreads, searchQuery]);

  if (!settings.publicVisible) {
    return (
      <div className="p-8 text-center bg-card rounded-xl border">
        <h2 className="text-xl font-bold mb-2">{t('hiddenBadge')}</h2>
        <p className="text-muted-foreground">{t('hiddenDesc')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {!activeCategory ? (
        <section>
          <h2 className="text-2xl font-bold mb-4">{t('categoriesTitle')}</h2>
          <div className="grid gap-4">
            {initialCategories.map(cat => (
              <Link key={cat.id} href={`/forum?category=${cat.id}`} className="flex items-center p-4 bg-card hover:bg-accent/50 transition-colors border rounded-xl gap-4">
                <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <MessageSquare size={24} />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{t(cat.key)}</h3>
                  <p className="text-sm text-muted-foreground">{t(`${cat.key}Desc`)}</p>
                </div>
                <div className="flex flex-col items-center justify-center text-sm text-muted-foreground px-4 border-l border-r border-border/50">
                  <span className="font-bold text-foreground">{cat.threads}</span>
                  <span>{t('thThreads')}</span>
                </div>
                <div className="flex flex-col items-center justify-center text-sm text-muted-foreground px-4 border-r border-border/50">
                  <span className="font-bold text-foreground">{cat.posts}</span>
                  <span>{t('thPosts')}</span>
                </div>
                <div className="w-48 text-sm text-right flex-shrink-0 pl-4">
                  {cat.lastPost ? (
                    <div className="flex flex-col">
                      <span className="truncate font-medium" title={cat.lastPost.title}>{cat.lastPost.title}</span>
                      <span className="text-muted-foreground text-xs">{cat.lastPost.author} • {formatDistanceToNow(new Date(cat.lastPost.at), { addSuffix: true })}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">{t('noPosts')}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
          <Link href="/forum" className="hover:text-foreground transition-colors">{t('title')}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{t(initialCategories.find(c => c.id === activeCategory)?.key || 'Category')}</span>
        </div>
      )}

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{activeCategory ? t(initialCategories.find(c => c.id === activeCategory)?.key || 'Category') : t('recentThreads')}</h2>
          
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder={t('searchPlaceholder')} 
                className="pl-9"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            {settings.postingEnabled && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t('newThread')}
              </Button>
            )}
            
            {!settings.postingEnabled && (
              <Badge variant="secondary">{t('readOnlyBadge')}</Badge>
            )}
          </div>
        </div>

        <div className="grid gap-2 border rounded-xl overflow-hidden bg-card">
          <div className="flex items-center p-3 bg-muted/50 border-b text-sm font-medium text-muted-foreground">
            <div className="flex-grow pl-2">{t('thTopic')}</div>
            <div className="w-24 text-center">{t('thReplies')}</div>
            <div className="w-24 text-center">{t('thViews')}</div>
            <div className="w-48 text-right pr-2">{t('thLastPost')}</div>
          </div>
          
          {filteredThreads.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {t('emptyThreads')}
            </div>
          ) : (
            filteredThreads.map(th => (
              <Link key={th.id} href={`/forum/${th.id}`} className="flex items-center p-3 hover:bg-accent/50 transition-colors border-b last:border-0">
                <div className="flex-grow pl-2 flex flex-col">
                  <div className="flex items-center gap-2">
                    {th.pinned && <Pin className="w-3 h-3 text-primary" />}
                    <span className="font-medium text-foreground">{th.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{th.author} in {t(th.category)}</span>
                </div>
                <div className="w-24 text-center text-sm">{th.replies}</div>
                <div className="w-24 text-center text-sm">{th.views}</div>
                <div className="w-48 text-right pr-2 flex flex-col text-sm">
                  <span>{formatDistanceToNow(new Date(th.lastActivity), { addSuffix: true })}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {isCreateModalOpen && (
        <CreateThreadModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          categories={initialCategories}
          preselectedCategoryId={activeCategory}
        />
      )}
    </div>
  );
}
