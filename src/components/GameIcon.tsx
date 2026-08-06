import type { GameDefinition } from "@/lib/data/games";

export function GameIcon({ name, size = 54 }: { name: GameDefinition["icon"]; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 64 64", fill: "none", "aria-hidden": true } as const;
  switch (name) {
    case "math":
      return <svg {...common}><rect x="8" y="8" width="48" height="48" rx="16" fill="currentColor" opacity=".14"/><path d="M19 25h12M25 19v12M38 23h9M38 37h9M18 42l12-12M18 30l12 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>;
    case "trace":
      return <svg {...common}><path d="M18 48c6-20 12-31 23-31 7 0 10 5 10 10 0 14-21 9-24 22" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeDasharray="7 7"/><circle cx="18" cy="48" r="5" fill="currentColor"/><circle cx="43" cy="17" r="5" fill="currentColor"/></svg>;
    case "shape":
      return <svg {...common}><circle cx="19" cy="20" r="10" stroke="currentColor" strokeWidth="4"/><path d="M45 10l11 20H34z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/><rect x="13" y="38" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="4"/><path d="M43 41h13v13H43z" fill="currentColor" opacity=".22"/></svg>;
    case "pattern":
      return <svg {...common}><circle cx="14" cy="32" r="7" fill="currentColor"/><rect x="27" y="25" width="14" height="14" rx="3" fill="currentColor" opacity=".55"/><path d="M50 23l8 15H42z" fill="currentColor"/><path d="M9 49h46" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 8"/></svg>;
    case "shop":
      return <svg {...common}><path d="M10 25h44l-4-12H14z" fill="currentColor" opacity=".22"/><path d="M14 25v28h36V25M20 25v8M29 25v8M38 25v8M47 25v8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/><path d="M23 53V40h18v13" stroke="currentColor" strokeWidth="4"/></svg>;
    case "iqro":
      return <svg {...common}><path d="M13 18c10-6 20-6 30 0v32c-10-6-20-6-30 0z" fill="currentColor" opacity=".2"/><path d="M51 18c-10-6-20-6-30 0v32c10-6 20-6 30 0z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/><path d="M35 24c6 0 9 3 9 8s-4 8-10 8h-4" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/><circle cx="38" cy="20" r="2.5" fill="currentColor"/></svg>;
    case "board":
      return <svg {...common}><rect x="8" y="11" width="48" height="35" rx="6" stroke="currentColor" strokeWidth="4"/><path d="M18 54l9-8M46 54l-9-8M20 24h24M20 33h15" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>;
    case "dodge":
      return <svg {...common}><circle cx="32" cy="10" r="6" fill="currentColor"/><path d="M32 18v18M32 25l-12 9M32 25l12 9M32 36l-10 18M32 36l10 18" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/><path d="M8 16h10M46 16h10M6 46h9M49 46h9" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>;
    case "target":
      return <svg {...common}><circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="4"/><circle cx="32" cy="32" r="14" stroke="currentColor" strokeWidth="4"/><circle cx="32" cy="32" r="5" fill="currentColor"/><path d="M32 2v9M32 53v9M2 32h9M53 32h9" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>;
  }
}
