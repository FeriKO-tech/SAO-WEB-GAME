"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { ForumThreadDoc, ForumPostDoc, uploadForumImage } from '@/lib/forum';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Paperclip, X, ArrowLeft, Trash2 } from 'lucide-react';
import { forumReplySchema } from '@/lib/schemas';
import { formatDistanceToNow, format } from 'date-fns';
import { deleteDoc, doc, writeBatch, increment, onSnapshot, query, collection, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { hasStaffRole } from '@/lib/tickets';

interface ThreadViewProps {
  thread: ForumThreadDoc;
  initialPosts: ForumPostDoc[];
  settings: { publicVisible: boolean; postingEnabled: boolean };
}

export default function ThreadView({ thread: initialThread, initialPosts, settings }: ThreadViewProps) {
  const t = useTranslations('Forum');
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [posts, setPosts] = useState(initialPosts);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    if (user) {
      hasStaffRole().then(setIsStaff);
    }
  }, [user]);

  // Real-time subscription for posts
  useEffect(() => {
    const q = query(
      collection(db, 'forumThreads', initialThread.id, 'posts'),
      orderBy('createdAt', 'asc')
    );
    
    const unsub = onSnapshot(q, (snap) => {
      const newPosts = snap.docs.map(d => ({ id: d.id, ...d.data() } as ForumPostDoc));
      setPosts(newPosts);
    });

    return () => unsub();
  }, [initialThread.id]);

  const form = useForm<z.infer<typeof forumReplySchema>>({
    resolver: zodResolver(forumReplySchema),
    defaultValues: {
      threadId: initialThread.id,
      text: '',
      images: [],
      author: user?.displayName || user?.email?.split('@')[0] || 'Unknown User',
      authorUid: user?.uid || '',
    },
  });

  // Re-sync form default values if user finishes loading
  useEffect(() => {
    if (user) {
      form.setValue('author', user?.displayName || user?.email?.split('@')[0] || 'Unknown User');
      form.setValue('authorUid', user.uid);
    }
  }, [user, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles = filesArray.filter(f => f.type.startsWith('image/'));
      
      if (validFiles.length !== filesArray.length) {
        toast.error('Only image files are allowed');
      }
      
      setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof forumReplySchema>) => {
    if (!user) {
      toast.error(t('loginToPost'));
      return;
    }

    try {
      setIsSubmitting(true);
      
      const imageUrls: string[] = [];
      for (const file of selectedFiles) {
        const url = await uploadForumImage(file);
        imageUrls.push(url);
      }

      const payload = {
        ...values,
        images: imageUrls,
      };

      const response = await fetch('/api/forum/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.success) {
        form.reset();
        setSelectedFiles([]);
        toast.success(t('replySuccess', { defaultMessage: 'Reply posted!' }));
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to post reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteThread = async () => {
    if (!confirm('Are you sure you want to delete this entire thread?')) return;
    
    try {
      // In a real app this should be a secure API route, but we will use the client-side approach for demo purposes, assuming Staff claim allows it
      await deleteDoc(doc(db, 'forumThreads', initialThread.id));
      toast.success('Thread deleted');
      router.push('/forum');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete thread');
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;
    
    try {
      await deleteDoc(doc(db, 'forumThreads', initialThread.id, 'posts', postId));
      toast.success('Reply deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete reply');
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/forum" className="hover:text-foreground transition-colors">{t('title')}</Link>
        <span>/</span>
        <Link href={`/forum?category=${initialThread.categoryId}`} className="hover:text-foreground transition-colors">{t(initialThread.category)}</Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px]">{initialThread.title}</span>
      </nav>

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-heading">{initialThread.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{initialThread.author}</span>
          <span>•</span>
          <time dateTime={initialThread.createdAt}>{formatDistanceToNow(new Date(initialThread.createdAt), { addSuffix: true })}</time>
          <span>•</span>
          <span>{initialThread.views} {t('views')}</span>
          {isStaff && (
            <>
              <span>•</span>
              <Button variant="ghost" size="sm" onClick={deleteThread} className="text-destructive h-6 px-2">
                <Trash2 size={14} className="mr-1" />
                Delete
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="space-y-4">
        {/* OP Post */}
        <div className="bg-card border rounded-xl p-6">
          <div className="whitespace-pre-wrap">{initialThread.content}</div>
          
          {initialThread.images && initialThread.images.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-6">
              {initialThread.images.map((img, idx) => (
                <a key={idx} href={img} target="_blank" rel="noopener noreferrer" className="block max-w-[300px] rounded-lg overflow-hidden border">
                  <img src={img} alt="Attachment" className="w-full h-auto object-cover" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Replies */}
        {posts.map(post => (
          <div key={post.id} className="bg-card border rounded-xl p-6 relative group">
            <div className="flex justify-between items-start mb-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{post.author}</span>
              <div className="flex items-center gap-4">
                <time dateTime={post.createdAt}>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</time>
                {isStaff && (
                  <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)} className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={14} className="text-destructive" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="whitespace-pre-wrap">{post.text}</div>
            
            {post.images && post.images.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-6">
                {post.images.map((img, idx) => (
                  <a key={idx} href={img} target="_blank" rel="noopener noreferrer" className="block max-w-[200px] rounded-lg overflow-hidden border">
                    <img src={img} alt="Attachment" className="w-full h-auto object-cover" />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {!settings.postingEnabled ? (
        <div className="bg-muted text-muted-foreground p-6 rounded-xl text-center">
          {t('readOnlyDesc')}
        </div>
      ) : !user ? (
        <div className="bg-muted p-6 rounded-xl flex items-center justify-between">
          <span className="font-medium">{t('threadReplyLogin')}</span>
          <Link href={`/login?returnTo=${encodeURIComponent(pathname)}`}>
            <Button>
              {t('login', { defaultMessage: 'Login to reply' })}
            </Button>
          </Link>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="bg-card border rounded-xl p-6 space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder={t('threadReplyPlaceholder')} 
                      className="min-h-[120px] resize-y"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-end">
              <div className="flex flex-wrap gap-4">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="relative w-16 h-16 border rounded-md overflow-hidden group">
                    <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 bg-background/80 text-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                
                {selectedFiles.length < 5 && (
                  <label className="w-16 h-16 border border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors cursor-pointer">
                    <Paperclip size={16} className="mb-1" />
                    <span className="text-[9px]">Attach</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting || !form.watch('text').trim()}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('threadReplySubmit')}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
