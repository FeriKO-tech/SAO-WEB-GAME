"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { 
  subscribeToTicket, 
  subscribeToTicketMessages, 
  Ticket, 
  TicketMessage,
  markTicketReadForUser,
  sendUserMessage,
  sendStaffMessage,
  hasStaffRole,
  markTicketReadForStaff
} from "@/lib/tickets";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru, enUS, de, fr, pl, es, cs, it, uk } from "date-fns/locale";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

export default function TicketChatPage({ 
  params: { locale, id } 
}: { 
  params: { locale: string; id: string } 
}) {
  const t = useTranslations("Tickets");
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'loading' | 'ready' | 'notfound' | 'forbidden'>('loading');
  const [isStaff, setIsStaff] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      hasStaffRole().then(setIsStaff);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, authLoading, router, locale]);

  useEffect(() => {
    if (!user || !id) return;

    let msgUnsub: (() => void) | undefined;

    const ticketUnsub = subscribeToTicket(
      id,
      (data) => {
        if (!data) {
          setStatus('notfound');
          setLoading(false);
          return;
        }

        // Only staff or ticket owner can view
        hasStaffRole().then((staff) => {
          if (!staff && data.userId !== user.uid) {
            setStatus('forbidden');
            setLoading(false);
            return;
          }

          setTicket(data);
          setStatus('ready');
          setLoading(false);

          if (data.unreadForUser && !staff && data.userId === user.uid) {
            markTicketReadForUser(id);
          } else if (data.unreadForStaff && staff) {
            markTicketReadForStaff(id);
          }
        });

        if (!msgUnsub) {
          msgUnsub = subscribeToTicketMessages(
            id,
            (msgs) => {
              setMessages(msgs);
            },
            (error) => {
              console.error("Failed to subscribe to messages", error);
              if (error.code === 'permission-denied') {
                setStatus('forbidden');
              }
            }
          );
        }
      },
      (error) => {
        console.error("Failed to fetch ticket", error);
        setStatus('notfound');
        setLoading(false);
      }
    );

    return () => {
      ticketUnsub();
      if (msgUnsub) msgUnsub();
    };
  }, [user, id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  if (status === 'notfound') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-2xl font-heading mb-4">{t("chatNotFound")}</h1>
        <Link href={`/${locale}/my-tickets`} className="text-primary hover:underline">
          {t("chatBack")}
        </Link>
      </div>
    );
  }

  if (status === 'forbidden') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <h1 className="text-2xl font-heading mb-4 text-destructive">{t("chatForbidden")}</h1>
        <Link href={`/${locale}/my-tickets`} className="text-primary hover:underline">
          {t("chatBack")}
        </Link>
      </div>
    );
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending || ticket?.status === 'resolved') return;

    setIsSending(true);
    try {
      const result = isStaff 
        ? await sendStaffMessage(id, newMessage)
        : await sendUserMessage(id, newMessage);
        
      if (result.ok) {
        setNewMessage("");
      } else {
        toast.error(t("chatSendError"));
      }
    } catch (err) {
      toast.error(t("chatNetworkError"));
    } finally {
      setIsSending(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "account": return t("categoryAccount");
      case "bug": return t("categoryBug");
      case "payment": return t("categoryPayment");
      case "tech": return t("categoryTech");
      default: return t("categoryOther");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-24">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 h-[calc(100vh-140px)] flex flex-col">
        
        {/* Header */}
        <div className="flex-shrink-0 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/50 backdrop-blur-md p-4 rounded-xl border border-border/50">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/${isStaff ? 'admin-tickets' : 'my-tickets'}`} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-medium truncate max-w-[200px] sm:max-w-md">{ticket?.subject || ticket?.ticketNumber}</h1>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="font-mono bg-background/50 px-1.5 rounded text-xs">{ticket?.ticketNumber}</span>
                <span>•</span>
                <span>{ticket && getCategoryLabel(ticket.category)}</span>
              </div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap self-start sm:self-auto ${
            ticket?.status === 'resolved' 
              ? 'bg-muted border-muted-foreground/30 text-muted-foreground' 
              : 'bg-primary/10 border-primary/30 text-primary'
          }`}>
            {ticket?.status === 'resolved' ? t("statusResolved") : t("statusOpen")}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-grow bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden flex flex-col">
          <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                {t("chatEmpty")}
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.from === 'user';
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-5 py-3 ${
                      isUser 
                        ? 'bg-primary text-primary-foreground rounded-br-none' 
                        : 'bg-muted text-foreground rounded-bl-none'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm opacity-90">
                          {isUser ? t("userLabel") : (msg.authorName || t("staffLabel"))}
                        </span>
                        <span className="text-[10px] opacity-70">
                          {msg.createdAt && new Intl.DateTimeFormat(locales[locale] || enUS, {
                            hour: '2-digit', minute: '2-digit'
                          }).format(msg.createdAt)}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 p-4 bg-card/80 border-t border-border/50">
            {ticket?.status === 'resolved' ? (
              <div className="text-center py-2 text-muted-foreground">
                {t("chatClosed")}
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t("chatPlaceholder")}
                  className="bg-background/50 h-12"
                  disabled={isSending}
                />
                <Button 
                  type="submit" 
                  disabled={!newMessage.trim() || isSending}
                  className="h-12 w-12 shrink-0 rounded-xl"
                  size="icon"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
