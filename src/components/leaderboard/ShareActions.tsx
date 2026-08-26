"use client";

import { useState } from "react";

export interface ShareTarget {
  name: string;
  game: string;
  score: number;
  rank: number;
  weekKey: string;
  href: string;
}

const SITE = "Mainlagi Hub";

function text(t: ShareTarget): string {
  return `${t.name} finis peringkat #${t.rank} dengan ${t.score} poin di ${t.game} (${t.weekKey}) — ${SITE}`;
}

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {children}
    </svg>
  );
}

function Brush({ children }: { children: React.ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

function Ic({ type }: { type: "wa" | "tg" | "tiktok" | "threads" | "share" | "copy" | "check" }) {
  if (type === "share") {
    return (
      <Brush>
        <circle cx="6" cy="12" r="2.4" />
        <circle cx="18" cy="6" r="2.4" />
        <circle cx="18" cy="18" r="2.4" />
        <path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" />
      </Brush>
    );
  }
  if (type === "copy") {
    return (
      <Brush>
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15V5.5A1.5 1.5 0 0 1 6.5 4H15" />
      </Brush>
    );
  }
  if (type === "check") {
    return (
      <Brush>
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </Brush>
    );
  }
  if (type === "wa") {
    return (
      <Svg>
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.2.1-1.3-.1-.1-.2-.2-.4-.3Z" />
      </Svg>
    );
  }
  if (type === "tg") {
    return (
      <Svg>
        <path d="M21.9 3.4 2.7 11.1c-1 .4-1 1.4 0 1.7l4.6 1.4 1.8 5.6c.3.8 1.1 1 1.8.4l2.6-2.3 4.7 3.4c.8.5 1.6.1 1.8-.8l3-14.7c.2-.9-.5-1.5-1.1-1.4Z" />
      </Svg>
    );
  }
  if (type === "tiktok") {
    return (
      <Svg>
        <path d="M19.32 5.56a4.5 4.5 0 0 1-2.9-4.06H13v12.9a2.32 2.32 0 1 1-2.32-2.32c.26 0 .51.04.74.12V10.8a5.9 5.9 0 0 0-.74-.05 5.34 5.34 0 1 0 5.34 5.34V9.86a7.9 7.9 0 0 0 4.05 1.09v-4.3c-.35 0-.7-.04-1.04-.12l-.01 0Z" />
      </Svg>
    );
  }
  return (
    <Svg>
      <path d="M12 2.3a8.3 8.3 0 0 1 8.3 8.2A8.3 8.3 0 1 1 4 10.5 8.3 8.3 0 0 1 12 2.3Zm2.6 4.3a1.6 1.6 0 0 0-.3 1.5 1.7 1.7 0 0 0 2.3.7 1.6 1.6 0 0 0 .7-2.2 1.7 1.7 0 0 0-2.7 0Zm-7 8.4a8.2 8.2 0 0 0 4.9 1.9 8.4 8.4 0 0 0 4.4-1.2c-.3.1-2.6.6-4.6-.3a5 5 0 0 1-4.7-.4Z" />
    </Svg>
  );
}

/**
 * Icon-only share actions: Share link / WhatsApp / Telegram / TikTok / Threads / Copy.
 * TikTok and Threads fall back to copying the link (no public web share scheme).
 */
export function ShareActions({
  target,
  onDone
}: {
  target: ShareTarget;
  onDone?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.origin + target.href : target.href;
  const shareBody = `${text(target)}\n${url}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(shareBody)}`;
  const tg = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text(target))}`;

  const copy = async () => {
    await navigator.clipboard.writeText(shareBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Mainlagi Hub", text: text(target), url });
        onDone?.();
        return;
      } catch {
        /* fall through */
      }
    }
    await copy();
  };

  const actions = [
    { key: "share", label: "Share link", onClick: () => void nativeShare(), icon: <Ic type="share" /> },
    { key: "wa", label: "WhatsApp", onClick: () => { window.open(wa, "_blank"); onDone?.(); }, icon: <Ic type="wa" /> },
    { key: "tg", label: "Telegram", onClick: () => { window.open(tg, "_blank"); onDone?.(); }, icon: <Ic type="tg" /> },
    { key: "tiktok", label: "TikTok", onClick: () => void copy(), icon: <Ic type="tiktok" /> },
    { key: "threads", label: "Threads", onClick: () => void copy(), icon: <Ic type="threads" /> },
    { key: "copy", label: copied ? "Tersalin" : "Copy", onClick: () => void copy(), icon: <Ic type={copied ? "check" : "copy"} /> }
  ];

  return (
    <div className="share-actions">
      {actions.map((action) => (
        <button
          key={action.key}
          type="button"
          className="share-action"
          onClick={action.onClick}
          aria-label={action.label}
          title={action.label}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
}
