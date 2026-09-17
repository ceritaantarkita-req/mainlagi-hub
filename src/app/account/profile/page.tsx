import type { Metadata } from "next";
import { ProfileEditor } from "@/components/account/ProfileEditor";
import { AccountSectionShell } from "@/components/account/AccountSectionShell";

export const metadata: Metadata = { title: "Profil" };

export default function ProfilePage() {
  return (
    <AccountSectionShell title="Profil">
      <ProfileEditor />
    </AccountSectionShell>
  );
}
