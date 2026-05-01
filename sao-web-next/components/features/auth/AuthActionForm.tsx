"use client";

import { useEffect, useState } from "react";
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
import { checkActionCode, applyActionCode, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react"; // Wait, lucide-react might not be installed, we can just use CSS spinner

const resetSchema = z.object({
  password: z.string().min(6, "Minimum 6 characters"),
});

type ResetFormData = z.infer<typeof resetSchema>;

export function AuthActionForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  const [status, setStatus] = useState<"loading" | "success" | "error" | "reset-form">("loading");
  const [email, setEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  useEffect(() => {
    if (!mode || !oobCode) {
      setStatus("error");
      return;
    }

    const handleAction = async () => {
      try {
        if (mode === "resetPassword") {
          const emailFromCode = await verifyPasswordResetCode(auth, oobCode);
          setEmail(emailFromCode);
          setStatus("reset-form");
        } else if (mode === "verifyEmail") {
          await applyActionCode(auth, oobCode);
          setStatus("success");
          toast.success(t("actionVerifySuccess"));
        } else if (mode === "recoverEmail") {
          const info = await checkActionCode(auth, oobCode);
          await applyActionCode(auth, oobCode);
          setStatus("success");
          toast.success(t("actionRecoverSuccess"));
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
        toast.error(t("actionInvalid"));
      }
    };

    handleAction();
  }, [mode, oobCode, t]);

  const onResetSubmit = async (data: ResetFormData) => {
    try {
      if (!oobCode) return;
      await confirmPasswordReset(auth, oobCode, data.password);
      toast.success(t("actionResetSuccess"));
      router.push("/login");
    } catch (err) {
      console.error(err);
      toast.error(t("actionInvalid"));
      setStatus("error");
    }
  };

  return (
    <Card className="w-full bg-card/80 backdrop-blur-md border-border/50 shadow-2xl">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 bg-primary/20 text-primary font-heading font-bold flex items-center justify-center rounded-full mb-4">
          SAO
        </div>
        <CardTitle className="text-3xl font-heading">{t("actionTitle")}</CardTitle>
        <CardDescription>
          {status === "loading" && mode === "verifyEmail" && t("actionVerify")}
          {status === "loading" && mode === "recoverEmail" && t("actionRecover")}
          {status === "loading" && mode === "resetPassword" && t("actionReset")}
          {status === "success" && mode === "verifyEmail" && t("actionVerifySuccess")}
          {status === "success" && mode === "recoverEmail" && t("actionRecoverSuccess")}
          {status === "error" && t("actionInvalid")}
          {status === "reset-form" && t("actionResetDesc")}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col items-center">
        {status === "loading" && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary my-4"></div>
        )}

        {status === "error" && (
          <Button className="w-full" onClick={() => router.push("/login")}>
            {t("backToLogin")}
          </Button>
        )}

        {status === "success" && (
          <Button className="w-full" onClick={() => router.push("/login")}>
            {t("backToLogin")}
          </Button>
        )}

        {status === "reset-form" && (
          <form onSubmit={handleSubmit(onResetSubmit)} className="space-y-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="password">{t("actionResetTitle")}</Label>
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
              {t("actionResetSubmit")}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
