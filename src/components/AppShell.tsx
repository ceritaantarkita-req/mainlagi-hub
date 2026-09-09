"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { TopNavbar } from "@/components/nav/TopNavbar";
import { BottomNavbar } from "@/components/nav/BottomNavbar";
import { SiteFooter } from "@/components/SiteFooter";

function isImmersivePath(pathname: string): boolean {
  return (
    pathname.startsWith("/play/") ||
    pathname.startsWith("/admin/") ||
    pathname === "/admin" ||
    pathname.startsWith("/child/") ||
    pathname === "/child" ||
    pathname.startsWith("/parent/") ||
    pathname === "/parent"
  );
}

/**
 * Global app shell.
 *
 * Public/legacy pages keep the existing site navigation. Gameplay, admin,
 * child learning, and parent surfaces own their viewport and therefore drop
 * the public navigation entirely.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const immersive = isImmersivePath(pathname);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.immersive = immersive ? "true" : "false";
  }, [immersive]);

  if (immersive) return <>{children}</>;

  const isAccount = pathname.startsWith("/account");
  return (
    <div className="app-shell">
      <TopNavbar />
      <div className="app-shell__main">{children}</div>
      {isAccount ? <SiteFooter /> : null}
      <BottomNavbar />
    </div>
  );
}
