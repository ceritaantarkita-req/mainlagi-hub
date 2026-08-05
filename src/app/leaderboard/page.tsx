import type { Metadata } from "next";
import { LeaderboardView } from "@/components/LeaderboardView";

export const metadata: Metadata = {
  title: "Papan Skor",
  description: "Skor terbaik dari setiap permainan, tersimpan di perangkat ini."
};

export default function LeaderboardPage() {
  return <LeaderboardView />;
}
