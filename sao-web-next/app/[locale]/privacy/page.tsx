import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sword Art Online',
  description: 'Privacy Policy for the Sword Art Online browser MMORPG.',
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage(props: PageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Privacy' });

  const sections = [
    { title: t('s1t'), body: t('s1b') },
    { title: t('s2t'), list: [t('s2l1'), t('s2l2'), t('s2l3'), t('s2l4'), t('s2l5')] },
    { title: t('s3t'), list: [t('s3l1'), t('s3l2'), t('s3l3'), t('s3l4'), t('s3l5'), t('s3l6')] },
    { title: t('s4t'), body: t('s4b') },
    { title: t('s5t'), body: t('s5b'), list: [t('s5l1'), t('s5l2'), t('s5l3'), t('s5l4')] },
    { title: t('s6t'), body: t('s6b') },
    { title: t('s7t'), body: t('s7b'), list: [t('s7l1'), t('s7l2'), t('s7l3'), t('s7l4'), t('s7l5')] },
    { title: t('s8t'), body: t('s8b') },
    { title: t('s9t'), body: t('s9b') },
    { title: t('s10t'), body: t.raw('s10b') },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="container max-w-3xl mx-auto pt-24 px-4 sm:px-6">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={16} />
          {t('back')}
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white">SAO</div>
            <h1 className="text-3xl sm:text-4xl font-heading">{t('title')}</h1>
          </div>
          <p className="text-sm text-muted-foreground">{t('date')}</p>
        </header>

        <div className="space-y-8">
          {sections.map((s, i) => (
            <section key={i} className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-3">{s.title}</h2>
              {s.body && <div className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: s.body }} />}
              {s.list && (
                <ul className="mt-2 space-y-1.5 text-muted-foreground list-disc pl-5">
                  {s.list.map((item, j) => (
                    <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
