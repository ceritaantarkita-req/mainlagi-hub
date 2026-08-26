import type { GameDefinition } from "@/lib/data/games";

/**
 * Game icons.
 *
 * Redrawn as filled, high-contrast pictograms. The previous set was thin
 * single-weight line art at `currentColor`, which on a small card read as grey
 * scribble - and several were simply the wrong picture for the game: Pattern
 * Race showed unrelated shapes, Shape Quest showed four shapes at once with no
 * focus, and AirBoard's icon was a television.
 *
 * Each icon now has one clear subject, a filled backing shape for weight, and a
 * two-tone treatment so it stays legible at 32 px on a phone. `currentColor`
 * carries the game's accent; the backing uses the same colour at low opacity.
 */
export function GameIcon({
  name,
  size = 54
}: {
  name: GameDefinition["icon"];
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 64 64",
    fill: "none",
    "aria-hidden": true
  } as const;

  switch (name) {
    // Arithmetic written in the air: a numeral plus operators.
    case "math":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="56" height="56" rx="18" fill="currentColor" opacity=".16" />
          <path d="M14 20h12M20 14v12" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <path d="M38 18h12" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <path d="M38 42h12M44 36v12" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <path d="M14 40h12" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <circle cx="20" cy="46" r="3" fill="currentColor" />
          <circle cx="20" cy="34" r="3" fill="currentColor" />
        </svg>
      );

    // Four answer boxes with one picked - the whole point of the game.
    case "choice":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="56" height="56" rx="18" fill="currentColor" opacity=".16" />
          <rect x="12" y="12" width="18" height="18" rx="5" fill="currentColor" opacity=".4" />
          <rect x="34" y="12" width="18" height="18" rx="5" fill="currentColor" opacity=".4" />
          <rect x="12" y="34" width="18" height="18" rx="5" fill="currentColor" opacity=".4" />
          <rect x="34" y="34" width="18" height="18" rx="5" fill="currentColor" />
          <path
            d="M37.5 43.5l3.5 3.5 7.5-7.5"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );

    // Following a dotted numeral with a fingertip.
    case "trace":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="56" height="56" rx="18" fill="currentColor" opacity=".16" />
          <path
            d="M24 20c0-4 4-7 8-7s8 3 8 8c0 9-16 12-16 22h17"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="1 9"
          />
          <circle cx="24" cy="20" r="4" fill="currentColor" />
          <path d="M40 40l10 6-4 2 3 6-3 2-3-6-3 3z" fill="currentColor" />
        </svg>
      );

    // One shape being drawn, not a pile of shapes.
    case "shape":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="56" height="56" rx="18" fill="currentColor" opacity=".16" />
          <path d="M32 14l16 28H16z" fill="currentColor" opacity=".45" />
          <path
            d="M32 14l16 28H16z"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinejoin="round"
            strokeDasharray="7 6"
          />
          <circle cx="32" cy="14" r="5" fill="currentColor" />
        </svg>
      );

    // A sequence with the next item missing - that is what a pattern game is.
    case "pattern":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="56" height="56" rx="18" fill="currentColor" opacity=".16" />
          <circle cx="16" cy="32" r="6" fill="currentColor" />
          <circle cx="32" cy="32" r="6" fill="currentColor" opacity=".65" />
          <circle cx="48" cy="32" r="6" fill="currentColor" opacity=".3" />
          <circle
            cx="48"
            cy="32"
            r="8.5"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeDasharray="4 5"
          />
        </svg>
      );

    // A market stall with a price tag.
    case "shop":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="56" height="56" rx="18" fill="currentColor" opacity=".16" />
          <path d="M12 24l4-10h32l4 10z" fill="currentColor" opacity=".5" />
          <path d="M12 24l4-10h32l4 10z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
          <path d="M16 24v24h32V24" stroke="currentColor" strokeWidth="4.5" strokeLinejoin="round" />
          <path d="M27 48V34h10v14" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      );

    // An open book with a script mark - Iqro, not a generic book.
    case "iqro":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="56" height="56" rx="18" fill="currentColor" opacity=".16" />
          <path
            d="M32 20c-6-4-12-4-18-1v26c6-3 12-3 18 1 6-4 12-4 18-1V19c-6-3-12-3-18 1z"
            fill="currentColor"
            opacity=".35"
          />
          <path
            d="M32 20c-6-4-12-4-18-1v26c6-3 12-3 18 1 6-4 12-4 18-1V19c-6-3-12-3-18 1zM32 20v26"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <circle cx="41" cy="30" r="2.6" fill="currentColor" />
        </svg>
      );

    // A presentation board with a pen, not a television.
    case "board":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="56" height="56" rx="18" fill="currentColor" opacity=".16" />
          <rect x="12" y="14" width="40" height="28" rx="5" fill="currentColor" opacity=".35" />
          <rect x="12" y="14" width="40" height="28" rx="5" stroke="currentColor" strokeWidth="4" />
          <path d="M20 34c5-10 10-14 15-9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <path d="M32 42v8M24 54l8-4 8 4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // A figure leaning aside to dodge something.
    case "dodge":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="56" height="56" rx="18" fill="currentColor" opacity=".16" />
          <circle cx="26" cy="17" r="6" fill="currentColor" />
          <path
            d="M26 24v13M26 29l-9 6M26 29l9 4M26 37l-7 13M26 37l8 13"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path d="M46 16v32" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity=".5" strokeDasharray="6 7" />
        </svg>
      );

    // A target with an arrow already in it.
    case "target":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="56" height="56" rx="18" fill="currentColor" opacity=".16" />
          <circle cx="32" cy="32" r="19" stroke="currentColor" strokeWidth="4.5" />
          <circle cx="32" cy="32" r="10" stroke="currentColor" strokeWidth="4.5" opacity=".6" />
          <circle cx="32" cy="32" r="4" fill="currentColor" />
          <path d="M46 18L34 30" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M44 12l8 0 0 8z" fill="currentColor" />
        </svg>
      );
  }
}
