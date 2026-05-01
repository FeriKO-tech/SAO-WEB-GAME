"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // We don't have Checkbox, maybe use standard input or add shadcn checkbox

// Since we didn't add shadcn checkbox, using a standard input for now
export function EntryOverlay({ onEnter }: { onEnter: () => void }) {
  const t = useTranslations("Home");
  const [visible, setVisible] = useState(false);
  const [skipPref, setSkipPref] = useState(false);

  useEffect(() => {
    const skip = localStorage.getItem("skipOverlay") === "true";
    // Also we could check if user is logged in here and skip it, 
    // but typically we can just rely on localStorage for this simple UI.
    const isMobileLite = window.matchMedia("(max-width: 768px)").matches;
    
    if (skip || isMobileLite) {
      setVisible(false);
      onEnter();
    } else {
      setVisible(true);
    }
  }, [onEnter]);

  const handleEnter = () => {
    if (skipPref) {
      localStorage.setItem("skipOverlay", "true");
    }
    setVisible(false);
    onEnter();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center text-center space-y-6 max-w-md px-4">
        <div className="text-4xl font-bold tracking-tighter uppercase font-heading text-primary">SAO</div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("entrySubtitle")}</p>
        
        <Button size="lg" onClick={handleEnter} className="w-full text-lg mt-4">
          {t("entryBtn")}
        </Button>
        
        <p className="text-sm text-muted-foreground animate-pulse">{t("entryHint")}</p>
        
        <label className="flex items-center space-x-2 text-sm text-muted-foreground cursor-pointer mt-8">
          <input 
            type="checkbox" 
            className="rounded border-gray-300 text-primary focus:ring-primary"
            checked={skipPref}
            onChange={(e) => setSkipPref(e.target.checked)}
          />
          <span>{t("entrySkip")}</span>
        </label>
      </div>
    </div>
  );
}
