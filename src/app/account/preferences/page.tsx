import type { Metadata } from "next";
import { Preferences } from "@/components/account/Preferences";
import { AccountSectionShell } from "@/components/account/AccountSectionShell";

export const metadata: Metadata = { title: "Preferensi" };

export default function PreferencesPage() {
  return (
    <AccountSectionShell title="Preferensi">
      <Preferences />
    </AccountSectionShell>
  );
}
