import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthFamilyShell } from "@/components/auth/AuthFamilyShell";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  return (
    <AuthFamilyShell>
      <AuthForm mode="login" />
    </AuthFamilyShell>
  );
}
