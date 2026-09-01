import type { Metadata } from "next";
import { DeleteAccount } from "@/components/account/DeleteAccount";

export const metadata: Metadata = { title: "Hapus Akun" };

export default function DeleteAccountPage() {
  return (
    <div className="fun-home">
      <section className="page-shell fun-section account-page">
        <header className="fun-section__head">
          <h2>Hapus akun</h2>
        </header>
        <DeleteAccount />
      </section>
    </div>
  );
}
