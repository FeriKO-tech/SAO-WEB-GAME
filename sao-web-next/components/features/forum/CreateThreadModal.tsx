"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { ForumCategoryDoc, uploadForumImage } from '@/lib/forum';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Paperclip, X } from 'lucide-react';
import { forumThreadSchema } from '@/lib/schemas';

interface CreateThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ForumCategoryDoc[];
  preselectedCategoryId?: string;
}

export default function CreateThreadModal({ isOpen, onClose, categories, preselectedCategoryId }: CreateThreadModalProps) {
  const t = useTranslations('Forum');
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof forumThreadSchema>>({
    resolver: zodResolver(forumThreadSchema),
    defaultValues: {
      categoryId: preselectedCategoryId || categories[0]?.id || '',
      categoryKey: preselectedCategoryId ? (categories.find(c => c.id === preselectedCategoryId)?.key || 'general') : (categories[0]?.key || 'general'),
      title: '',
      content: '',
      images: [],
      author: user?.displayName || user?.email?.split('@')[0] || 'Unknown User',
      authorUid: user?.uid || '',
    },
  });

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

  const onSubmit = async (values: z.infer<typeof forumThreadSchema>) => {
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

      const response = await fetch('/api/forum/thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(t('threadCreateSuccess'));
        onClose();
        router.push(`/forum/thread/${data.id}`);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to create thread. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('threadCreateTitle')}</DialogTitle>
          <DialogDescription>
            {t('threadCreateDesc')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('threadCreateCategory')}</FormLabel>
                  <Select 
                    onValueChange={(val) => {
                      field.onChange(val);
                      const key = categories.find(c => c.id === val)?.key;
                      if (key) form.setValue('categoryKey', key as any);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {t(cat.key)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('threadCreateSubject')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('threadCreateSubjectPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('threadCreateMessage')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('threadCreateMessagePlaceholder')} 
                      className="min-h-[150px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Attachments</FormLabel>
              <div className="flex flex-wrap gap-4">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="relative w-20 h-20 border rounded-md overflow-hidden group">
                    {/* Object URL for preview */}
                    <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 bg-background/80 text-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                {selectedFiles.length < 5 && (
                  <label className="w-20 h-20 border border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors cursor-pointer">
                    <Paperclip size={20} className="mb-1" />
                    <span className="text-[10px]">Attach</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('threadCreateSubmit')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
