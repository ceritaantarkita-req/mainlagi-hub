import { redirect } from "next/navigation";
import { requireParentSession } from "@/lib/auth/requireParent";

export const dynamic = "force-dynamic";

export default async function ShopParentEntryPage() {
  const gate = await requireParentSession();
  if (gate.mode === "denied") {
    redirect("/login?next=%2Fshop");
  }
  redirect("/shop");
}
