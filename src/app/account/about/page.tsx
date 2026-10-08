import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Tentang Mainlagi" };

export default function AccountAboutPage() {
  redirect("/about");
}
