import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Buat akun" };

export default function SignupPage() {
  return (
    <main className="center-page">
      <section className="dialog-card">
        <AuthForm mode="signup" />
      </section>
    </main>
  );
}
