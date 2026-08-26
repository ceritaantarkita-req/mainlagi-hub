"use client";

import { useEffect, useState } from "react";

function remaining(until: number): { d: number; h: number; m: number; s: number } {
  const delta = Math.max(0, until - Date.now());
  return {
    d: Math.floor(delta / 86_400_000),
    h: Math.floor(delta / 3_600_000) % 24,
    m: Math.floor(delta / 60_000) % 60,
    s: Math.floor(delta / 1000) % 60
  };
}

/**
 * Ticks down to a server-provided timestamp. When it reaches zero it stays at
 * zero; the parent re-renders the week window on the next navigation.
 */
export function Countdown({ endsAt }: { endsAt: string }) {
  const until = new Date(endsAt).getTime();
  const [time, setTime] = useState(() => remaining(until));

  useEffect(() => {
    const frame = window.setInterval(() => setTime(remaining(until)), 1000);
    return () => window.clearInterval(frame);
  }, [until]);

  const pad = (n: number) => String(n).padStart(2, "0");
  const parts = [
    { value: String(time.d), label: "hari" },
    { value: pad(time.h), label: "jam" },
    { value: pad(time.m), label: "mnt" },
    { value: pad(time.s), label: "dtn" }
  ];

  return (
    <div className="countdown" aria-live="off">
      {parts.map((part) => (
        <span key={part.label} className="countdown__part">
          <strong>{part.value}</strong>
          <small>{part.label}</small>
        </span>
      ))}
    </div>
  );
}
