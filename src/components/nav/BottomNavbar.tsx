"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, GameController, Books, Trophy, UserCircle } from "@phosphor-icons/react";
import { isActivePath, PRIMARY_NAV } from "@/lib/navigation";

const icons={home:House,games:GameController,discover:Books,leaderboards:Trophy,account:UserCircle};

/** Same destinations on desktop and phone; every icon has a visible label. */
export function BottomNavbar() {
  const pathname=usePathname();
  return <nav className="bottom-nav" aria-label="Navigasi bawah">
    {PRIMARY_NAV.map(item=>{
      const active=isActivePath(pathname,item.href);
      const NavIcon=icons[item.icon as keyof typeof icons] ?? House;
      return <Link key={item.href} href={item.href} className={`bottom-nav__item ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined}>
        <NavIcon size={24} weight={active ? "fill" : "regular"} aria-hidden/>
        <span className="bottom-nav__label">{item.label}</span>
      </Link>;
    })}
  </nav>;
}
