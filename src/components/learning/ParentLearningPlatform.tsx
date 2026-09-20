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
import { ChildIdentityAvatar, useLearningProfile, useLearningProgress } from "./LearningCommon";
import styles from "./LearningPlatform.module.css";
import {
  FileText,
  GameController,
  Gear,
  House,
  Info,
  Question,
  ShieldCheck,
  ShoppingBagOpen,
  Sparkle,
  Users,
  X
} from "@phosphor-icons/react";

const DEFAULT_PREFS: LearningPreferences = { allowMotionRecommendations: false, allowAiFeatures: false, reducedMotion: false, language: "id" };
const PARENT_PRIMARY_NAV = [
  { href: "/parent", label: "Ringkasan", icon: House },
  { href: "/parent/children", label: "Anak", icon: Users },
  { href: "/parent/privacy", label: "Privasi", icon: ShieldCheck }
];

const PARENT_MORE_NAV = [
  { href: "/parent/plan", label: "Paket", icon: Sparkle },
  { href: "/parent/settings", label: "Pengaturan", icon: Gear },
  { href: "/parent/about", label: "Tentang Mainlagi", icon: Info },
  { href: "/parent/faq", label: "FAQ", icon: Question },
  { href: "/parent/policy", label: "Kebijakan", icon: FileText },
  { href: "/parent/recommendations", label: "Rekomendasi", icon: ShoppingBagOpen }
];

function parentNavActive(pathname: string, href: string) {
  return href === "/parent" ? pathname === "/parent" : pathname.startsWith(href);
}

export function ParentShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  return (
    <div className={styles.parentSurface}>
      <div className={styles.parentLayout}>
        <aside className={styles.parentSidebar}>
          <Link className={styles.parentBrand} href="/parent">
            <span>Mainlagi<small className={styles.parentBrandHint}>Ruang orang tua</small></span>
          </Link>
          <nav aria-label="Navigasi orang tua">
            {[...PARENT_PRIMARY_NAV, ...PARENT_MORE_NAV.slice(0, 2)].map((item) => {
              const active = parentNavActive(pathname, item.href);
              return (
                <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`${styles.parentNavItem} ${active ? styles.parentNavItemActive : ""}`}>
                  <item.icon size={23} weight="duotone" aria-hidden />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className={styles.parentSidebarSection}>
            <span>Bantuan & lainnya</span>
            {PARENT_MORE_NAV.slice(2).map((item) => {
              const active = parentNavActive(pathname, item.href);
              return (
                <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`${styles.parentNavItem} ${active ? styles.parentNavItemActive : ""}`}>
                  <item.icon size={22} weight="duotone" aria-hidden />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <Link href="/child/select" className={`${styles.parentNavItem} ${styles.parentModeChild}`}>
            <GameController size={23} weight="duotone" aria-hidden />
            <span>Mode anak</span>
          </Link>
        </aside>

        <div className={styles.parentContent}>
          <header className={styles.parentMobileHeader}>
            <Link className={styles.parentMobileBrand} href="/parent">Mainlagi <small>Orang tua</small></Link>
            <button type="button" className={styles.parentMoreButton} aria-expanded={moreOpen} aria-controls="parent-more-sheet" onClick={() => setMoreOpen(true)}>
              Lainnya
            </button>
          </header>
          {children}
        </div>
      </div>

      <nav className={styles.parentMobileNav} aria-label="Navigasi orang tua mobile">
        {PARENT_PRIMARY_NAV.map((item) => {
          const active = parentNavActive(pathname, item.href);
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
              <item.icon size={22} weight="duotone" aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button type="button" aria-expanded={moreOpen} aria-controls="parent-more-sheet" onClick={() => setMoreOpen(true)}>
          <Gear size={22} weight="duotone" aria-hidden />
          <span>Lainnya</span>
        </button>
      </nav>

      {moreOpen ? (
        <div className={styles.parentSheetBackdrop} role="presentation" onClick={() => setMoreOpen(false)}>
          <section id="parent-more-sheet" className={styles.parentSheet} role="dialog" aria-modal="true" aria-labelledby="parent-more-title" onClick={(event) => event.stopPropagation()}>
            <div className={styles.parentSheetHead}>
              <div>
                <small>Ruang orang tua</small>
                <h2 id="parent-more-title">Lainnya</h2>
              </div>
              <button type="button" aria-label="Tutup menu" onClick={() => setMoreOpen(false)}><X size={22} weight="bold" /></button>
            </div>
            <nav aria-label="Menu orang tua lainnya">
              {PARENT_MORE_NAV.map((item) => (
                <Link key={item.href} href={item.href}>
                  <item.icon size={22} weight="duotone" aria-hidden />
                  <span>{item.label}</span>
                </Link>
              ))}
              <Link href="/child/select"><GameController size={22} weight="duotone" aria-hidden /><span>Mode anak</span></Link>
            </nav>
          </section>
        </div>
      ) : null}
    </div>
  );
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
  return (
    <div className={styles.parentChildHeader}>
      <ChildIdentityAvatar name={profile.name} large />
      <div>
        <p className={styles.eyebrow}>Profil anak</p>
        <h1 className={styles.pageTitle}>{profile.name}</h1>
        <p className={styles.pageLead}>{profile.age} tahun · Teman belajar: {CHARACTERS[profile.guide].name}</p>
      </div>
    </div>
  );
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
  return <main className={styles.parentMain}><p className={styles.eyebrow}>Kontrol orang tua</p><h1 className={styles.pageTitle}>Privasi & AI</h1><p className={styles.pageLead}>Motion dan AI bukan syarat belajar. Default prototype: rekomendasi motion OFF, AI OFF.</p><section className={styles.section}><div className={styles.parentCard}><Toggle title="Rekomendasikan aktivitas gerak" description="Jika OFF, Main Gerak tetap bisa dibuka manual." value={prefs.allowMotionRecommendations} onToggle={() => update({ allowMotionRecommendations: !prefs.allowMotionRecommendations })} /><Toggle title="Izinkan fitur AI/OCR online" description="Preference UI saja. Runtime OpenRouter belum diaktifkan di wave ini." value={prefs.allowAiFeatures} onToggle={() => update({ allowAiFeatures: !prefs.allowAiFeatures })} /><Toggle title="Kurangi animasi" description="Untuk anak yang lebih nyaman dengan UI tenang." value={prefs.reducedMotion} onToggle={() => update({ reducedMotion: !prefs.reducedMotion })} /></div></section><section className={styles.section}><div className={styles.infoBanner}><strong>Camera distinction:</strong> motion = inferensi lokal real-time; OCR kelak = capture singkat area jawaban. Jangan kirim continuous child camera stream ke OpenRouter.</div></section></main>;
}

function Toggle({ title, description, value, onToggle }: { title: string; description: string; value: boolean; onToggle: () => void }) {
  return <div className={styles.toggleRow}><div className={styles.toggleText}><strong>{title}</strong><small>{description}</small></div><button type="button" aria-pressed={value} aria-label={title} className={`${styles.switch} ${value ? styles.switchOn : ""}`} onClick={onToggle} /></div>;
}

export function ParentPlanScreen() {
  return <main className={styles.parentMain}><p className={styles.eyebrow}>Paket Mainlagi</p><h1 className={styles.pageTitle}>Paket</h1><div className={styles.parentGrid} style={{ marginTop: 24 }}><div className={styles.parentCard}><span className={styles.tag}>Current direction</span><h2 style={{ color: "#24445e" }}>Community / Core</h2><p>Core app, activity framework, selected example content, dan motion runtime dapat hidup di open-source codebase sesuai lisensi repo.</p></div><div className={styles.parentCard}><span className={styles.tag}>Planned</span><h2 style={{ color: "#24445e" }}>Mainlagi Premium</h2><p>Premium curriculum/audio, hosted cloud, advanced reports, school capabilities, managed AI, dan support dapat menjadi commercial offering.</p></div></div><section className={styles.section}><div className={styles.infoBanner}>Harga, entitlement, dan paywall <strong>belum</strong> diimplementasikan karena belum ada keputusan produk final.</div></section></main>;
}

export function ParentSettingsScreen() {
  const [prefs, persist] = usePreferences();
  const setLanguage = (language: "id" | "en") => persist({ ...prefs, language });
  return (
    <main className={styles.parentMain}>
      <p className={styles.eyebrow}>Preferensi</p>
      <h1 className={styles.pageTitle}>Pengaturan</h1>
      <p className={styles.pageLead}>Atur bahasa dan buka informasi penting untuk orang tua. Pengaturan ini tidak ditampilkan di mode anak.</p>

      <section className={styles.formCard}>
        <span className={styles.formLabel}>Bahasa antarmuka</span>
        <div className={styles.choiceRow}>
          <button type="button" className={`${styles.choicePill} ${prefs.language === "id" ? styles.choicePillActive : ""}`} onClick={() => setLanguage("id")}>Bahasa Indonesia</button>
          <button type="button" className={`${styles.choicePill} ${prefs.language === "en" ? styles.choicePillActive : ""}`} onClick={() => setLanguage("en")}>English</button>
        </div>
        <p className={styles.parentSettingNote}>Preferensi bahasa sudah tersimpan. Beberapa string lama masih dalam proses konsolidasi localization.</p>
      </section>

      <section className={styles.parentOverviewSection} aria-labelledby="parent-info-title">
        <div className={styles.parentSectionHeading}>
          <div>
            <p className={styles.eyebrow}>Informasi & bantuan</p>
            <h2 id="parent-info-title">Tentang Mainlagi</h2>
          </div>
        </div>
        <div className={styles.parentSettingsLinks}>
          <Link href="/parent/about"><Info size={22} weight="duotone" aria-hidden /><span><strong>Tentang Mainlagi</strong><small>Tujuan produk dan batasannya.</small></span></Link>
          <Link href="/parent/faq"><Question size={22} weight="duotone" aria-hidden /><span><strong>FAQ</strong><small>Jawaban singkat untuk pertanyaan umum.</small></span></Link>
          <Link href="/parent/policy"><FileText size={22} weight="duotone" aria-hidden /><span><strong>Kebijakan</strong><small>Privasi anak, sharing, kamera, dan AI.</small></span></Link>
          <Link href="/parent/recommendations"><ShoppingBagOpen size={22} weight="duotone" aria-hidden /><span><strong>Rekomendasi</strong><small>Produk pendukung dan transparansi afiliasi.</small></span></Link>
        </div>
      </section>
    </main>
  );
}

export function ParentAboutScreen() {
  return (
    <main className={styles.parentMain}>
      <p className={styles.eyebrow}>Tentang</p>
      <h1 className={styles.pageTitle}>Tentang Mainlagi</h1>
      <p className={styles.pageLead}>Mainlagi adalah ruang belajar sambil bermain untuk anak usia dini, dengan area anak dan area orang tua yang dipisahkan.</p>
      <section className={styles.parentInfoStack}>
        <div className={styles.parentCard}><h2>Untuk anak</h2><p>Aktivitas dibuat singkat, visual, interaktif, dan didampingi suara bila perangkat mendukung.</p></div>
        <div className={styles.parentCard}><h2>Untuk orang tua</h2><p>Progress, report, pengaturan privasi, dan keputusan akun tetap berada di area orang tua.</p></div>
        <div className={styles.parentCard}><h2>Batasan</h2><p>Mainlagi tidak mengklaim diagnosis, nilai kecerdasan, atau pengganti guru, orang tua, maupun tenaga profesional.</p></div>
      </section>
    </main>
  );
}

export function ParentFaqScreen() {
  const items = [
    ["Apakah semua aktivitas harus diselesaikan?", "Tidak. Anak dapat belajar bertahap dan orang tua dapat memilih aktivitas yang sesuai."],
    ["Apakah bintang adalah nilai kemampuan anak?", "Tidak. Bintang adalah reward permainan, bukan ukuran kecerdasan atau diagnosis."],
    ["Apakah kamera selalu aktif?", "Tidak. Aktivitas gerak bersifat pilihan dan kontrol kamera tidak diperlukan untuk aktivitas belajar biasa."],
    ["Kenapa suara kadang berbeda antar perangkat?", "Browser dapat memakai voice bawaan perangkat. Mainlagi sedang memisahkan perbaikan latency dari peningkatan kualitas voice production."]
  ];
  return (
    <main className={styles.parentMain}>
      <p className={styles.eyebrow}>Bantuan</p>
      <h1 className={styles.pageTitle}>FAQ</h1>
      <div className={styles.parentFaqList}>
        {items.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
      </div>
    </main>
  );
}

export function ParentPolicyScreen() {
  return (
    <main className={styles.parentMain}>
      <p className={styles.eyebrow}>Keamanan keluarga</p>
      <h1 className={styles.pageTitle}>Kebijakan & privasi</h1>
      <p className={styles.pageLead}>Ringkasan produk ini membantu orang tua memahami batas utama. Dokumen legal final tetap harus mengikuti kebijakan resmi yang dipublikasikan sebelum commercial release.</p>
      <section className={styles.parentInfoStack}>
        <div className={styles.parentCard}><h2>Data anak</h2><p>Nama anak, umur, ID akun, dan detail progress tidak dimasukkan ke pesan social sharing dari mode anak.</p></div>
        <div className={styles.parentCard}><h2>Share</h2><p>Social sharing dari activity membutuhkan parent gate dan hanya membagikan pesan pencapaian umum serta tautan Mainlagi.</p></div>
        <div className={styles.parentCard}><h2>Kamera & AI</h2><p>Aktivitas gerak dan fitur AI bukan syarat belajar. Pengaturan terkait tetap berada di area orang tua.</p><Link className={styles.secondaryButton} href="/parent/privacy">Buka kontrol Privasi & AI</Link></div>
      </section>
    </main>
  );
}

export function ParentRecommendationsScreen() {
  return (
    <main className={styles.parentMain}>
      <p className={styles.eyebrow}>Rekomendasi</p>
      <h1 className={styles.pageTitle}>Produk pendukung</h1>
      <p className={styles.pageLead}>Halaman ini disiapkan untuk rekomendasi yang relevan bagi orang tua. Mainlagi belum memasang link afiliasi aktif pada wave ini.</p>
      <div className={styles.parentEmptyCard}>
        <strong>Belum ada rekomendasi berbayar.</strong>
        <p>Jika link afiliasi ditambahkan nanti, setiap link harus diberi label afiliasi secara jelas dan tetap berada di area orang tua.</p>
      </div>
    </main>
  );
}
