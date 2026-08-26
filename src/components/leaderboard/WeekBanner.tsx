import { CountdownCompact } from "./CountdownCompact";
import { weekBounds } from "@/lib/week";

function fmt(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}/${date.getFullYear()}`;
}

/**
 * Weekly reset banner. Simple one-line: "Minggu ini, reset sebelum dd/mm/yy"
 * with a compact countdown beside it. Boundary is computed server-side so the
 * client clock cannot shift the target.
 */
export function WeekBanner() {
  const { endsAt } = weekBounds();
  return (
    <div className="week-banner">
      <CountdownCompact endsAt={endsAt.toISOString()} />
      <p className="week-banner__label">
        Reset sebelum <strong>{fmt(endsAt)}</strong>
      </p>
    </div>
  );
}
