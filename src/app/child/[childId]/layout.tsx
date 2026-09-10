import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { LearningAttemptBridge } from "@/components/learning/LearningAttemptBridge";
import { LearningProgressionGuard } from "@/components/learning/LearningProgressionGuard";
import { MobileFoundation, MobileRouteBoundary } from "@/components/learning/mobile/MobilePrimitives";
import { WorldChildShell } from "@/components/learning/world/WorldExperience";
import { learningChildCanAccess } from "@/lib/auth/requireParent";

export default async function ChildLayout({ children, params }: { children: ReactNode; params: Promise<{ childId: string }> }) {
  const { childId } = await params;
  if (!await learningChildCanAccess(childId)) notFound();
  return (
    <>
      <LearningAttemptBridge childId={childId} />
      <LearningProgressionGuard childId={childId} />
      <MobileFoundation data-mainlagi-mobile-root="child">
        <MobileRouteBoundary routeKind="child-learning">
          <WorldChildShell childId={childId}>{children}</WorldChildShell>
        </MobileRouteBoundary>
      </MobileFoundation>
    </>
  );
}
