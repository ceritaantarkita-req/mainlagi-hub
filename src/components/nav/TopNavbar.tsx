"use client";

import Image from "next/image";
import Link from "next/link";
import { UserCircle } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useScrollState } from "@/lib/react/useScrollState";
import { getCurrentUser } from "@/lib/auth/supabase-auth";
import { buildMainlagiGlobalMenu } from "@/lib/navigation/mainlagiGlobal";
import { MainlagiLeftDrawer } from "./MainlagiLeftDrawer";

export function TopNavbar() {
  const pathname = usePathname();
  const scrolled = useScrollState();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    let active = true;
    void getCurrentUser().then((nextUser) => {
      if (active) setUser(nextUser);
    });
    return () => {
      active = false;
    };
  }, []);

  const items = buildMainlagiGlobalMenu({ pathname });
  const identityLabel = user?.name?.trim() || (user ? user.email : "Masuk");
  const identityHref = user ? "/parent" : `/login?next=${encodeURIComponent(pathname || "/parent")}`;

  return (
    <header
      className={`top-nav ${scrolled ? "top-nav--scrolled" : ""}`}
      data-mainlagi-public-header="v3"
      data-mainlagi-global-header
    >
      <div className="top-nav__left">
        <MainlagiLeftDrawer items={items} ariaLabel="Menu utama Mainlagi" />
      </div>

      <Link className="top-nav__brand" href="/" aria-label="Mainlagi beranda">
        <Image
          src="/artwork/garden-wordmark.webp"
          alt="Mainlagi"
          width={150}
          height={55}
          className="garden-wordmark"
          priority
        />
      </Link>

      <div className="top-nav__right">
        <Link className="top-nav__account" href={identityHref} aria-label={user ? "Buka area orang tua" : "Masuk ke Mainlagi"}>
          <UserCircle size={30} weight="regular" aria-hidden />
          <span>{identityLabel}</span>
        </Link>
      </div>
    </header>
  );
}
