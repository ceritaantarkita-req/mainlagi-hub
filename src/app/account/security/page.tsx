import type { Metadata } from "next";
import { StubPage } from "@/components/StubPage";

export const metadata: Metadata = { title: "Keamanan | Mainlagi Hub" };

export default function SecurityPage() {
  return (
    <div className="fun-home">
      <section className="page-shell fun-section">
        <StubPage
          title="Keamanan"
          description="Ganti kata sandi dan kelola sesi."
          links={[{ href: "/account", label: "Kembali ke akun" }]}
        />
      </section>
    </div>
  );
}
