import { useTranslations } from "next-intl";
import { TicketForm } from "@/components/features/support/TicketForm";
import Link from "next/link";
import { Mail, MessageCircle, HelpCircle } from "lucide-react";

export default function SupportPage() {
  const t = useTranslations("Support");

  const faqItems = t.raw("faq") as { q: string; a: string }[];

  return (
    <div className="min-h-screen bg-background text-foreground relative pb-20">
      {/* Background Video */}
      <video
        className="fixed top-0 left-0 w-full h-full object-cover -z-10 opacity-20"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src="/support.mp4" type="video/mp4" />
      </video>

      <div className="container max-w-5xl mx-auto pt-24 px-4 sm:px-6">
        <Link href="/" className="inline-block mb-8 text-primary hover:text-primary/80 transition-colors font-medium">
          ← {t("title")} {/* Actually should be 'Back to home' but t('title') is ok for now */}
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-heading mb-4">{t("title")}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">{t("subtitle")}</p>
        </div>

        {/* Quick Contacts */}
        <div className="mb-16">
          <h2 className="text-2xl font-heading mb-2">{t("quickTitle")}</h2>
          <p className="text-muted-foreground mb-6">{t("quickDesc")}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a href="mailto:saoweb.support@gmail.com" className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-lg hover:bg-card/80 transition-colors flex flex-col items-center text-center group">
              <Mail className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-lg">{t("quickEmail")}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t("quickEmailDesc")}</p>
              <span className="text-sm text-primary">saoweb.support@gmail.com</span>
            </a>

            <a href="https://dsc.gg/sao-web" target="_blank" rel="noopener noreferrer" className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-lg hover:bg-card/80 transition-colors flex flex-col items-center text-center group">
              <MessageCircle className="w-8 h-8 text-[#5865F2] mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-lg">{t("quickDiscord")}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t("quickDiscordDesc")}</p>
              <span className="text-sm text-[#5865F2]">dsc.gg/sao-web</span>
            </a>

            <a href="#faq" className="bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-lg hover:bg-card/80 transition-colors flex flex-col items-center text-center group">
              <HelpCircle className="w-8 h-8 text-secondary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-lg">{t("quickFaq")}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t("quickFaqDesc")}</p>
              <span className="text-sm text-secondary">{t("quickFaqLink")}</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* FAQ */}
          <div id="faq">
            <h2 className="text-2xl font-heading mb-2">{t("faqTitle")}</h2>
            <p className="text-muted-foreground mb-6">{t("faqDesc")}</p>
            
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <details key={index} className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg open:bg-card/80 transition-colors">
                  <summary className="flex cursor-pointer items-center justify-between p-4 font-medium list-none">
                    {item.q}
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="p-4 pt-0 text-muted-foreground text-sm" dangerouslySetInnerHTML={{ __html: item.a }} />
                </details>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <TicketForm />
          </div>
        </div>
      </div>
    </div>
  );
}
