import type { ReactNode, SVGProps } from "react";

/**
 * Single-stroke system icons.
 *
 * One stroke weight, one viewBox, `currentColor` so each consumer tints them.
 * These are the navigation/UI glyphs. They are deliberately generic and
 * geometric - not per-game mascots. Use them for tabs, links and actions.
 */

export type IconName =
  | "home"
  | "games"
  | "discover"
  | "leaderboards"
  | "account"
  | "settings"
  | "globe"
  | "sun"
  | "moon"
  | "lock"
  | "share"
  | "arrow"
  | "back"
  | "close"
  | "star"
  | "camera"
  | "check"
  | "dots"
  | "activity"
  | "doc"
  | "tag"
  | "grid"
  | "trash"
  | "eye"
  | "bold"
  | "italic"
  | "list"
  | "listOrdered"
  | "quote"
  | "link"
  | "image"
  | "heading";

const PATHS: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M3.5 10.5 12 3.5l8.5 7" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M9.5 20v-6h5v6" />
    </>
  ),
  games: (
    <>
      <rect x="3" y="7" width="18" height="12" rx="4" />
      <path d="M7.5 11v3M6 12.5h3" />
      <circle cx="16" cy="11.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="17.8" cy="13.8" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  discover: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </>
  ),
  leaderboards: (
    <>
      <path d="M7 4h10v5a5 5 0 0 1-10 0Z" />
      <path d="M7 5H4.5a3 3 0 0 0 3 4.6M17 5h2.5a3 3 0 0 1-3 4.6" />
      <path d="M12 14v3.5M8.5 20.5h7M9.5 17.5h5" />
    </>
  ),
  account: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20c1.2-3.5 4-5 7.5-5s6.3 1.5 7.5 5" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.3 2.5 14.7 0 17M12 3.5c-2.5 2.3-2.5 14.7 0 17" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19" />
    </>
  ),
  moon: <path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5Z" />,
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </>
  ),
  share: (
    <>
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="6" r="2.4" />
      <circle cx="18" cy="18" r="2.4" />
      <path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" />
    </>
  ),
  arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
  back: <path d="M20 12H5M11 6l-6 6 6 6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  star: (
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9Z" />
  ),
  camera: (
    <>
      <rect x="3" y="6.5" width="13" height="11" rx="2.5" />
      <path d="M16 10.5 21 8v8l-5-2.5" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  dots: (
    <>
      <circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  activity: (
    <>
      <path d="M3.5 13h4l2.2-6.5L13 18l2.4-9.5 1.6 4.5h3.5" />
    </>
  ),
  doc: (
    <>
      <path d="M7 3.5h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5v4h4" />
      <path d="M9 13h6M9 16.5h6" />
    </>
  ),
  tag: (
    <>
      <path d="M11.5 3.5h5.8a1 1 0 0 1 1 1v5.8a1 1 0 0 1-.3.7l-8.4 8.4a1 1 0 0 1-1.4 0l-5.8-5.8a1 1 0 0 1 0-1.4l8.4-8.4a1 1 0 0 1 .7-.3Z" />
      <circle cx="15.5" cy="8" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.8" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.8" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.8" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1.8" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2" />
      <path d="M6.5 7 7.3 19a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9L17.5 7" />
      <path d="M10.3 10.5v6.5M13.7 10.5v6.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  bold: (
    <path d="M6.5 4.5h6.2a3.6 3.6 0 0 1 0 7.2H6.5Zm0 7.2h6.9a3.8 3.8 0 0 1 0 7.6H6.5Z" />
  ),
  italic: <path d="M11 4.5h6M7 19.5h6M14 4.5 10 19.5" />,
  list: (
    <>
      <circle cx="4.5" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4.5" cy="18" r="1" fill="currentColor" stroke="none" />
      <path d="M9 6h11M9 12h11M9 18h11" />
    </>
  ),
  listOrdered: (
    <>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="M4 5.5v3M4 8.5H5.5M3.5 14.5h2l-2 2.5h2M3.5 19.5h2" />
    </>
  ),
  quote: (
    <>
      <path d="M6 8.5a3 3 0 0 0-1 5.7v2.3H2.5V13a5.2 5.2 0 0 1 3.5-6.9Z" />
      <path d="M15.5 8.5a3 3 0 0 0-1 5.7v2.3H12V13a5.2 5.2 0 0 1 3.5-6.9Z" />
    </>
  ),
  link: (
    <>
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M11 6.5 13 4.5a3.5 3.5 0 0 1 5 5l-2 2M13 17.5l-2 2a3.5 3.5 0 0 1-5-5l2-2" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="9" cy="10" r="1.6" fill="currentColor" stroke="none" />
      <path d="m5.5 17 4.5-5 3.5 3.5 2-2 3 3.5" />
    </>
  ),
  heading: <path d="M5 5v14M15 5v14M5 12h10M19 8v10" />
};

export function Icon({
  name,
  size = 24,
  strokeWidth = 1.8,
  ...props
}: { name: IconName; size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {PATHS[name]}
    </svg>
  );
}
