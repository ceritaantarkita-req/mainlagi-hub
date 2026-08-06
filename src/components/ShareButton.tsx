"use client";

import { useState } from "react";

export function ShareButton({ title, text }: { title: string; text: string }) {
  const [open, setOpen] = useState(false);
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); return; } catch { /* fallback */ }
    }
    setOpen((value) => !value);
  };
  const copy = async () => { await navigator.clipboard.writeText(window.location.href); setOpen(false); };
  const encoded = () => encodeURIComponent(window.location.href);
  return <div className="share-wrap"><button className="button button--share" type="button" onClick={() => void share()}>Bagikan</button>{open ? <div className="share-menu"><button onClick={() => void copy()}>Salin link</button><a href={`https://wa.me/?text=${encodeURIComponent(`${text} ${typeof window !== "undefined" ? window.location.href : ""}`)}`} target="_blank" rel="noreferrer">WhatsApp</a><a href={`https://t.me/share/url?url=${encoded()}&text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">Telegram</a></div> : null}</div>;
}
