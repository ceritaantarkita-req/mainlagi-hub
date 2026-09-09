import type { ReactNode } from "react";
import { WorldChildShell } from "@/components/learning/world/WorldExperience";

export default async function ChildLayout({ children, params }: { children: ReactNode; params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <WorldChildShell childId={childId}>{children}</WorldChildShell>;
}
