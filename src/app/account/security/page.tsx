import type { Metadata } from "next";
import { AccountSectionShell } from "@/components/account/AccountSectionShell";

export const metadata: Metadata = { title: "Keamanan" };

export default function SecurityPage() {
  return (
    <AccountSectionShell
      title="Keamanan"
      description="Ganti kata sandi dan kelola sesi."
    />
  );
}
