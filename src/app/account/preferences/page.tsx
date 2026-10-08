import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Pengaturan keluarga" };

export default function PreferencesPage() {
  redirect("/parent/settings");
}
