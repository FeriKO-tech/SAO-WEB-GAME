"use client";

import { useEffect, useState, useMemo, use } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { subscribeToAllTickets, Ticket, hasStaffRole } from "@/lib/tickets";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Search, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru, enUS, de, fr, pl, es, cs, it, uk } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

type FilterType = 'all' | 'open' | 'resolved';

export default function AdminTicketsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("Tickets");
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [isStaff, setIsStaff] = useState<boolean | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, authLoading, router, locale]);

  useEffect(() => {
    if (!user) return;

    let unsub: (() => void) | undefined;

    hasStaffRole().then((staff) => {
      setIsStaff(staff);
      if (!staff) {
        setLoading(false);
        return;
      }

      unsub = subscribeToAllTickets(
        (items) => {
          setTickets(items);
          setLoading(false);
        },
        {},
        (error) => {
          console.error("Failed to subscribe to admin tickets:", error);
          setLoading(false);
        }
      );
    });

    return () => {
      if (unsub) unsub();
    };
  }, [user]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (filter !== 'all' && t.status !== filter) return false;
      if (unreadOnly && !t.unreadForStaff) return false;
      
      if (search.trim()) {
        const query = search.toLowerCase();
        const haystack = [
          t.ticketNumber,
          t.subject,
          t.name,
          t.email,
          t.assignedStaffName
        ].filter(Boolean).join(" ").toLowerCase();
        
        if (!haystack.includes(query)) return false;
      }
      
      return true;
    });
  }, [tickets, filter, search, unreadOnly]);

  const counts = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    const unread = tickets.filter(t => t.unreadForStaff).length;
    return { total, open, resolved, unread };
  }, [tickets]);

  if (authLoading || loading || isStaff === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-2xl font-heading mb-4 text-destructive">{t("chatForbidden")}</h1>
        <Link href={`/${locale}/`} className="text-primary hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "account": return t("categoryAccount");
      case "bug": return t("categoryBug");
      case "payment": return t("categoryPayment");
      case "tech": return t("categoryTech");
      default: return t("categoryOther");
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "low": return t("priorityLow");
      case "high": return t("priorityHigh");
      case "urgent": return t("priorityUrgent");
      default: return t("priorityNormal");
    }
  };

  const getTimeAgo = (date: Date | null) => {
    if (!date) return "";
    return formatDistanceToNow(date, { addSuffix: true, locale: locales[locale] || enUS });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="container max-w-5xl mx-auto pt-24 px-4 sm:px-6">
        
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading mb-2">{t("adminTitle")}</h1>
        </header>

        {/* Controls */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-xl mb-6 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex bg-muted/50 p-1 rounded-lg w-fit">
              {(['all', 'open', 'resolved'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    filter === f 
                      ? 'bg-background shadow-sm text-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f === 'all' ? t("filterAll") : f === 'open' ? t("filterOpen") : t("filterResolved")}
                  <span className="ml-2 opacity-50">
                    {f === 'all' ? counts.total : f === 'open' ? counts.open : counts.resolved}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets..."
                className="pl-9 bg-background/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 lg:border-l lg:pl-6 border-border/50">
            <div className="flex items-center gap-2">
              <Switch 
                id="unread-only" 
                checked={unreadOnly}
                onCheckedChange={setUnreadOnly}
              />
              <Label htmlFor="unread-only" className="cursor-pointer">
                {t("filterUnreadOnly")}
              </Label>
              {counts.unread > 0 && (
                <span className="ml-1 bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                  {counts.unread}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* List */}
        {filteredTickets.length === 0 ? (
          <div className="text-center py-20 bg-card/30 border border-border/50 rounded-lg backdrop-blur-sm">
            <p className="text-muted-foreground">
              {search || unreadOnly || filter !== 'all' ? t("adminNoResults") : t("adminNoTickets")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <Link 
                key={ticket.id} 
                href={`/${locale}/support/ticket/${ticket.id}`}
                className="block bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 sm:p-5 hover:bg-card/80 transition-colors group relative overflow-hidden"
              >
                {ticket.unreadForStaff && (
                  <div className="absolute top-0 right-0 w-2 h-2 m-4 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]" title={t("unreadBadge")} />
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <h3 className="font-medium text-lg truncate pr-6 text-foreground">
                        {ticket.subject || ticket.ticketNumber}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {ticket.name} • {ticket.email}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center text-xs sm:text-sm text-muted-foreground gap-2 sm:gap-3">
                      <span className="font-mono text-xs bg-background/50 px-2 py-0.5 rounded border border-border/50">
                        {ticket.ticketNumber}
                      </span>
                      <span className="text-secondary">{getCategoryLabel(ticket.category)}</span>
                      
                      {ticket.priority !== 'normal' && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          ticket.priority === 'urgent' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                          ticket.priority === 'high' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                          'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                        }`}>
                          {getPriorityLabel(ticket.priority)}
                        </span>
                      )}

                      {ticket.assignedStaffId && (
                        <span className="bg-muted px-2 py-0.5 rounded text-xs">
                          {t("assignmentLabel")}: {ticket.assignedStaffName || t("staffLabel")}
                        </span>
                      )}

                      <span>{getTimeAgo(ticket.lastMessageAt)}</span>
                    </div>
                  </div>
                  
                  <div className="shrink-0 self-start sm:self-center">
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
