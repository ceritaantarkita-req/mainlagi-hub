"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/Icon";
import { isActivePath } from "@/lib/navigation";

const LEFT: { href: string; icon: IconName; label: string }[] = [
  { href: "/", icon: "home", label: "Beranda" },
  { href: "/games", icon: "games", label: "Main Gerak" }
];
const RIGHT: { href: string; icon: IconName; label: string }[] = [
  { href: "/leaderboards", icon: "leaderboards", label: "Skor game" },
  { href: "/account", icon: "account", label: "Akun" }
];

function LearnMark() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 5.5c3.2-.8 5.8-.2 8 1.5v12c-2.2-1.7-4.8-2.3-8-1.5z" />
      <path d="M20 5.5c-3.2-.8-5.8-.2-8 1.5v12c2.2-1.7 4.8-2.3 8-1.5z" />
      <path d="M9.5 11.5 11 13l3.4-3.5" />
    </svg>
  );
}

function Item({ href, icon, label, pathname }: { href: string; icon: IconName; label: string; pathname: string }) {
  const active = isActivePath(pathname, href);
  return <Link href={href} className={`bottom-nav__item ${active ? "is-active" : ""}`} aria-label={label} aria-current={active ? "page" : undefined}><span className="bottom-nav__item-mark" aria-hidden><Icon name={icon} size={23} strokeWidth={active ? 2.2 : 1.8} /></span></Link>;
}

export function BottomNavbar() {
  const pathname = usePathname();
  const learnActive = pathname.startsWith("/child");
  return (
    <nav className="bottom-nav" aria-label="Navigasi bawah">
      {LEFT.map((item) => <Item key={item.href} {...item} pathname={pathname} />)}
      <Link href="/child/select" className={`bottom-nav__discover ${learnActive ? "is-active" : ""}`} aria-label="Belajar" aria-current={learnActive ? "page" : undefined}><LearnMark /></Link>
      {RIGHT.map((item) => <Item key={item.href} {...item} pathname={pathname} />)}
    </nav>
  );
}
