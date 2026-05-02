"use client";

import { useEffect, useState, use } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { subscribeToUserTickets, Ticket } from "@/lib/tickets";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru, enUS, de, fr, pl, es, cs, it, uk } from "date-fns/locale";

const locales: Record<string, any> = {
  ru,
  en: enUS,
  de,
  fr,
  pl,
  es,
  cz: cs,
  it,
  ua: uk,
};

export default function MyTicketsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("Tickets");
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, authLoading, router, locale]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserTickets(
      user.uid,
      (items) => {
        setTickets(items);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to subscribe to tickets:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null; // will redirect

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "account": return t("categoryAccount");
      case "bug": return t("categoryBug");
      case "payment": return t("categoryPayment");
      case "tech": return t("categoryTech");
      default: return t("categoryOther");
    }
  };

  const getTimeAgo = (date: Date | null) => {
    if (!date) return "";
    return formatDistanceToNow(date, { addSuffix: true, locale: locales[locale] || enUS });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="container max-w-4xl mx-auto pt-24 px-4 sm:px-6">
        <Link href={`/${locale}/support`} className="inline-block mb-8 text-primary hover:text-primary/80 transition-colors font-medium">
          {t("backToSupport")}
        </Link>

        <header className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading mb-2">{t("pageTitle")}</h1>
            <p className="text-muted-foreground">{t("pageSubtitle")}</p>
          </div>
          <Link 
            href={`/${locale}/support`} 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 py-2 px-4 whitespace-nowrap"
          >
            {t("newTicket")}
          </Link>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-card/50 border border-border/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20 bg-card/30 border border-border/50 rounded-lg backdrop-blur-sm">
            <p className="text-muted-foreground">{t("noTickets")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Link 
                key={ticket.id} 
                href={`/${locale}/support/ticket/${ticket.id}`}
                className="block bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-5 hover:bg-card/80 transition-colors group relative overflow-hidden"
              >
                {ticket.unreadForUser && (
                  <div className="absolute top-0 right-0 w-2 h-2 m-4 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]" title={t("unreadBadge")} />
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-medium text-lg truncate pr-6">
                      {ticket.subject || ticket.ticketNumber}
                    </h3>
                    <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-3">
                      <span className="font-mono text-xs bg-background/50 px-2 py-0.5 rounded border border-border/50">{ticket.ticketNumber}</span>
                      <span className="text-secondary">{getCategoryLabel(ticket.category)}</span>
                      <span>{t("msgCount", { n: ticket.messageCount })}</span>
                      <span>{getTimeAgo(ticket.lastMessageAt)}</span>
                    </div>
                  </div>
                  
                  <div className="shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      ticket.status === 'resolved' 
                        ? 'bg-muted border-muted-foreground/30 text-muted-foreground' 
                        : 'bg-primary/10 border-primary/30 text-primary'
                    }`}>
                      {ticket.status === 'resolved' ? t("statusResolved") : t("statusOpen")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
