import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Profil anak" };

export default function PlayersPage() {
  redirect("/parent/children");
}
