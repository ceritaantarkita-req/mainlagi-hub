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
    pathname === "/admin"
  );
}

/**
 * App shell.
 *
 * Owns the global navigation surface. On immersive routes (gameplay, admin)
 * the chrome is dropped entirely so the feature owns the viewport. Every other
 * page gets the desktop top navbar and the mobile bottom navbar.
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
