import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/features/HeroSection";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  const features = [
    {
      img: "/Storyline.png",
      title: t("f1Title"),
      desc: t("f1Desc"),
    },
    {
      img: "/Crossplatform.png",
      title: t("f2Title"),
      desc: t("f2Desc"),
    },
    {
      img: "/Dynamic_Gameplay.png",
      title: t("f3Title"),
      desc: t("f3Desc"),
    },
    {
      img: "/feature_heroes.png",
      title: t("f4Title"),
      desc: t("f4Desc"),
    },
    {
      img: "/Epic_Bosses.png",
      title: t("f5Title"),
      desc: t("f5Desc"),
    },
    {
      img: "/PvP.png",
      title: t("f6Title"),
      desc: t("f6Desc"),
    },
  ];

  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />

      {/* About Section */}
      <section className="relative py-24 bg-background overflow-hidden border-t border-border">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold font-heading">{t("aboutTitle")}</h2>
            <div className="space-y-4 text-muted-foreground text-lg">
              <p>{t("aboutP1")}</p>
              <p>{t("aboutP2")}</p>
              <p>{t("aboutP3")}</p>
            </div>
          </div>
          <div className="relative group rounded-xl overflow-hidden border border-border/50 bg-card">
            <Image
              src="/100_floor.png"
              alt="World"
              width={1024}
              height={768}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-2xl font-bold text-white">{t("aboutCard1")}</h3>
              <p className="text-primary font-semibold tracking-wider uppercase text-sm mt-1">
                {t("aboutCard2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 font-heading">
            {t("featuresTitle")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group relative rounded-xl overflow-hidden border border-border bg-card">
                <div className="aspect-video w-full overflow-hidden">
                  <Image
                    src={f.img}
                    alt={f.title}
                    width={1024}
                    height={576}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-sm">{t("footerCopy")}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-primary transition-colors">{t("terms")}</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">{t("privacy")}</Link>
            <a href="mailto:saoweb.support@gmail.com" className="hover:text-primary transition-colors">
              saoweb.support@gmail.com
            </a>
            <Link href="#" className="hover:text-primary transition-colors">{t("jobs")}</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
