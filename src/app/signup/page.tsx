import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthFamilyShell } from "@/components/auth/AuthFamilyShell";

export const metadata: Metadata = { title: "Buat akun" };

export default function SignupPage() {
  return (
    <AuthFamilyShell>
      <AuthForm mode="signup" />
    </AuthFamilyShell>
  );
}
