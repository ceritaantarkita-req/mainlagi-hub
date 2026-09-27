import type { IconName } from "@/components/Icon";

export interface NavItem {
  label: string;
  href: string;
  icon: IconName;
}

/** Public-site destinations. Child and parent modes use their own dedicated shells. */
export const PRIMARY_NAV: NavItem[] = [
  { label: "Beranda", href: "/", icon: "home" },
  { label: "Main Gerak", href: "/games", icon: "games" },
  { label: "Bacaan & ide", href: "/discover", icon: "discover" },
  { label: "Shop", href: "/shop", icon: "tag" },
  { label: "Akun", href: "/account", icon: "account" }
];

export function isActivePath(current: string, href: string): boolean {
  if (href === "/") return current === "/";
  return current === href || current.startsWith(`${href}/`);
}
