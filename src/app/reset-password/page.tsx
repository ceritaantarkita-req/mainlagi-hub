import type { Metadata } from "next";
import { AuthFamilyShell } from "@/components/auth/AuthFamilyShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Atur ulang kata sandi" };

export default function ResetPasswordPage() {
  return (
    <AuthFamilyShell>
      <ResetPasswordForm />
    </AuthFamilyShell>
  );
}
