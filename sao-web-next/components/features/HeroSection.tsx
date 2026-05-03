"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { WaitlistModal } from "@/components/features/WaitlistModal";
import { EntryOverlay } from "@/components/layout/EntryOverlay";
import Link from "next/link";

export function HeroSection() {
  const t = useTranslations("Home");
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnter = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => { });
    }
  };

  useEffect(() => {
    // Stop video on mobile
    const isMobileLite = window.matchMedia("(max-width: 768px)").matches;
    if (isMobileLite && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  return (
    <>
      <EntryOverlay onEnter={handleEnter} />
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />

      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 bg-black">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            src="/background.mp4"
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-6 px-4">
          <div className="inline-block rounded-full bg-primary/20 px-3 py-1 text-sm text-primary border border-primary/30">
            {t("badge")}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight uppercase font-heading drop-shadow-xl">
            {t("title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px] drop-shadow-md">
            {t("openBeta")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="hero-btn-play" onClick={() => setIsWaitlistOpen(true)}>
              ► {t("playNow")}
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-bounce opacity-70">
          <span className="text-sm uppercase tracking-widest mb-2">{t("scrollHint")}</span>
          <div className="w-px h-12 bg-foreground" />
        </div>
      </section>
    </>
  );
}
