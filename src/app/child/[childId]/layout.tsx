import type { ReactNode } from "react";
import { ChildShell } from "@/components/learning/LearningPlatform";

export default async function ChildLayout({ children, params }: { children: ReactNode; params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return <ChildShell childId={childId}>{children}</ChildShell>;
}
