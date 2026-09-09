import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { ParentShell } from "@/components/learning/LearningPlatform";
import { requireParentSession } from "@/lib/auth/requireParent";

export default async function ParentLayout({ children }: { children: ReactNode }) {
  const gate = await requireParentSession();
  if (gate.mode === "denied") redirect("/login");
  return <ParentShell>{children}</ParentShell>;
}
