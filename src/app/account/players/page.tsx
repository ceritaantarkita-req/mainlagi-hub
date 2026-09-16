import type { Metadata } from "next";
import { PlayerProfiles } from "@/components/account/PlayerProfiles";
import { AccountSectionShell } from "@/components/account/AccountSectionShell";

export const metadata: Metadata = { title: "Pemain" };

export default function PlayersPage() {
  return (
    <AccountSectionShell title="Pemain">
      <PlayerProfiles />
    </AccountSectionShell>
  );
}
