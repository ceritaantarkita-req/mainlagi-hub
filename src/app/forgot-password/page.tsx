import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthFamilyShell } from "@/components/auth/AuthFamilyShell";

export const metadata: Metadata = { title: "Lupa kata sandi" };

export default function ForgotPasswordPage() {
  return (
    <AuthFamilyShell>
      <AuthForm mode="forgot" />
    </AuthFamilyShell>
  );
}
