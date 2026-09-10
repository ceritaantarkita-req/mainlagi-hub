import type { ReactNode } from "react";
import { MobileFoundation, MobileRouteBoundary } from "@/components/learning/mobile/MobilePrimitives";

export default function PlayLayout({ children }: { children: ReactNode }) {
  return (
    <MobileFoundation data-mainlagi-mobile-root="play">
      <MobileRouteBoundary routeKind="game-play">
        {children}
      </MobileRouteBoundary>
    </MobileFoundation>
  );
}
