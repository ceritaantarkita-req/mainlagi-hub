"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { TopNavbar } from "@/components/nav/TopNavbar";
import { SiteFooter } from "@/components/SiteFooter";

function isImmersivePath(pathname: string): boolean {
  return (
    pathname.startsWith("/play/") ||
    pathname.startsWith("/admin/") ||
    pathname === "/admin" ||
    pathname.startsWith("/child/") ||
    pathname === "/child" ||
    pathname.startsWith("/parent/") ||
    pathname === "/parent" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname.startsWith("/auth/")
  );
}

/**
 * Global app shell.
 *
 * Public/account browsing pages use the canonical global header directly.
 * Child, parent, and family-auth surfaces own their viewport so they can add
 * their own contextual subnavigation while still rendering the same global
 * Mainlagi menu. True gameplay/admin routes remain chrome-controlled by their
 * dedicated owners.
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
  const isPublicHome = pathname === "/";
  return (
    <div className="app-shell">
      <TopNavbar />
      <div className={`app-shell__main ${isPublicHome ? "app-shell__main--home" : ""}`}>{children}</div>
      {isAccount ? <SiteFooter /> : null}
    </div>
  );
}
