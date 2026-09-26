"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth/supabase-auth";
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
import { approvedCharacterRuntimeAsset } from "@/lib/learning/characterAssets";
import styles from "./LearningPlatform.module.css";

const EMPTY_LEARNING_PROGRESS: LearningProgress = { completedActivityIds: [], stars: 0, lastActivityId: null };

export function CharacterAvatar({ id, large = false }: { id: CharacterId; large?: boolean }) {
  const className = large ? styles.characterBubbleLarge : styles.characterBubble;
  const asset = approvedCharacterRuntimeAsset(id, "hero");
  const backgroundById: Readonly<Record<CharacterId, string>> = {
    naya: "#ffe5ef",
    gian: "#e8f1ff",
    zia: "#f6e8ff",
    paca: "#def1e8",
    gavi: "#ffead1"
  };

  return (
    <span
      className={className}
      role="img"
      aria-label={CHARACTERS[id].name}
      style={{ background: backgroundById[id] }}
      data-character-avatar-id={id}
      data-character-avatar-state="hero"
      data-character-avatar-source={asset?.source ?? "fallback"}
    >
      {asset ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset.src}
          alt=""
          width={100}
          height={120}
          style={{ width: "88%", height: "88%", objectFit: "contain" }}
        />
      ) : (
        <span aria-hidden>{CHARACTERS[id].name.charAt(0)}</span>
      )}
    </span>
  );
}

export function ProfileIdentityBadge({ profile, large = false }: { profile: LearningChildProfile; large?: boolean }) {
  const initial = profile.name.trim().charAt(0).toLocaleUpperCase("id-ID") || "•";
  return (
    <span
      className={`${styles.profileIdentityBadge} ${large ? styles.profileIdentityBadgeLarge : ""}`}
      data-mainlagi-profile-identity
      aria-label={`Profil ${profile.name}`}
      title={`Profil ${profile.name}`}
    >
      {initial}
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
      if (!childId) return;
      const userId = await getCurrentUserId();
      if (cancelled) return;
      if (!userId) {
        setProfile(readProfile(childId) ?? (childId === DEMO_PROFILE.id ? DEMO_PROFILE : null));
        return;
      }
      if (childId === DEMO_PROFILE.id) {
        setProfile(DEMO_PROFILE);
        return;
      }
      const cloud = await readCloudLearningProfile(childId);
      if (!cancelled) setProfile(cloud);
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

interface LearningProgressState {
  childId: string;
  progress: LearningProgress;
  ready: boolean;
}

export function useLearningProgressState(childId: string): { progress: LearningProgress; ready: boolean } {
  const [state, setState] = useState<LearningProgressState>(() => ({
    childId,
    progress: EMPTY_LEARNING_PROGRESS,
    ready: false
  }));

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const userId = await getCurrentUserId();
      if (cancelled) return;
      if (!userId) {
        setState({ childId, progress: readProgress(childId), ready: true });
        return;
      }
      const cloud = await readCloudLearningProgress(childId);
      if (!cancelled) setState({ childId, progress: cloud ?? EMPTY_LEARNING_PROGRESS, ready: true });
    };
    const frame = window.requestAnimationFrame(() => void refresh());
    const onCustom = (event: Event) => {
      const detail = (event as CustomEvent<{ childId?: string }>).detail;
      if (!detail?.childId || detail.childId === childId) void refresh();
    };
    window.addEventListener("mainlagi-learning-progress", onCustom);
    window.addEventListener("mainlagi-learning-cloud", onCustom);
    window.addEventListener("storage", onCustom);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mainlagi-learning-progress", onCustom);
      window.removeEventListener("mainlagi-learning-cloud", onCustom);
      window.removeEventListener("storage", onCustom);
    };
  }, [childId]);

  if (state.childId !== childId) return { progress: EMPTY_LEARNING_PROGRESS, ready: false };
  return { progress: state.progress, ready: state.ready };
}

export function useLearningProgress(childId: string) {
  return useLearningProgressState(childId).progress;
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
