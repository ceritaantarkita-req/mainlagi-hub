import type { ReactNode } from "react";
import { LearningAttemptBridge } from "@/components/learning/LearningAttemptBridge";
import { WorldChildShell } from "@/components/learning/world/WorldExperience";

export default async function ChildLayout({ children, params }: { children: ReactNode; params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  return (
    <>
      <LearningAttemptBridge childId={childId} />
      <WorldChildShell childId={childId}>{children}</WorldChildShell>
    </>
  );
}
