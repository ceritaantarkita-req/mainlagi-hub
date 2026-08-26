"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/Icon";
import { isActivePath } from "@/lib/navigation";

/**
 * Mobile bottom navigation.
 *
 * Icon-only on phones. The Discover item is styled as a distinct, raised
 * center button (like a FAB) so it reads as the "explore" action. The shell
 * hides this bar on gameplay routes.
 */
const LEFT: { href: string; icon: IconName; label: string }[] = [
  { href: "/", icon: "home", label: "Beranda" },
  { href: "/games", icon: "games", label: "Game" }
];
const RIGHT: { href: string; icon: IconName; label: string }[] = [
  { href: "/leaderboards", icon: "leaderboards", label: "Skor" },
  { href: "/account", icon: "account", label: "Akun" }
];

function DiscoverMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.5 8.5 13 13l-4.5 2.5L11 11z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Item({
  href,
  icon,
  label,
  pathname
}: {
  href: string;
  icon: IconName;
  label: string;
  pathname: string;
}) {
  const active = isActivePath(pathname, href);
  return (
    <Link
      href={href}
      className={`bottom-nav__item ${active ? "is-active" : ""}`}
      aria-label={label}
      aria-current={active ? "page" : undefined}
    >
      <Icon name={icon} size={24} strokeWidth={active ? 2.1 : 1.8} />
      <span>{label}</span>
    </Link>
  );
}

export function BottomNavbar() {
  const pathname = usePathname();
  const discoverActive = isActivePath(pathname, "/discover");

  return (
    <nav className="bottom-nav" aria-label="Navigasi bawah">
      {LEFT.map((item) => (
        <Item key={item.href} {...item} pathname={pathname} />
      ))}

      <Link
        href="/discover"
        className={`bottom-nav__discover ${discoverActive ? "is-active" : ""}`}
        aria-label="Jelajah"
        aria-current={discoverActive ? "page" : undefined}
      >
        <DiscoverMark />
        <span>Jelajah</span>
      </Link>

      {RIGHT.map((item) => (
        <Item key={item.href} {...item} pathname={pathname} />
      ))}
    </nav>
  );
}
