"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getCurrentUserId } from "@/lib/auth/supabase-auth";
import {
  createCloudLearningProfile,
  listCloudLearningProfiles,
  removeCloudLearningProfile
} from "@/lib/learning/cloud";
import {
  CHARACTERS,
  DEMO_PROFILE,
  getActivity,
  type CharacterId,
  type LearningChildProfile
} from "@/lib/learning/system";
import { CharacterAvatar, ProfileIdentityBadge, useLearningProgress } from "./LearningCommon";
import styles from "./LearningPlatform.module.css";
import { childDestination, readActiveChild, rememberChild } from "@/lib/learning/entry";
import { PlayroomShell } from "./Playroom";

interface ProfileCollection {
  profiles: LearningChildProfile[];
  authenticated: boolean;
  loading: boolean;
  error: string | null;
}

export function useProfileCollection(): ProfileCollection & { refresh: () => Promise<void> } {
  const [state, setState] = useState<ProfileCollection>({
    profiles: [DEMO_PROFILE],
    authenticated: false,
    loading: true,
    error: null
  });

  const refresh = useCallback(async () => {
    const userId = await getCurrentUserId();
    if (!userId) {
      setState({
        profiles: [DEMO_PROFILE],
        authenticated: false,
        loading: false,
        error: null
      });
      return;
    }

    const cloud = await listCloudLearningProfiles();
    if (cloud === null) {
      setState({
        profiles: [DEMO_PROFILE],
        authenticated: true,
        loading: false,
        error: "Profil cloud belum bisa dimuat. Coba lagi sebentar lagi."
      });
      return;
    }

    setState({
      profiles: [DEMO_PROFILE, ...cloud.filter((item) => item.id !== DEMO_PROFILE.id)],
      authenticated: true,
      loading: false,
      error: null
    });
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => void refresh());
    const onProfiles = () => void refresh();
    window.addEventListener("mainlagi-learning-profiles", onProfiles);
    window.addEventListener("storage", onProfiles);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mainlagi-learning-profiles", onProfiles);
      window.removeEventListener("storage", onProfiles);
    };
  }, [refresh]);

  return { ...state, refresh };
}

function ProfileLink({ profile, subjectId }: { profile: LearningChildProfile; subjectId?: string | null }) {
  return (
    <Link className={styles.profileCard} href={childDestination(profile.id, subjectId)} onClick={() => rememberChild(profile.id)}>
      <CharacterAvatar id={profile.guide} />
      <span className={styles.profileCardText}>
        <strong>{profile.id === DEMO_PROFILE.id ? `${profile.name} — Demo` : profile.name}</strong>
        <span>
          {profile.id === DEMO_PROFILE.id
            ? `${profile.age} tahun · Coba tanpa membuat profil`
            : `${profile.age} tahun · Guide ${CHARACTERS[profile.guide].name}`}
        </span>
      </span>
      <span aria-hidden>→</span>
    </Link>
  );
}

export function CloudChildSelectScreen() {
  const router = useRouter();
  const collection = useProfileCollection();
  const [name, setName] = useState("");
  const [age, setAge] = useState(5);
  const [guide, setGuide] = useState<CharacterId>("paca");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const subject = query.get("subject");
    const frame = requestAnimationFrame(() => setSubjectId(subject));
    if (!collection.loading && !collection.error && query.get("continue") === "1") {
      const id = readActiveChild();
      if (id && collection.profiles.some(profile => profile.id === id)) router.replace(childDestination(id, subject));
    }
    return () => cancelAnimationFrame(frame);
  }, [collection.loading, collection.error, collection.profiles, router]);

  const createProfile = async () => {
    const clean = name.trim();
    if (!clean || busy) return;
    if (!collection.authenticated) {
      setError("Daftar atau masuk ke akun keluarga untuk membuat profil anak.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const profile = await createCloudLearningProfile({ name: clean, age, guide });
      if (!profile) throw new Error("Profil cloud tidak berhasil dibuat.");
      window.dispatchEvent(new CustomEvent("mainlagi-learning-profiles", { detail: { childId: profile.id } }));
      rememberChild(profile.id);
      router.push(childDestination(profile.id, subjectId));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Profil tidak berhasil dibuat.");
    } finally {
      setBusy(false);
    }
  };

  const returnToChildSelect = subjectId
    ? `/child/select?continue=1&subject=${encodeURIComponent(subjectId)}`
    : "/child/select?continue=1";
  const authNext = encodeURIComponent(returnToChildSelect);

  return (
    <PlayroomShell><main className={styles.surface}>
      <div className={styles.contentNarrow}>
        <p className={styles.eyebrow}>Mainlagi untuk anak</p>
        <h1 className={styles.pageTitle}>Siapa yang mau belajar?</h1>
        <p className={styles.pageLead}>
          {collection.authenticated
            ? "Profil anak tersimpan di akun keluarga dan bisa dipakai lagi di perangkat lain."
            : "Coba Gian Demo tanpa akun, atau daftar / masuk untuk membuat profil anak sendiri."}
        </p>

        <section className={styles.section}>
          {collection.loading ? <div className={styles.emptyState}>Memuat profil...</div> : null}
          {collection.error ? <div className={styles.infoBanner}>{collection.error}</div> : null}
          <div className={styles.profileGrid}>
            {collection.profiles.map((profile) => <ProfileLink profile={profile} subjectId={subjectId} key={profile.id} />)}
          </div>
        </section>

        {!collection.loading && !collection.authenticated ? (
          <section className={styles.formCard} data-mainlagi-account-first-gate>
            <h2 style={{ margin: 0, color: "#24445e" }}>Buat profil anak dengan akun keluarga</h2>
            <p className={styles.pageLead}>
              Profil anak, progres, dan pengaturan keluarga disimpan melalui akun. Tanpa akun, Gian Demo tetap bisa dicoba.
            </p>
            <div className={styles.heroActionRow}>
              <Link className={styles.primaryButton} href={`/signup?next=${authNext}`}>Daftar dengan email</Link>
              <Link className={styles.secondaryButton} href={`/login?next=${authNext}`}>Sudah punya akun? Masuk</Link>
            </div>
          </section>
        ) : null}

        {collection.authenticated ? (
          <section className={styles.formCard} data-mainlagi-cloud-profile-form>
            <h2 style={{ margin: 0, color: "#24445e" }}>Tambah profil anak</h2>
            <div className={styles.formGroup}>
              <label htmlFor="child-name">Nama panggilan</label>
              <input
                id="child-name"
                className={styles.input}
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={24}
                placeholder="Contoh: Gian"
              />
            </div>
            <div className={styles.formGroup}>
              <span className={styles.formLabel}>Umur</span>
              <div className={styles.choiceRow}>
                {[3, 4, 5, 6, 7].map((value) => (
                  <button
                    type="button"
                    key={value}
                    className={`${styles.choicePill} ${age === value ? styles.choicePillActive : ""}`}
                    onClick={() => setAge(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.formGroup}>
              <span className={styles.formLabel}>Teman panduan</span>
              <div className={styles.choiceRow}>
                {(Object.keys(CHARACTERS) as CharacterId[]).map((id) => (
                  <button
                    type="button"
                    key={id}
                    className={`${styles.choicePill} ${guide === id ? styles.choicePillActive : ""}`}
                    onClick={() => setGuide(id)}
                  >
                    {CHARACTERS[id].emoji} {CHARACTERS[id].name}
                  </button>
                ))}
              </div>
            </div>
            {error ? <div className={styles.feedbackTry}>{error}</div> : null}
            <div className={styles.heroActionRow}>
              <button type="button" className={styles.primaryButton} onClick={() => void createProfile()} disabled={busy || !name.trim()}>
                {busy ? "Menyimpan..." : "Buat profil anak"}
              </button>
              <Link className={styles.secondaryButton} href="/parent">Area orang tua</Link>
            </div>
          </section>
        ) : null}
      </div>
    </main></PlayroomShell>
  );
}

function ParentProfileCard({ profile }: { profile: LearningChildProfile }) {
  const progress = useLearningProgress(profile.id);
  return (
    <Link
      href={`/parent/children/${profile.id}`}
      className={styles.parentCard}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className={styles.parentProfileIdentity}>
        <ProfileIdentityBadge profile={profile} />
        <div>
          <strong>{profile.id === DEMO_PROFILE.id ? `${profile.name} — Demo` : profile.name}</strong>
          <p>{profile.age} tahun · {progress.completedActivityIds.length} aktivitas · ⭐ {progress.stars}</p>
          <small>Teman panduan: {CHARACTERS[profile.guide].name}</small>
        </div>
      </div>
    </Link>
  );
}

function ParentOverviewCard({ profile }: { profile: LearningChildProfile }) {
  const progress = useLearningProgress(profile.id);
  const recent = progress.lastActivityId ? getActivity(progress.lastActivityId) : null;
  const isDemo = profile.id === DEMO_PROFILE.id;

  return (
    <article className={styles.parentOverviewCard} data-mainlagi-parent-profile={isDemo ? "demo" : "family"}>
      <div className={styles.parentOverviewHeader}>
        <div className={styles.parentProfileIdentity}>
          <ProfileIdentityBadge profile={profile} />
          <div>
            <div className={styles.parentProfileTitleRow}>
              <h3>{profile.name}</h3>
              {isDemo ? <span className={styles.parentDemoBadge}>Demo</span> : null}
            </div>
            <p>{profile.age} tahun · Teman panduan {CHARACTERS[profile.guide].name}</p>
          </div>
        </div>
      </div>

      <div className={styles.parentOverviewMetrics} aria-label={`Ringkasan ${profile.name}`}>
        <div><strong>{progress.completedActivityIds.length}</strong><span>Aktivitas selesai</span></div>
        <div><strong>{progress.stars}</strong><span>Bintang terkumpul</span></div>
      </div>

      <div className={styles.parentRecentActivity}>
        <span>Terakhir dikerjakan</span>
        <strong>{recent?.title ?? "Belum ada aktivitas"}</strong>
        <small>{recent ? "Lihat detail perkembangan atau lanjutkan dari mode anak." : "Mulai satu aktivitas untuk membuat ringkasan belajar pertama."}</small>
      </div>

      <div className={styles.parentCardActions}>
        <Link className={styles.secondaryButton} href={`/parent/children/${profile.id}`}>Lihat perkembangan</Link>
        <Link className={styles.primaryButton} href={`/child/${profile.id}/home`}>Lanjutkan belajar</Link>
      </div>
    </article>
  );
}

export function CloudParentOverviewScreen() {
  const collection = useProfileCollection();
  const familyProfiles = collection.profiles.filter((profile) => profile.id !== DEMO_PROFILE.id);
  const demoProfile = collection.profiles.find((profile) => profile.id === DEMO_PROFILE.id);

  return (
    <main className={styles.parentMain}>
      <section className={styles.parentDashboardHero} aria-labelledby="parent-overview-title">
        <div>
          <p className={styles.eyebrow}>Area orang tua</p>
          <h1 id="parent-overview-title" className={styles.pageTitle}>Ringkasan belajar keluarga</h1>
          <p className={styles.pageLead}>Lihat apa yang sudah dikerjakan anak, progres yang tercatat, dan jalur paling cepat untuk melanjutkan belajar.</p>
        </div>
        <Link className={styles.primaryButton} href="/child/select">Tambah / pilih profil</Link>
      </section>

      {collection.error ? <div className={styles.infoBanner}>{collection.error}</div> : null}

      <section className={styles.parentDashboardSection} aria-labelledby="family-profiles-title" data-mainlagi-family-profiles>
        <div className={styles.parentSectionHeading}>
          <div>
            <p className={styles.settingsKicker}>Keluarga</p>
            <h2 id="family-profiles-title">Profil keluarga</h2>
          </div>
          <Link href="/parent/children">Kelola profil</Link>
        </div>

        {collection.loading ? <div className={styles.parentEmptyState}>Memuat profil keluarga...</div> : null}
        {!collection.loading && familyProfiles.length === 0 ? (
          <div className={styles.parentEmptyState}>
            <strong>Belum ada profil keluarga.</strong>
            <p>Buat profil anak untuk menyimpan perjalanan belajar terpisah dari mode demo.</p>
            <Link className={styles.secondaryButton} href="/child/select">Buat profil anak</Link>
          </div>
        ) : null}
        <div className={styles.parentOverviewGrid}>
          {familyProfiles.map((profile) => <ParentOverviewCard profile={profile} key={profile.id} />)}
        </div>
      </section>

      {demoProfile ? (
        <section className={styles.parentDashboardSection} aria-labelledby="demo-profile-title" data-mainlagi-demo-profile>
          <div className={styles.parentSectionHeading}>
            <div>
              <p className={styles.settingsKicker}>Coba tanpa profil</p>
              <h2 id="demo-profile-title">Mode demo</h2>
            </div>
          </div>
          <p className={styles.parentSectionLead}>Gian Demo tetap tersedia untuk mencoba Mainlagi, tetapi dipisahkan dari profil keluarga agar laporan orang tua tidak membingungkan.</p>
          <div className={styles.parentOverviewGrid}>
            <ParentOverviewCard profile={demoProfile} />
          </div>
        </section>
      ) : null}
    </main>
  );
}

export function CloudParentChildrenScreen() {
  const collection = useProfileCollection();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const familyProfiles = collection.profiles.filter((profile) => profile.id !== DEMO_PROFILE.id);
  const demoProfile = collection.profiles.find((profile) => profile.id === DEMO_PROFILE.id);

  const remove = async (profile: LearningChildProfile) => {
    if (!collection.authenticated || profile.id === DEMO_PROFILE.id || removingId) return;
    if (!window.confirm(`Hapus profil ${profile.name} dari akun ini? Data learning history tidak dihapus otomatis.`)) return;
    setRemovingId(profile.id);
    setError(null);
    try {
      const ok = await removeCloudLearningProfile(profile.id);
      if (!ok) throw new Error("Profil tidak berhasil dihapus.");
      window.dispatchEvent(new CustomEvent("mainlagi-learning-profiles", { detail: { childId: profile.id } }));
      await collection.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Profil tidak berhasil dihapus.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <main className={styles.parentMain}>
      <p className={styles.eyebrow}>Profil keluarga</p>
      <h1 className={styles.pageTitle}>Anak</h1>
      <p className={styles.pageLead}>
        {collection.authenticated
          ? "Profil keluarga tersimpan di Supabase dan dibatasi oleh ownership akun."
          : "Mode development tanpa session memakai profil lokal."}
      </p>

      {collection.error || error ? <div className={styles.infoBanner}>{error ?? collection.error}</div> : null}

      <section className={styles.parentDashboardSection} aria-labelledby="children-family-title">
        <div className={styles.parentSectionHeading}>
          <div>
            <p className={styles.settingsKicker}>Keluarga</p>
            <h2 id="children-family-title">Profil tersimpan</h2>
          </div>
        </div>
        <div className={styles.parentGrid}>
          {familyProfiles.map((profile) => (
            <div key={profile.id} className={styles.parentProfileManageCard}>
              <ParentProfileCard profile={profile} />
              {collection.authenticated ? (
                <button
                  type="button"
                  className={styles.secondaryButton}
                  disabled={removingId === profile.id}
                  onClick={() => void remove(profile)}
                >
                  {removingId === profile.id ? "Menghapus..." : "Hapus profil"}
                </button>
              ) : null}
            </div>
          ))}
        </div>
        {!collection.loading && familyProfiles.length === 0 ? <div className={styles.parentEmptyState}>Belum ada profil keluarga.</div> : null}
      </section>

      {demoProfile ? (
        <section className={styles.parentDashboardSection} aria-labelledby="children-demo-title">
          <div className={styles.parentSectionHeading}>
            <div>
              <p className={styles.settingsKicker}>Demo</p>
              <h2 id="children-demo-title">Profil untuk mencoba</h2>
            </div>
          </div>
          <div className={styles.parentGrid}><ParentProfileCard profile={demoProfile} /></div>
        </section>
      ) : null}

      <div className={styles.heroActionRow}>
        <Link className={styles.primaryButton} href="/child/select">Tambah / pilih profil</Link>
      </div>
    </main>
  );
}
