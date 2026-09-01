import Link from "next/link";

/**
 * Plain server-rendered pill group: each option is a link to the same page
 * with a `?days=` query param. No client JS needed -- the page reads
 * searchParams and refetches, so this works even with JS disabled.
 */
export function RangeFilter({
  current,
  options,
  basePath
}: {
  current: number;
  options: readonly number[];
  basePath: string;
}) {
  return (
    <div className="admin-range-filter" role="group" aria-label="Rentang waktu">
      {options.map((opt) => (
        <Link
          key={opt}
          href={`${basePath}?days=${opt}`}
          className={opt === current ? "is-active" : undefined}
          aria-current={opt === current ? "true" : undefined}
        >
          {opt} hari
        </Link>
      ))}
    </div>
  );
}
