"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const waitlistSchema = z.object({
  email: z.string().email(),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

export function WaitlistModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("Home");
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  });

  const onSubmit = async (data: WaitlistFormData) => {
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await res.json();

      if (!res.ok || !result.ok) {
        if (result.reason === "invalid-email") {
          setError("email", { message: "Invalid email" }); // Note: We could use t() for errors if mapped
        } else if (result.reason === "already-signed-up") {
          setError("email", { message: "You are already on the waitlist" });
        } else {
          toast.error("Network error");
        }
        return;
      }

      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      // Delay reset so it doesn't flicker while closing
      setTimeout(() => {
        reset();
        setIsSuccess(false);
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("waitlistTitle")}</DialogTitle>
              <DialogDescription dangerouslySetInnerHTML={{ __html: t("waitlistDesc") }} />
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("waitlistEmailLabel")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("waitlistEmailPh")}
                  {...register("email")}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                <p className="text-sm text-muted-foreground">{t("waitlistNote")}</p>
              </div>
              <DialogFooter className="sm:justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
                  {t("waitlistCancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t("waitlistSubmitting") : t("waitlistSubmit")}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("waitlistSuccessTitle")}</DialogTitle>
              <DialogDescription>
                {t("waitlistSuccessMsg", { email: submittedEmail })}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" onClick={() => handleOpenChange(false)}>
                {t("waitlistClose")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
