"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getCurrentLanguage } from "@/lib/i18n";

const ticketSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  category: z.enum(["account", "bug", "payment", "tech", "other"]),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type TicketFormData = z.infer<typeof ticketSchema>;

export function TicketForm() {
  const t = useTranslations("Support");
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      category: "other",
    }
  });

  const onSubmit = async (data: TicketFormData) => {
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          lang: getCurrentLanguage(),
          attachments: [], // Attachments logic can be added later
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(t("successMsg"));
        reset();
      } else {
        toast.error(t("ticketErrGeneric"));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("ticketErrNetwork"));
    }
  };

  return (
    <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-heading mb-2">{t("formTitle")}</h2>
      <p className="text-muted-foreground mb-6">{t("formDesc")}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("formName")}</Label>
            <Input
              id="name"
              {...register("name")}
              className="bg-background/50"
            />
            {errors.name && <p className="text-xs text-destructive">{t("nameEmpty")}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("formEmail")}</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className="bg-background/50"
            />
            {errors.email && <p className="text-xs text-destructive">{t("emailBad")}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">{t("formCategory")}</Label>
          <select
            id="category"
            {...register("category")}
            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="account">{t("catAccount")}</option>
            <option value="bug">{t("catBug")}</option>
            <option value="payment">{t("catPayment")}</option>
            <option value="tech">{t("catTech")}</option>
            <option value="other">{t("catOther")}</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">{t("formSubject")}</Label>
          <Input
            id="subject"
            {...register("subject")}
            className="bg-background/50"
          />
          {errors.subject && <p className="text-xs text-destructive">{t("subjectShort")}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">{t("formMessage")}</Label>
          <textarea
            id="message"
            {...register("message")}
            rows={5}
            className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground">{t("formMessageHint")}</p>
          {errors.message && <p className="text-xs text-destructive">{t("messageShort")}</p>}
        </div>

        <Button type="submit" className="w-full text-md h-12" disabled={isSubmitting}>
          {isSubmitting ? t("formSubmitting") : t("formSubmit")}
        </Button>
      </form>
    </div>
  );
}
