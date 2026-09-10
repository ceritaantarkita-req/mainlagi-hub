import { ChildSelectScreen } from "@/components/learning/LearningPlatform";
import { MobileFoundation, MobileRouteBoundary } from "@/components/learning/mobile/MobilePrimitives";

export default function ChildSelectPage() {
  return (
    <MobileFoundation data-mainlagi-mobile-root="child-select">
      <MobileRouteBoundary routeKind="child-select">
        <ChildSelectScreen />
      </MobileRouteBoundary>
    </MobileFoundation>
  );
}
