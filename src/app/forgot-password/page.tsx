import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Lupa kata sandi | Mainlagi Hub" };

export default function ForgotPasswordPage() {
  return (
    <main className="center-page">
      <section className="dialog-card">
        <AuthForm mode="forgot" />
      </section>
    </main>
  );
}
