"use client";

import Image from "next/image";
import Link from "next/link";
import { UserCircle } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useScrollState } from "@/lib/react/useScrollState";
import { MainlagiLeftDrawer, type MainlagiDrawerItem } from "./MainlagiLeftDrawer";

export function TopNavbar() {
  const pathname = usePathname();
  const scrolled = useScrollState();

  const items: MainlagiDrawerItem[] = [
    {
      label: "Beranda",
      href: "/",
      description: "Kembali ke halaman utama Mainlagi",
      current: pathname === "/"
    },
    {
      label: "Mulai untuk anak",
      href: "/child/select?continue=1",
      description: "Pilih profil dan mulai perjalanan belajar"
    },
    {
      label: "Area orang tua",
      href: "/account",
      description: "Akun keluarga dan pengaturan",
      current: pathname.startsWith("/account")
    },
    {
      label: "Main Gerak",
      href: "/games",
      description: "Permainan gerak dengan kamera",
      current: pathname.startsWith("/games") || pathname.startsWith("/play/")
    },
    {
      label: "Bacaan & ide",
      href: "/discover",
      description: "Artikel dan ide aktivitas keluarga",
      current: pathname.startsWith("/discover")
    },
    {
      label: "Tentang Mainlagi",
      href: "/account/about",
      description: "Kenali Mainlagi lebih dekat",
      current: pathname === "/account/about"
    }
  ];

  return (
    <header
      className={`top-nav ${scrolled ? "top-nav--scrolled" : ""}`}
      data-mainlagi-public-header="v2"
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
        <Link className="top-nav__account" href="/account" aria-label="Buka akun keluarga">
          <UserCircle size={30} weight="regular" aria-hidden />
          <span>Akun</span>
        </Link>
      </div>
    </header>
  );
}
