import type { Metadata } from "next";
import { DeleteAccount } from "@/components/account/DeleteAccount";
import { AccountSectionShell } from "@/components/account/AccountSectionShell";

export const metadata: Metadata = { title: "Hapus Akun" };

export default function DeleteAccountPage() {
  return (
    <AccountSectionShell title="Hapus akun">
      <DeleteAccount />
    </AccountSectionShell>
  );
}
