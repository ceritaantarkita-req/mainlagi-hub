"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CHARACTERS,
  DEMO_PROFILE,
  readProfile,
  readProgress,
  type CharacterId,
  type LearningChildProfile,
  type LearningProgress
} from "@/lib/learning/system";
import { readCloudLearningProfile, readCloudLearningProgress } from "@/lib/learning/cloud";
import styles from "./LearningPlatform.module.css";

export function CharacterAvatar({ id, large = false }: { id: CharacterId; large?: boolean }) {
  const className = large ? styles.characterBubbleLarge : styles.characterBubble;

  if (id === "paca") {
    return (
      <span className={className} role="img" aria-label={CHARACTERS[id].name} style={{ background: "#e8f5ff" }}>
        <svg width="74%" height="74%" viewBox="0 0 80 80" aria-hidden>
          <rect x="14" y="18" width="52" height="44" rx="17" fill="#fff" stroke="#4b86d9" strokeWidth="4" />
          <rect x="20" y="24" width="40" height="27" rx="11" fill="#173a5e" />
          <circle cx="32" cy="37" r="4" fill="#6ee7ff" />
          <circle cx="48" cy="37" r="4" fill="#6ee7ff" />
          <path d="M33 44c4 4 10 4 14 0" fill="none" stroke="#6ee7ff" strokeWidth="3" strokeLinecap="round" />
          <path d="M40 18V10" stroke="#4b86d9" strokeWidth="4" strokeLinecap="round" />
          <circle cx="40" cy="8" r="4" fill="#30b4f2" />
          <circle cx="14" cy="37" r="5" fill="#6cb3ff" />
          <circle cx="66" cy="37" r="5" fill="#6cb3ff" />
        </svg>
      </span>
    );
  }

  if (id === "gavi") {
    return (
      <span className={className} role="img" aria-label={CHARACTERS[id].name} style={{ background: "#fff2d7" }}>
        <svg width="76%" height="76%" viewBox="0 0 80 80" aria-hidden>
          <path d="M20 30 16 13l18 11c4-2 8-2 12 0l18-11-4 17c5 6 7 13 7 21 0 14-12 23-27 23S13 65 13 51c0-8 2-15 7-21Z" fill="#f59e0b" />
          <path d="M29 30c4-4 18-4 22 0" fill="#ffc74f" />
          <circle cx="30" cy="43" r="4" fill="#2d2b2a" />
          <circle cx="50" cy="43" r="4" fill="#2d2b2a" />
          <path d="m40 49-5 4h10Z" fill="#c45822" />
          <path d="M40 53c-2 5-8 6-12 3M40 53c2 5 8 6 12 3" fill="none" stroke="#684029" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M23 48H10M23 53H8M57 48h13M57 53h15" stroke="#8a572c" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
    );
  }

  if (id === "naya") {
    return (
      <span className={className} role="img" aria-label={CHARACTERS[id].name} style={{ background: "#ffe5ef" }}>
        <svg width="78%" height="78%" viewBox="0 0 80 80" aria-hidden>
          <path d="M16 59c0-22 7-40 24-40s24 18 24 40Z" fill="#ef6a9e" />
          <circle cx="40" cy="38" r="19" fill="#f5b38d" />
          <path d="M20 38c2-18 9-28 20-28s20 10 20 28c-4-8-10-14-20-14S24 30 20 38Z" fill="#e84b8a" />
          <path d="M25 43c-4 7-5 16-3 25h36c2-9 1-18-3-25-2 12-28 12-30 0Z" fill="#e84b8a" />
          <circle cx="33" cy="38" r="2.5" fill="#3d2c28" />
          <circle cx="47" cy="38" r="2.5" fill="#3d2c28" />
          <path d="M33 48c4 4 10 4 14 0" fill="none" stroke="#9e4b42" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </span>
    );
  }

  const girl = id === "zia";
  return (
    <span className={className} role="img" aria-label={CHARACTERS[id].name} style={{ background: girl ? "#f6e8ff" : "#e8f1ff" }}>
      <svg width="78%" height="78%" viewBox="0 0 80 80" aria-hidden>
        <circle cx="40" cy="39" r="22" fill="#f2b28d" />
        <path d={girl ? "M18 38c1-18 10-27 22-27s21 9 22 27c-7-8-14-11-22-11s-15 3-22 11Z" : "M18 35c3-16 12-24 25-24 11 0 18 7 20 18-8-4-13-6-20-5-10 2-14 8-25 11Z"} fill="#603d2c" />
        {girl ? <><circle cx="18" cy="34" r="7" fill="#6e4633" /><circle cx="62" cy="34" r="7" fill="#6e4633" /></> : null}
        <circle cx="32" cy="40" r="3" fill="#352925" />
        <circle cx="48" cy="40" r="3" fill="#352925" />
        <path d="M33 50c4 4 10 4 14 0" fill="none" stroke="#9e4b42" strokeWidth="2.7" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function CharacterGroup() {
  return (
    <div className={styles.characterCluster} aria-label="Karakter Mainlagi">
      <CharacterAvatar id="naya" />
      <CharacterAvatar id="gian" />
      <CharacterAvatar id="paca" large />
      <CharacterAvatar id="zia" />
      <CharacterAvatar id="gavi" />
    </div>
  );
}

export function useLearningProfile(childId: string) {
  const [profile, setProfile] = useState<LearningChildProfile | null>(childId === DEMO_PROFILE.id ? DEMO_PROFILE : null);
  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const local = readProfile(childId) ?? (childId === DEMO_PROFILE.id ? DEMO_PROFILE : null);
      if (!cancelled) setProfile(local);
      const cloud = await readCloudLearningProfile(childId);
      if (!cancelled && cloud) setProfile(cloud);
    };
    const frame = window.requestAnimationFrame(() => void refresh());
    const onProfiles = () => void refresh();
    window.addEventListener("mainlagi-learning-profiles", onProfiles);
    window.addEventListener("storage", onProfiles);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mainlagi-learning-profiles", onProfiles);
      window.removeEventListener("storage", onProfiles);
    };
  }, [childId]);
  return profile;
}

export function useLearningProgress(childId: string) {
  const [progress, setProgress] = useState<LearningProgress>({ completedActivityIds: [], stars: 0, lastActivityId: null });
  useEffect(() => {
    let cancelled = false;
    const updateLocal = () => {
      if (!cancelled) setProgress(readProgress(childId));
    };
    const updateCloud = async () => {
      const cloud = await readCloudLearningProgress(childId);
      if (!cancelled && cloud) setProgress(cloud);
    };
    const refresh = () => {
      updateLocal();
      void updateCloud();
    };
    const frame = window.requestAnimationFrame(refresh);
    const onCustom = (event: Event) => {
      const detail = (event as CustomEvent<{ childId?: string }>).detail;
      if (!detail?.childId || detail.childId === childId) refresh();
    };
    const onCloud = (event: Event) => {
      const detail = (event as CustomEvent<{ childId?: string }>).detail;
      if (!detail?.childId || detail.childId === childId) void updateCloud();
    };
    window.addEventListener("mainlagi-learning-progress", onCustom);
    window.addEventListener("mainlagi-learning-cloud", onCloud);
    window.addEventListener("storage", refresh);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mainlagi-learning-progress", onCustom);
      window.removeEventListener("mainlagi-learning-cloud", onCloud);
      window.removeEventListener("storage", refresh);
    };
  }, [childId]);
  return progress;
}

export function ChildLoading() {
  return <main className={styles.content}><div className={styles.emptyState}>Menyiapkan ruang belajar...</div></main>;
}

export function ChildShell({ childId, children }: { childId: string; children: ReactNode }) {
  const pathname = usePathname();
  const profile = useLearningProfile(childId);
  const base = `/child/${childId}`;
  const items = [
    { href: `${base}/home`, label: "Home", icon: "🏠" },
    { href: `${base}/learn`, label: "Belajar", icon: "📚" },
    { href: `${base}/games`, label: "Main Gerak", icon: "🎮" },
    { href: `${base}/rewards`, label: "Hadiah", icon: "⭐" }
  ];

  return (
    <div className={styles.childShell}>
      <header className={styles.childHeader}>
        <Link className={styles.brand} href={`${base}/home`}><span className={styles.brandMark}>M</span><span>Mainlagi</span></Link>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link className={styles.parentPill} href="/parent" aria-label="Area orang tua">👨‍👩‍👧</Link>
          <Link className={styles.profilePill} href="/child/select">
            <span>{profile ? CHARACTERS[profile.guide].emoji : "🙂"}</span>
            <span>{profile?.name ?? "Profil"}<small>{profile ? `${profile.age} tahun` : "Pilih anak"}</small></span>
          </Link>
        </div>
      </header>
      {children}
      <nav className={styles.bottomNav} aria-label="Navigasi anak">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return <Link key={item.href} href={item.href} className={`${styles.bottomNavItem} ${active ? styles.bottomNavItemActive : ""}`}><span aria-hidden>{item.icon}</span><span>{item.label}</span></Link>;
        })}
      </nav>
    </div>
  );
}
