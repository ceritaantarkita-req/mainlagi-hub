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
import { CharacterAvatar, useLearningProgress } from "./LearningCommon";
import styles from "./LearningPlatform.module.css";

interface ProfileCollection {
  profiles: LearningChildProfile[];
  authenticated: boolean;
  loading: boolean;
  error: string | null;
}

function useProfileCollection(): ProfileCollection & { refresh: () => Promise<void> } {
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

function ProfileLink({ profile }: { profile: LearningChildProfile }) {
  return (
    <Link className={styles.profileCard} href={`/child/${profile.id}/home`}>
      <CharacterAvatar id={profile.guide} />
      <span className={styles.profileCardText}>
        <strong>{profile.id === DEMO_PROFILE.id ? `${profile.name} — Demo` : profile.name}</strong>
        <span>
          {profile.id === DEMO_PROFILE.id
            ? `${profile.age} tahun · Sandbox cepat`
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
        router.push(`/child/${profile.id}/home`);
        return;
      }

      const id = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `child-${Date.now()}`;
      const profile: LearningChildProfile = { id, name: clean.slice(0, 24), age, guide, language: "id" };
      saveProfile(profile);
      window.dispatchEvent(new CustomEvent("mainlagi-learning-profiles", { detail: { childId: profile.id } }));
      router.push(`/child/${id}/home`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Profil tidak berhasil dibuat.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className={styles.surface}>
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
            {collection.profiles.map((profile) => <ProfileLink profile={profile} key={profile.id} />)}
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
    </main>
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
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <CharacterAvatar id={profile.guide} />
        <div>
          <strong style={{ color: "#24445e" }}>{profile.id === DEMO_PROFILE.id ? `${profile.name} — Demo` : profile.name}</strong>
          <p>{profile.age} tahun · {progress.completedActivityIds.length} aktivitas · ⭐ {progress.stars}</p>
        </div>
      </div>
    </Link>
  );
}

export function CloudParentOverviewScreen() {
  const collection = useProfileCollection();
  return (
    <main className={styles.parentMain}>
      <p className={styles.eyebrow}>Area orang tua</p>
      <h1 className={styles.pageTitle}>Ringkasan belajar</h1>
      <p className={styles.pageLead}>Saat login, profil, progress, attempt, dan mastery dibaca dari cloud account yang sedang aktif.</p>
      {collection.error ? <div className={styles.infoBanner}>{collection.error}</div> : null}
      <section className={styles.section}>
        <div className={styles.parentGrid}>
          {collection.profiles.map((profile) => <ParentProfileCard profile={profile} key={profile.id} />)}
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
