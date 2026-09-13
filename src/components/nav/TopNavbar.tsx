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
        <Image src="/artwork/garden-wordmark.webp" alt="Mainlagi" width={150} height={55} className="garden-wordmark" priority />
      </Link>
      <nav className="top-nav__menu" aria-label="Navigasi utama">
        {PRIMARY_NAV.map((item) => <Link key={item.href} href={item.href} className={isActivePath(pathname, item.href) ? "is-active" : ""}>{item.label}</Link>)}
      </nav>
    </header>
  );
}
