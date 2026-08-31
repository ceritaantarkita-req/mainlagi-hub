import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";
import { AffiliateAdminPanel } from "@/components/admin/AffiliateAdminPanel";
import { requireOwner } from "@/lib/auth/requireOwner";

export const metadata: Metadata = { title: "Admin Afiliasi | Mainlagi Hub" };

export const dynamic = "force-dynamic";

export default async function AffiliateAdminPage() {
  const gate = await requireOwner();
  if (!gate.ok) return <AdminGate title="Affiliate Admin" reason={gate.reason} />;

  return <AffiliateAdminPanel ownerEmail={gate.email ?? ""} />;
}
