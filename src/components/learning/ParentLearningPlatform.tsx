"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  ACTIVITIES,
  CHARACTERS,
  DEMO_PROFILE,
  SUBJECTS,
  getActivity,
  readPreferences,
  readProfiles,
  savePreferences,
  type LearningActivity,
  type LearningChildProfile,
  type LearningPreferences
} from "@/lib/learning/system";
import { CharacterAvatar, useLearningProfile, useLearningProgress } from "./LearningCommon";
import styles from "./LearningPlatform.module.css";

const DEFAULT_PREFS: LearningPreferences = { allowMotionRecommendations: false, allowAiFeatures: false, reducedMotion: false, language: "id" };
const PARENT_NAV = [
  { href: "/parent", label: "Overview", icon: "🏠" },
  { href: "/parent/children", label: "Anak", icon: "👧" },
  { href: "/parent/privacy", label: "Privacy & AI", icon: "🛡️" },
  { href: "/parent/plan", label: "Plan", icon: "✨" },
  { href: "/parent/settings", label: "Settings", icon: "⚙️" }
];

export function ParentShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <div className={styles.parentSurface}><div className={styles.parentLayout}><aside className={styles.parentSidebar}><Link className={styles.parentBrand} href="/"><span className={styles.brandMark}>M</span><span>Mainlagi Parent</span></Link>{PARENT_NAV.map((item) => { const active = item.href === "/parent" ? pathname === "/parent" : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} className={`${styles.parentNavItem} ${active ? styles.parentNavItemActive : ""}`}><span>{item.icon}</span><span>{item.label}</span></Link>; })}<Link href="/child/select" className={styles.parentNavItem}><span>🧸</span><span>Mode anak</span></Link></aside><div>{children}</div></div></div>;
}

function useAllProfiles() {
  const [profiles, setProfiles] = useState<LearningChildProfile[]>([DEMO_PROFILE]);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setProfiles([DEMO_PROFILE, ...readProfiles().filter((item) => item.id !== DEMO_PROFILE.id)]));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  return profiles;
}

function usePreferences() {
  const [prefs, setPrefs] = useState<LearningPreferences>(DEFAULT_PREFS);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setPrefs(readPreferences()));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const persist = (next: LearningPreferences) => { setPrefs(next); savePreferences(next); };
  return [prefs, persist] as const;
}

export function ParentOverviewScreen() {
  const profiles = useAllProfiles();
  return <main className={styles.parentMain}><p className={styles.eyebrow}>Area orang tua</p><h1 className={styles.pageTitle}>Ringkasan belajar</h1><p className={styles.pageLead}>UI parent dipisahkan dari mode anak. Data prototype masih tersimpan lokal dan belum menjadi diagnosis atau mastery otomatis.</p><section className={styles.section}><div className={styles.parentGrid}>{profiles.map((profile) => <ParentProfileCard profile={profile} key={profile.id} />)}</div></section><section className={styles.section}><div className={styles.infoBanner}><strong>Parent gate belum final.</strong> Shell-nya sudah terpisah, tetapi PIN/auth production harus dihubungkan sebelum area ini dianggap aman untuk rilis anak.</div></section></main>;
}

function ParentProfileCard({ profile }: { profile: LearningChildProfile }) {
  const progress = useLearningProgress(profile.id);
  return <Link href={`/parent/children/${profile.id}`} className={styles.parentCard} style={{ textDecoration: "none", color: "inherit" }}><div style={{ display: "flex", gap: 12, alignItems: "center" }}><CharacterAvatar id={profile.guide} /><div><strong style={{ color: "#24445e" }}>{profile.name}</strong><p>{profile.age} tahun · {progress.completedActivityIds.length} aktivitas · ⭐ {progress.stars}</p></div></div></Link>;
}

export function ParentChildrenScreen() {
  const profiles = useAllProfiles();
  return <main className={styles.parentMain}><p className={styles.eyebrow}>Profiles</p><h1 className={styles.pageTitle}>Anak</h1><p className={styles.pageLead}>Setiap anak punya konteks belajar sendiri. Cloud child-profile belum diaktifkan di wave UI ini.</p><section className={styles.section}><div className={styles.parentGrid}>{profiles.map((profile) => <ParentProfileCard profile={profile} key={profile.id} />)}</div></section><div className={styles.heroActionRow}><Link className={styles.primaryButton} href="/child/select">Tambah / pilih profil</Link></div></main>;
}

function ParentChildHeader({ childId }: { childId: string }) {
  const profile = useLearningProfile(childId);
  if (!profile) return <div className={styles.emptyState}>Profil anak tidak ditemukan.</div>;
  return <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}><CharacterAvatar id={profile.guide} large /><div><p className={styles.eyebrow}>Profil anak</p><h1 className={styles.pageTitle}>{profile.name}</h1><p className={styles.pageLead}>{profile.age} tahun · Guide {CHARACTERS[profile.guide].name}</p></div></div>;
}

export function ParentChildScreen({ childId }: { childId: string }) {
  const progress = useLearningProgress(childId);
  return <main className={styles.parentMain}><ParentChildHeader childId={childId} /><div className={`${styles.parentGrid} ${styles.parentGridThree}`}><Link className={styles.parentCard} href={`/parent/children/${childId}/progress`} style={{ textDecoration: "none", color: "inherit" }}><strong>📈 Progress</strong><p>{progress.completedActivityIds.length} aktivitas selesai · ⭐ {progress.stars}</p></Link><Link className={styles.parentCard} href={`/parent/children/${childId}/reports`} style={{ textDecoration: "none", color: "inherit" }}><strong>📝 Report</strong><p>Ringkasan learning event yang dapat dijelaskan.</p></Link><Link className={styles.parentCard} href={`/parent/children/${childId}/certificates`} style={{ textDecoration: "none", color: "inherit" }}><strong>🏅 Certificate</strong><p>Kriteria masih keputusan produk terbuka.</p></Link></div><div className={styles.heroActionRow}><Link className={styles.secondaryButton} href={`/child/${childId}/home`}>Buka mode anak</Link></div></main>;
}

export function ParentProgressScreen({ childId }: { childId: string }) {
  const progress = useLearningProgress(childId);
  return <main className={styles.parentMain}><ParentChildHeader childId={childId} /><h2 style={{ color: "#24445e" }}>Progress per area</h2><div className={styles.parentGrid}>{SUBJECTS.map((subject) => { const all = ACTIVITIES.filter((activity) => activity.subjectId === subject.id); const done = all.filter((activity) => progress.completedActivityIds.includes(activity.id)).length; const pct = all.length ? Math.round((done / all.length) * 100) : 0; return <div className={styles.parentCard} key={subject.id} style={{ "--accent": subject.accent } as CSSProperties}><strong>{subject.emoji} {subject.title}</strong><p>{done} dari {all.length} aktivitas contoh selesai</p><div className={styles.stageProgress}><span className={styles.progressTrack}><span className={styles.progressFill} style={{ width: `${pct}%` }} /></span><span>{pct}%</span></div></div>; })}</div><section className={styles.section}><div className={styles.infoBanner}>Persentase adalah completion prototype, <strong>bukan mastery akademik</strong>.</div></section></main>;
}

export function ParentReportsScreen({ childId }: { childId: string }) {
  const progress = useLearningProgress(childId);
  const completed = progress.completedActivityIds.map((id) => getActivity(id)).filter((item): item is LearningActivity => Boolean(item));
  return <main className={styles.parentMain}><ParentChildHeader childId={childId} /><h2 style={{ color: "#24445e" }}>Report yang bisa dijelaskan</h2><div className={styles.parentCard}><ul className={styles.list}><li className={styles.listItem}><span>Aktivitas selesai</span><strong>{completed.length}</strong></li><li className={styles.listItem}><span>Bintang terkumpul</span><strong>{progress.stars}</strong></li><li className={styles.listItem}><span>Touch/audio/trace/warna</span><strong>{completed.filter((item) => item.runtime !== "motion_game").length}</strong></li><li className={styles.listItem}><span>Motion</span><strong>{completed.filter((item) => item.runtime === "motion_game").length}</strong></li></ul></div><section className={styles.section}><div className={styles.infoBanner}><strong>Tidak ada judgment AI.</strong> “Kuat/lemah/mastered” belum ditampilkan sampai evidence rule kurikulum disetujui.</div></section></main>;
}

export function ParentCertificatesScreen({ childId }: { childId: string }) {
  return <main className={styles.parentMain}><ParentChildHeader childId={childId} /><div className={styles.certificatePlaceholder}><div><div style={{ fontSize: 60 }}>🏅</div><h2 style={{ color: "#24445e" }}>Certificate system siap sebagai slot UI</h2><p>Kriteria certificate belum diputuskan; prototype sengaja tidak mengarang syarat kelulusan.</p></div></div></main>;
}

export function ParentPrivacyScreen() {
  const [prefs, persist] = usePreferences();
  const update = (patch: Partial<LearningPreferences>) => persist({ ...prefs, ...patch });
  return <main className={styles.parentMain}><p className={styles.eyebrow}>Kontrol orang tua</p><h1 className={styles.pageTitle}>Privacy & AI</h1><p className={styles.pageLead}>Motion dan AI bukan syarat belajar. Default prototype: rekomendasi motion OFF, AI OFF.</p><section className={styles.section}><div className={styles.parentCard}><Toggle title="Rekomendasikan aktivitas gerak" description="Jika OFF, Main Gerak tetap bisa dibuka manual." value={prefs.allowMotionRecommendations} onToggle={() => update({ allowMotionRecommendations: !prefs.allowMotionRecommendations })} /><Toggle title="Izinkan fitur AI/OCR online" description="Preference UI saja. Runtime OpenRouter belum diaktifkan di wave ini." value={prefs.allowAiFeatures} onToggle={() => update({ allowAiFeatures: !prefs.allowAiFeatures })} /><Toggle title="Kurangi animasi" description="Untuk anak yang lebih nyaman dengan UI tenang." value={prefs.reducedMotion} onToggle={() => update({ reducedMotion: !prefs.reducedMotion })} /></div></section><section className={styles.section}><div className={styles.infoBanner}><strong>Camera distinction:</strong> motion = inferensi lokal real-time; OCR kelak = capture singkat area jawaban. Jangan kirim continuous child camera stream ke OpenRouter.</div></section></main>;
}

function Toggle({ title, description, value, onToggle }: { title: string; description: string; value: boolean; onToggle: () => void }) {
  return <div className={styles.toggleRow}><div className={styles.toggleText}><strong>{title}</strong><small>{description}</small></div><button type="button" aria-pressed={value} aria-label={title} className={`${styles.switch} ${value ? styles.switchOn : ""}`} onClick={onToggle} /></div>;
}

export function ParentPlanScreen() {
  return <main className={styles.parentMain}><p className={styles.eyebrow}>Open source + paid</p><h1 className={styles.pageTitle}>Plan</h1><div className={styles.parentGrid} style={{ marginTop: 24 }}><div className={styles.parentCard}><span className={styles.tag}>Current direction</span><h2 style={{ color: "#24445e" }}>Community / Core</h2><p>Core app, activity framework, selected example content, dan motion runtime dapat hidup di open-source codebase sesuai lisensi repo.</p></div><div className={styles.parentCard}><span className={styles.tag}>Planned</span><h2 style={{ color: "#24445e" }}>Mainlagi Premium</h2><p>Premium curriculum/audio, hosted cloud, advanced reports, school capabilities, managed AI, dan support dapat menjadi commercial offering.</p></div></div><section className={styles.section}><div className={styles.infoBanner}>Harga, entitlement, dan paywall <strong>belum</strong> diimplementasikan karena belum ada keputusan produk final.</div></section></main>;
}

export function ParentSettingsScreen() {
  const [prefs, persist] = usePreferences();
  const setLanguage = (language: "id" | "en") => persist({ ...prefs, language });
  return <main className={styles.parentMain}><p className={styles.eyebrow}>Preferences</p><h1 className={styles.pageTitle}>Settings</h1><section className={styles.formCard}><span className={styles.formLabel}>Bahasa antarmuka prototype</span><div className={styles.choiceRow}><button type="button" className={`${styles.choicePill} ${prefs.language === "id" ? styles.choicePillActive : ""}`} onClick={() => setLanguage("id")}>Bahasa Indonesia</button><button type="button" className={`${styles.choicePill} ${prefs.language === "en" ? styles.choicePillActive : ""}`} onClick={() => setLanguage("en")}>English</button></div><p style={{ color: "#71879a", fontSize: 13, lineHeight: 1.6 }}>Preference tersimpan lokal. Full localization seluruh string belum diklaim selesai.</p></section><section className={styles.section}><div className={styles.infoBanner}>OpenRouter API key, billing, dan admin CMS tidak ditampilkan ke mode anak.</div></section></main>;
}
