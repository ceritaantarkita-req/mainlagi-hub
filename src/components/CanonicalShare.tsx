"use client";

import Link from "next/link";
import { Copy, ShareNetwork, X } from "@phosphor-icons/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  buildCanonicalShareProviderUrls,
  resolveCanonicalSharePayload,
  resolveCanonicalShareUrl,
  type CanonicalShareInput
} from "@/lib/share/canonicalShare";
import styles from "./CanonicalShare.module.css";

type ShareGateState = "idle" | "checking" | "allowed" | "denied";

export function CanonicalShareDialog({
  open,
  onOpenChange,
  input
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  input: CanonicalShareInput;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingId = `canonical-share-${useId()}`;
  const [gate, setGate] = useState<ShareGateState>("idle");
  const [status, setStatus] = useState("");
  const [origin, setOrigin] = useState("");

  const payload = useMemo(() => resolveCanonicalSharePayload(input), [input]);
  const shareUrl = useMemo(
    () => origin ? resolveCanonicalShareUrl(origin, payload.publicPath) : "",
    [origin, payload.publicPath]
  );
  const providers = useMemo(
    () => shareUrl ? buildCanonicalShareProviderUrls({ url: shareUrl, text: payload.text }) : null,
    [payload.text, shareUrl]
  );

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }

    setGate("checking");
    setStatus("");
    if (!dialog.open) dialog.showModal();

    const frame = window.requestAnimationFrame(() => headingRef.current?.focus());
    const controller = new AbortController();

    void fetch("/api/parent/share-gate", {
      cache: "no-store",
      signal: controller.signal
    })
      .then(async (response) => {
        if (!response.ok) return { allowed: false };
        return await response.json() as { allowed?: boolean };
      })
      .then((result) => setGate(result.allowed ? "allowed" : "denied"))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setGate("denied");
      });

    return () => {
      controller.abort();
      window.cancelAnimationFrame(frame);
    };
  }, [open]);

  const close = () => {
    dialogRef.current?.close();
    onOpenChange(false);
  };

  const copyLink = async (fallback = false) => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus(fallback ? "Share device tidak tersedia. Link disalin." : "Link tersalin.");
    } catch {
      setStatus("Link belum bisa disalin di browser ini.");
    }
  };

  const nativeShare = async () => {
    if (!shareUrl) return;
    if (!navigator.share) {
      await copyLink(true);
      return;
    }

    try {
      await navigator.share({
        title: payload.title,
        text: payload.text,
        url: shareUrl
      });
      setStatus("Berhasil membuka Share device.");
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      await copyLink(true);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={headingId}
      onClose={() => onOpenChange(false)}
      data-canonical-share="v1"
      data-share-context={payload.context}
      data-share-public-path={payload.publicPath}
      data-share-url={shareUrl || undefined}
      data-share-gate={gate}
    >
      <div className={styles.header}>
        <div>
          <small>Area orang tua</small>
          <h2 ref={headingRef} id={headingId} tabIndex={-1}>Bagikan pencapaian</h2>
        </div>
        <button type="button" className={styles.close} onClick={close} aria-label="Tutup">
          <X size={22} weight="bold" aria-hidden />
        </button>
      </div>

      {gate === "checking" ? <p className={styles.status} role="status">Memeriksa akses orang tua…</p> : null}

      {gate === "denied" ? (
        <div className={styles.parentGate}>
          <p>Fitur berbagi hanya tersedia melalui sesi orang tua.</p>
          <Link href="/parent">Buka Area Orang Tua</Link>
        </div>
      ) : null}

      {gate === "allowed" ? (
        <>
          <p className={styles.safeNote}>{payload.privacyNote}</p>

          <div className={styles.grid} aria-label="Pilihan berbagi">
            <button type="button" onClick={() => void copyLink()} data-share-provider="copy">
              <Copy size={20} aria-hidden />
              Copy link
            </button>
            <button type="button" onClick={() => void nativeShare()} data-share-provider="device">
              <ShareNetwork size={20} aria-hidden />
              Share device
            </button>
            <a href={providers?.whatsapp ?? "#"} target="_blank" rel="noreferrer" data-share-provider="whatsapp">WhatsApp</a>
            <a href={providers?.telegram ?? "#"} target="_blank" rel="noreferrer" data-share-provider="telegram">Telegram</a>
            <a href={providers?.x ?? "#"} target="_blank" rel="noreferrer" data-share-provider="x">X</a>
            <a href={providers?.facebook ?? "#"} target="_blank" rel="noreferrer" data-share-provider="facebook">Facebook</a>
            <a href={providers?.threads ?? "#"} target="_blank" rel="noreferrer" data-share-provider="threads">Threads</a>
          </div>

          <p className={styles.publicTarget}>
            Tautan publik: <code>{payload.publicPath}</code>
          </p>

          {status ? <p className={styles.status} role="status">{status}</p> : null}
        </>
      ) : null}
    </dialog>
  );
}
