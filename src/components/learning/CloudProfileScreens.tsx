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
  readProfiles,
  saveProfile,
  type CharacterId,
  type LearningChildProfile
} from "@/lib/learning/system";
import { ChildIdentityAvatar, useLearningProgress } from "./LearningCommon";
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
        profiles: [DEMO_PROFILE, ...readProfiles().filter((item) => item.id !== DEMO_PROFILE.id)],
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
      <ChildIdentityAvatar name={profile.name} />
      <span className={styles.profileCardText}>
        <strong>{profile.id === DEMO_PROFILE.id ? `${profile.name} — Demo` : profile.name}</strong>
        <span>
          {profile.id === DEMO_PROFILE.id
            ? `${profile.age} tahun · Coba tanpa membuat profil`
            : `${profile.age} tahun · Teman: ${CHARACTERS[profile.guide].name}`}
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
    setBusy(true);
    setError(null);
    try {
      if (collection.authenticated) {
        const profile = await createCloudLearningProfile({ name: clean, age, guide });
        if (!profile) throw new Error("Profil cloud tidak berhasil dibuat.");
        window.dispatchEvent(new CustomEvent("mainlagi-learning-profiles", { detail: { childId: profile.id } }));
        rememberChild(profile.id);
        router.push(childDestination(profile.id, subjectId));
        return;
      }

      const id = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `child-${Date.now()}`;
      const profile: LearningChildProfile = { id, name: clean.slice(0, 24), age, guide, language: "id" };
      saveProfile(profile);
      window.dispatchEvent(new CustomEvent("mainlagi-learning-profiles", { detail: { childId: profile.id } }));
      rememberChild(id);
      router.push(childDestination(id, subjectId));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Profil tidak berhasil dibuat.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PlayroomShell><main className={styles.surface}>
      <div className={styles.contentNarrow}>
        <p className={styles.eyebrow}>Mainlagi untuk anak</p>
        <h1 className={styles.pageTitle}>Siapa yang mau belajar?</h1>
        <p className={styles.pageLead}>
          {collection.authenticated
            ? "Profil akun tersimpan di cloud dan bisa dipakai lagi di perangkat lain."
            : "Mode tamu menyimpan profil hanya di perangkat ini."}
        </p>

        <section className={styles.section}>
          {collection.loading ? <div className={styles.emptyState}>Memuat profil...</div> : null}
          {collection.error ? <div className={styles.infoBanner}>{collection.error}</div> : null}
          <div className={styles.profileGrid}>
            {collection.profiles.map((profile) => <ProfileLink profile={profile} subjectId={subjectId} key={profile.id} />)}
          </div>
        </section>

        <section className={styles.formCard}>
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
              {busy ? "Menyimpan..." : collection.authenticated ? "Buat profil cloud" : "Buat profil"}
            </button>
            <Link className={styles.secondaryButton} href="/parent">Area orang tua</Link>
          </div>
        </section>
      </div>
    </main></PlayroomShell>
  );
}

function ParentProfileCard({ profile, demo = false }: { profile: LearningChildProfile; demo?: boolean }) {
  const progress = useLearningProgress(profile.id);
  return (
    <article className={`${styles.parentCard} ${demo ? styles.parentDemoCard : ""}`}>
      <div className={styles.parentProfileHead}>
        <ChildIdentityAvatar name={profile.name} />
        <div className={styles.parentProfileCopy}>
          <strong>{demo ? `${profile.name} — Demo` : profile.name}</strong>
          <span>{profile.age} tahun · Teman: {CHARACTERS[profile.guide].name}</span>
        </div>
      </div>
      <div className={styles.parentProfileStats} aria-label={`Ringkasan ${profile.name}`}>
        <span><strong>{progress.completedActivityIds.length}</strong> aktivitas</span>
        <span><strong>{progress.stars}</strong> bintang</span>
      </div>
      <div className={styles.parentProfileActions}>
        <Link href={`/parent/children/${profile.id}`}>{demo ? "Lihat demo" : "Lihat profil"}</Link>
        {!demo ? <Link href={`/parent/children/${profile.id}/progress`}>Progress</Link> : null}
      </div>
    </article>
  );
}

export function CloudParentOverviewScreen() {
  const collection = useProfileCollection();
  const demoProfile = collection.profiles.find((profile) => profile.id === DEMO_PROFILE.id) ?? DEMO_PROFILE;
  const familyProfiles = collection.profiles.filter((profile) => profile.id !== DEMO_PROFILE.id);

  return (
    <main className={styles.parentMain}>
      <header className={styles.parentPageHeader}>
        <div>
          <p className={styles.eyebrow}>Area orang tua</p>
          <h1 className={styles.pageTitle}>Ringkasan belajar</h1>
          <p className={styles.pageLead}>Lihat aktivitas anak, buka progress, dan lanjut ke report tanpa masuk ke mode anak.</p>
        </div>
        <Link className={styles.secondaryButton} href="/child/select">Kelola profil anak</Link>
      </header>

      {collection.error ? <div className={styles.infoBanner}>{collection.error}</div> : null}

      <section className={styles.parentOverviewSection} aria-labelledby="family-profiles-title">
        <div className={styles.parentSectionHeading}>
          <div>
            <p className={styles.eyebrow}>Keluarga</p>
            <h2 id="family-profiles-title">Anak Anda</h2>
          </div>
          <span>{familyProfiles.length} profil</span>
        </div>

        {collection.loading ? <div className={styles.emptyState}>Memuat profil…</div> : familyProfiles.length ? (
          <div className={styles.parentGrid}>
            {familyProfiles.map((profile) => <ParentProfileCard profile={profile} demo={profile.id === DEMO_PROFILE.id} key={profile.id} />)}
          </div>
        ) : (
          <div className={styles.parentEmptyCard}>
            <strong>Belum ada profil anak.</strong>
            <p>Buat profil supaya progress setiap anak tidak tercampur dengan demo.</p>
            <Link className={styles.primaryButton} href="/child/select">Tambah profil anak</Link>
          </div>
        )}
      </section>

      <section className={styles.parentOverviewSection} aria-labelledby="demo-profile-title">
        <div className={styles.parentSectionHeading}>
          <div>
            <p className={styles.eyebrow}>Coba produk</p>
            <h2 id="demo-profile-title">Profil demo</h2>
          </div>
        </div>
        <p className={styles.parentSectionLead}>Demo dipisahkan dari profil keluarga supaya data uji tidak terlihat seperti progress anak sungguhan.</p>
        <div className={styles.parentDemoGrid}>
          <ParentProfileCard profile={demoProfile} demo />
        </div>
      </section>
    </main>
  );
}

export function CloudParentChildrenScreen() {
  const collection = useProfileCollection();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      <p className={styles.eyebrow}>Profiles</p>
      <h1 className={styles.pageTitle}>Anak</h1>
      <p className={styles.pageLead}>
        {collection.authenticated
          ? "Profil anak tersimpan di Supabase dan dibatasi oleh ownership akun."
          : "Mode development tanpa session memakai profil lokal."}
      </p>
      {collection.error || error ? <div className={styles.infoBanner}>{error ?? collection.error}</div> : null}
      <section className={styles.section}>
        <div className={styles.parentGrid}>
          {collection.profiles.map((profile) => (
            <div key={profile.id} style={{ display: "grid", gap: 8 }}>
              <ParentProfileCard profile={profile} />
              {collection.authenticated && profile.id !== DEMO_PROFILE.id ? (
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
      </section>
      <div className={styles.heroActionRow}>
        <Link className={styles.primaryButton} href="/child/select">Tambah / pilih profil</Link>
      </div>
    </main>
  );
}
