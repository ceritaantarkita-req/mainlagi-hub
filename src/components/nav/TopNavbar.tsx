"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useScrollState } from "@/lib/react/useScrollState";
import { isActivePath, PRIMARY_NAV } from "@/lib/navigation";

export function TopNavbar() {
  const pathname = usePathname();
  const scrolled = useScrollState();

  return (
    <header className={`top-nav ${scrolled ? "top-nav--scrolled" : ""}`}>
      <Link className="top-nav__brand" href="/" aria-label="Mainlagi beranda">
        <Image src="/brand/mainlagi-square.png" alt="" width={38} height={38} className="top-nav__logo" priority />
        <span><strong>Mainlagi</strong><small>Belajar & Main</small></span>
      </Link>
      <nav className="top-nav__menu" aria-label="Navigasi utama">
        {PRIMARY_NAV.map((item) => <Link key={item.href} href={item.href} className={isActivePath(pathname, item.href) ? "is-active" : ""}>{item.label}</Link>)}
      </nav>
    </header>
  );
}
