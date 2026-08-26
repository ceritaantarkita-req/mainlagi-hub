"use client";

import { useState } from "react";

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.2.1-1.3-.1-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.9 3.4 2.7 11.1c-1 .4-1 1.4 0 1.7l4.6 1.4 1.8 5.6c.3.8 1.1 1 1.8.4l2.6-2.3 4.7 3.4c.8.5 1.6.1 1.8-.8l3-14.7c.2-.9-.5-1.5-1.1-1.4Z" />
    </svg>
  );
}

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
  const wa = `https://wa.me/?text=${encodeURIComponent(`${text} ${typeof window !== "undefined" ? window.location.href : ""}`)}`;
  const tg = `https://t.me/share/url?url=${encoded()}&text=${encodeURIComponent(text)}`;

  return (
    <div className="share-wrap">
      <button className="button button--share" type="button" onClick={() => void share()}>
        Bagikan
      </button>
      {open ? (
        <div className="share-menu">
          <button onClick={() => void copy()}>Salin link</button>
          <a href={wa} target="_blank" rel="noreferrer" aria-label="Bagikan ke WhatsApp">
            <WhatsAppIcon />
          </a>
          <a href={tg} target="_blank" rel="noreferrer" aria-label="Bagikan ke Telegram">
            <TelegramIcon />
          </a>
        </div>
      ) : null}
    </div>
  );
}
