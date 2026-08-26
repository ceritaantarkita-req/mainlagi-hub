import type { IconName } from "@/components/Icon";

export interface NavItem {
  label: string;
  href: string;
  icon: IconName;
}

/** The five primary destinations. Both navbars derive from this single list. */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Games", href: "/games", icon: "games" },
  { label: "Discover", href: "/discover", icon: "discover" },
  { label: "Leaderboards", href: "/leaderboards", icon: "leaderboards" },
  { label: "Account", href: "/account", icon: "account" }
];

export function isActivePath(current: string, href: string): boolean {
  if (href === "/") return current === "/";
  return current === href || current.startsWith(`${href}/`);
}
