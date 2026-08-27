import type { IconName } from "@/components/Icon";

export interface NavItem {
  label: string;
  href: string;
  icon: IconName;
}

/** The five primary destinations. Both navbars derive from this single list. */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Beranda", href: "/", icon: "home" },
  { label: "Game", href: "/games", icon: "games" },
  { label: "Jelajah", href: "/discover", icon: "discover" },
  { label: "Skor", href: "/leaderboards", icon: "leaderboards" },
  { label: "Akun", href: "/account", icon: "account" }
];

export function isActivePath(current: string, href: string): boolean {
  if (href === "/") return current === "/";
  return current === href || current.startsWith(`${href}/`);
}
