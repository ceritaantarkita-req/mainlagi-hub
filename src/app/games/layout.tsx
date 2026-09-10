import type { ReactNode } from "react";
import { MobileFoundation, MobileRouteBoundary } from "@/components/learning/mobile/MobilePrimitives";

export default function GamesLayout({ children }: { children: ReactNode }) {
  return (
    <MobileFoundation data-mainlagi-mobile-root="games">
      <MobileRouteBoundary routeKind="game-catalog">
        {children}
      </MobileRouteBoundary>
    </MobileFoundation>
  );
}
