import { AuthActionForm } from "@/components/features/auth/AuthActionForm";
import { Suspense } from "react";

export default function AuthActionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthActionForm />
    </Suspense>
  );
}
