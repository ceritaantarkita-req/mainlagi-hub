"use client";

import Link from "next/link";
import { ArrowLeft, ArrowClockwise, ArrowRight, Copy, ShareNetwork, Star } from "@phosphor-icons/react";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getNextActivityInStage, type LearningActivity } from "@/lib/learning/system";
import styles from "./ActivityCompletion.module.css";

const PRAISE = ["Great job!", "Excellent!", "Hebat!", "Keren!"];

function deterministicPraise(activityId: string) {
  let total = 0;
  for (const char of activityId) total += char.charCodeAt(0);
  return PRAISE[total % PRAISE.length];
}

export function ActivityCompletion({
  childId,
  activity,
  onTryAgain
}: {
  childId: string;
  activity: LearningActivity;
  onTryAgain?: () => void;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [shareGate, setShareGate] = useState<"idle" | "checking" | "allowed" | "denied">("idle");
  const [copyStatus, setCopyStatus] = useState("");
  const praise = useMemo(() => deterministicPraise(activity.id), [activity.id]);
  const next = getNextActivityInStage(activity.id);
  const subjectHref = `/child/${childId}/subject/${activity.subjectId}`;
  const nextHref = next ? `/child/${childId}/activity/${next.id}` : subjectHref;

  const goBack = () => {
    try {
      const referrer = document.referrer ? new URL(document.referrer) : null;
      if (referrer?.origin === window.location.origin) {
        router.back();
        return;
      }
    } catch {}
    router.push(subjectHref);
  };

  const retry = () => {
    if (onTryAgain) {
      onTryAgain();
      return;
    }
    window.location.reload();
  };

  const openShare = async () => {
    setShareGate("checking");
    setCopyStatus("");
    dialogRef.current?.showModal();
    try {
      const response = await fetch("/api/parent/share-gate", { cache: "no-store" });
      const payload = await response.json() as { allowed?: boolean };
      setShareGate(payload.allowed ? "allowed" : "denied");
    } catch {
      setShareGate("denied");
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareText = "Aku baru menyelesaikan permainan di Mainlagi! ⭐⭐⭐";
  const encodedText = encodeURIComponent(`${shareText} ${shareUrl}`);
  const encodedUrl = encodeURIComponent(shareUrl);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus("Link tersalin.");
    } catch {
      setCopyStatus("Link belum bisa disalin di browser ini.");
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: "Mainlagi", text: shareText, url: shareUrl });
    } catch {}
  };

  return (
    <section className={styles.overlay} data-activity-completion aria-labelledby="completion-title">
      <div className={styles.completion}>
      <div className={styles.praise} id="completion-title">{praise}</div>
      <div className={styles.stars} aria-label="Tiga bintang">
        {[0, 1, 2].map((index) => <Star key={index} size={46} weight="fill" aria-hidden style={{ animationDelay: `${index * 100}ms` }} />)}
      </div>
      <p className={styles.message}>Permainan selesai. Mau lanjut ke mana?</p>

      <div className={styles.actions}>
        <button type="button" onClick={goBack}><ArrowLeft size={22} weight="bold" aria-hidden />Back</button>
        <button type="button" onClick={retry}><ArrowClockwise size={22} weight="bold" aria-hidden />Try Again</button>
        <Link href={nextHref} aria-label="Next"><ArrowRight size={22} weight="bold" aria-hidden />Next</Link>
      </div>

      <button type="button" className={styles.shareButton} onClick={() => void openShare()}>
        <ShareNetwork size={22} weight="bold" aria-hidden />Share
      </button>

      </div>

      <dialog ref={dialogRef} className={styles.shareDialog} aria-labelledby="share-title">
        <div className={styles.dialogHead}>
          <div>
            <small>Area orang tua</small>
            <h2 id="share-title">Bagikan pencapaian</h2>
          </div>
          <button type="button" className={styles.close} onClick={() => dialogRef.current?.close()} aria-label="Tutup">×</button>
        </div>

        {shareGate === "checking" ? <p role="status">Memeriksa akses orang tua…</p> : null}
        {shareGate === "denied" ? (
          <div className={styles.parentGate}>
            <p>Fitur berbagi hanya tersedia melalui sesi orang tua.</p>
            <Link href="/parent">Buka Area Orang Tua</Link>
          </div>
        ) : null}
        {shareGate === "allowed" ? (
          <>
            <p className={styles.safeNote}>Yang dibagikan hanya tautan Mainlagi dan pesan umum—tanpa nama anak, umur, akun, atau detail progres.</p>
            <div className={styles.shareGrid}>
              <button type="button" onClick={() => void copyLink()}><Copy size={20} aria-hidden />Copy link</button>
              <button type="button" onClick={() => void nativeShare()}><ShareNetwork size={20} aria-hidden />Share device</button>
              <a href={`https://wa.me/?text=${encodedText}`} target="_blank" rel="noreferrer">WhatsApp</a>
              <a href={`https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer">Telegram</a>
              <a href={`https://twitter.com/intent/tweet?text=${encodedText}`} target="_blank" rel="noreferrer">X</a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer">Facebook</a>
              <a href={`https://www.threads.net/intent/post?text=${encodedText}`} target="_blank" rel="noreferrer">Threads</a>
            </div>
            {copyStatus ? <p className={styles.copyStatus} role="status">{copyStatus}</p> : null}
          </>
        ) : null}
      </dialog>
    </section>
  );
}
