import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Masuk" };

export default function LoginPage() {
  return (
    <main className="center-page">
      <section className="dialog-card">
        <AuthForm mode="login" />
      </section>
    </main>
  );
}
