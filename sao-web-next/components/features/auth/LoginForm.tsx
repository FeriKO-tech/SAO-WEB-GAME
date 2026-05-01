"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      toast.success(t("successLogin", { name: userCredential.user.displayName || "Player" }));
      router.push(returnTo);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        toast.error(t("errorAccountNotFound"));
      } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        toast.error(t("errorWrongPassword"));
      } else if (err.code === "auth/too-many-requests") {
        toast.error(t("errorTooManyRequests"));
      } else if (err.code === "auth/network-request-failed") {
        toast.error(t("errorNetwork"));
      } else {
        toast.error(t("errorUnknown"));
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      toast.success(t("successLogin", { name: userCredential.user.displayName || "Player" }));
      router.push(returnTo);
    } catch (err: any) {
      console.error(err);
      toast.error(t("errorUnknown"));
    }
  };

  return (
    <Card className="w-full bg-card/80 backdrop-blur-md border-border/50 shadow-2xl">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 bg-primary/20 text-primary font-heading font-bold flex items-center justify-center rounded-full mb-4">
          SAO
        </div>
        <CardTitle className="text-3xl font-heading">{t("loginTitle")}</CardTitle>
        <CardDescription>{t("loginSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Button variant="outline" type="button" onClick={handleGoogleLogin} className="w-full bg-background/50 hover:bg-background">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.26v2.84C4.08 20.58 7.74 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.26C1.52 8.54 1.1 10.22 1.1 12s.42 3.46 1.16 4.93l3.58-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.74 1 4.08 3.42 2.26 7.07l3.58 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {t("googleButton")}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {t("orContinueWith")}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t("passwordLabel")}</Label>
                <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  {t("forgot")}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder={t("passwordPh")}
                className="bg-background/50"
                {...register("password")}
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full text-md h-12" disabled={isSubmitting}>
              {isSubmitting ? t("loginSubmitting") : t("loginSubmit")}
            </Button>
          </form>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center border-t border-border/50 pt-4 pb-6">
        <p className="text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            {t("registerLink")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
