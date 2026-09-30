/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { SUBJECTS } from "@/lib/learning/system";
import { rememberChild } from "@/lib/learning/entry";
import { coreSubjectThumbnail } from "@/lib/learning/coreThumbnailRegistry";
import {
  journeyHeaderDestinations,
  resolveJourneyHeaderRoute,
  type JourneyHeaderSection
} from "@/lib/learning/journeyHeader";
import { isMuted, setMuted, unlockAudio } from "@/lib/audio/feedback";
import { useLearningProfile } from "./LearningCommon";
import styles from "./Playroom.module.css";

export function SubjectDirectory({ childId }: { childId?: string }) {
  return (
    <div className={styles.subjects} data-core-thumbnail-grid="subjects">
      {SUBJECTS.map((subject) => {
        const thumbnail = coreSubjectThumbnail(subject.id);
        const title = subject.id === "english" ? "Bahasa Inggris" : subject.title;
        return (
          <Link
            key={subject.id}
            className={styles.subject}
            href={childId ? `/child/${childId}/subject/${subject.id}` : `/child/select?continue=1&subject=${subject.id}`}
            data-core-thumbnail-card="subject"
            data-core-thumbnail-id={subject.id}
          >
            {thumbnail ? (
              <Image
                className={styles.subjectThumbnail}
                src={thumbnail}
                alt=""
                width={1200}
                height={900}
                sizes="(max-width: 760px) 50vw, (max-width: 1100px) 33vw, 360px"
                draggable={false}
              />
            ) : null}
            <span className={styles.subjectName}>{title}</span>
          </Link>
        );
      })}
    </div>
  );
}

function fallbackSection(pathname: string): JourneyHeaderSection {
  if (pathname.startsWith("/games")) return "bermain";
  if (pathname.startsWith("/world")) return "world";
  return "belajar";
}

export function PlayroomShell({ childId, children }: { childId?: string; children: ReactNode }) {
  const pathname = usePathname();
  const profile = useLearningProfile(childId ?? "");
  const [muted, updateMuted] = useState(false);
  const navRef = useRef<HTMLDetailsElement>(null);
  const profileRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (childId && profile?.id === childId) rememberChild(childId);
  }, [childId, profile]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => updateMuted(isMuted()));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (navRef.current) navRef.current.open = false;
    if (profileRef.current) profileRef.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const closeAll = () => {
      if (navRef.current) navRef.current.open = false;
      if (profileRef.current) profileRef.current.open = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAll();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (navRef.current?.open && !navRef.current.contains(target)) navRef.current.open = false;
      if (profileRef.current?.open && !profileRef.current.contains(target)) profileRef.current.open = false;
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const base = childId ? `/child/${childId}` : "";
  const immersive =
    pathname.includes("/activity/") ||
    (pathname.includes("/world/") && pathname.includes("/stage/"));

  const routeState = childId
    ? resolveJourneyHeaderRoute({ childId, pathname })
    : { backHref: null, currentSection: fallbackSection(pathname) };

  const destinations = childId
    ? journeyHeaderDestinations(childId)
    : [
        { id: "belajar" as const, label: "Belajar", href: "/" },
        { id: "bermain" as const, label: "Bermain", href: "/games" },
        { id: "world" as const, label: "World", href: "/worlds/money-festival" }
      ];

  return (
    <div className={styles.shell}>
      {!immersive ? (
        <header className={styles.header} data-mainlagi-jm02-header="v1">
          <div className={styles.headerBackSlot}>
            {routeState.backHref ? (
              <Link
                href={routeState.backHref}
                className={styles.headerBack}
                aria-label="Kembali"
                data-mainlagi-header-back
              >
                <span className={styles.headerBackArrow} aria-hidden>←</span>
                <span className={styles.headerBackLabel}>Kembali</span>
              </Link>
            ) : null}
          </div>

          <Link href={base ? `${base}/home` : "/"} className={styles.brand} aria-label="Mainlagi">
            <img src="/artwork/garden-wordmark.webp" alt="" width={600} height={220} />
          </Link>

          <div className={styles.headerActions}>
            <details ref={navRef} className={styles.productNav} data-mainlagi-product-nav>
              <summary aria-label="Buka menu utama">
                <span>Menu</span>
                <span className={styles.summaryChevron} aria-hidden />
              </summary>
              <nav className={styles.productMenu} aria-label="Area Mainlagi">
                {destinations.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    aria-current={routeState.currentSection === item.id ? "page" : undefined}
                    onClick={() => {
                      if (navRef.current) navRef.current.open = false;
                    }}
                  >
                    <strong>{item.label}</strong>
                    <small>
                      {item.id === "belajar"
                        ? "Belajar dan lanjutkan perjalanan"
                        : item.id === "bermain"
                          ? "Main Gerak"
                          : "Petualangan Mainlagi"}
                    </small>
                  </Link>
                ))}
                <span className={styles.productMenuDisabled} aria-disabled="true" data-mainlagi-shop-slot="disabled">
                  <strong>Shop</strong>
                  <small>Belum tersedia di mode anak</small>
                </span>
              </nav>
            </details>

            <details ref={profileRef} className={styles.profile}>
              <summary aria-label="Pengaturan profil">
                <span className={styles.profileIcon}><Icon name="account" size={22} /></span>
                <span className={styles.profileName}>{profile?.name ?? "Profil"}</span>
                <span className={styles.summaryChevron} aria-hidden />
              </summary>
              <div className={styles.menu}>
                <Link href="/child/select">Ganti profil anak</Link>
                {childId ? <Link href={`${base}/rewards`}>Koleksi bintang</Link> : null}
                <button
                  onClick={() => {
                    unlockAudio();
                    setMuted(!muted);
                    updateMuted(!muted);
                  }}
                  aria-pressed={muted}
                >
                  {muted ? "Nyalakan suara" : "Matikan suara"}
                </button>
                <Link href="/parent">Pengaturan orang tua</Link>
                <Link href="/account">Akun keluarga</Link>
              </div>
            </details>
          </div>
        </header>
      ) : null}
      {children}
    </div>
  );
}
