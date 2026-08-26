"use client";

import { useEffect, useMemo, useState } from "react";

function format(delta: number) {
  const d = Math.max(0, Math.floor(delta / 86_400_000));
  const h = Math.max(0, Math.floor(delta / 3_600_000) % 24);
  const m = Math.max(0, Math.floor(delta / 60_000) % 60);
  const s = Math.max(0, Math.floor(delta / 1000) % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return { d, h, m, s, pad };
}

/**
 * Compact single-line countdown, e.g. "1d 04h 35m 16s".
 *
 * Renders a stable placeholder until it mounts on the client, so the server
 * HTML and the client HTML match (no hydration error). The countdown only
 * starts ticking after mount, using the client clock against the server-sent
 * `endsAt`.
 */
export function CountdownCompact({ endsAt }: { endsAt: string }) {
  const until = useMemo(() => new Date(endsAt).getTime(), [endsAt]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const first = window.setTimeout(() => setNow(Date.now()), 0);
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [until]);

  if (now === null) {
    return (
      <span className="countdown-compact" aria-live="off">
        <strong>--d</strong> <span>--h</span> <span>--m</span> <span>--s</span>
      </span>
    );
  }

  const { d, h, m, s, pad } = format(until - now);
  return (
    <span className="countdown-compact" aria-live="off">
      <strong>{d}d</strong> <span>{pad(h)}h</span> <span>{pad(m)}m</span>{" "}
      <span>{pad(s)}s</span>
    </span>
  );
}
