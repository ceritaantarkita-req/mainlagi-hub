import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Atur ulang kata sandi" };

export default function ResetPasswordPage() {
  return (
    <main className="center-page">
      <section className="dialog-card">
        <ResetPasswordForm />
      </section>
    </main>
  );
}
