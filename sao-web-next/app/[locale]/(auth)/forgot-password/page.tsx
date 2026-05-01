"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const forgotSchema = z.object({
  email: z.string().email("Invalid email"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const t = useTranslations("Auth");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success(t("forgotSuccess"));
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      toast.success(t("forgotSuccess")); // Security best practice: don't reveal if email exists
      router.push("/login");
    }
  };

  return (
    <Card className="w-full bg-card/80 backdrop-blur-md border-border/50 shadow-2xl">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 bg-primary/20 text-primary font-heading font-bold flex items-center justify-center rounded-full mb-4">
          SAO
        </div>
        <CardTitle className="text-3xl font-heading">{t("forgotTitle")}</CardTitle>
        <CardDescription>{t("forgotDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("emailLabel")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPh")}
              className="bg-background/50"
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <Button type="submit" className="w-full text-md h-12" disabled={isSubmitting}>
            {t("forgotSubmit")}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center border-t border-border/50 pt-4 pb-6">
        <Link href="/login" className="text-sm text-primary font-medium hover:underline">
          {t("backToLogin")}
        </Link>
      </CardFooter>
    </Card>
  );
}
