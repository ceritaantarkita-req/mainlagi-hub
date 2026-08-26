import type { GameSlug } from "@/lib/data/games";

function Scene({ slug }: { slug: GameSlug }) {
  switch (slug) {
    case "math-choice":
      return (
        <>
          <text x="62" y="57" className="game-artwork__prompt">3 + 4</text>
          {["5", "7", "6", "8"].map((answer, index) => (
            <g key={answer} transform={`translate(${56 + (index % 2) * 72} ${74 + Math.floor(index / 2) * 38})`}>
              <rect width="58" height="30" rx="9" className={answer === "7" ? "is-focus" : "is-soft"} />
              <text x="29" y="21" textAnchor="middle" className="game-artwork__answer">{answer}</text>
            </g>
          ))}
          <circle cx="173" cy="92" r="9" className="game-artwork__cursor" />
        </>
      );
    case "math-motion-battle":
      return (
        <>
          <text x="70" y="67" className="game-artwork__prompt">8 + 5</text>
          <path d="M56 111c18-29 32 29 53-4s34 27 58-5" className="game-artwork__trail" />
          <text x="181" y="125" className="game-artwork__big-answer">13</text>
          <circle cx="54" cy="111" r="8" className="game-artwork__cursor" />
        </>
      );
    case "number-trace":
      return (
        <>
          <path d="M85 54c7-22 48-21 50 3 2 25-51 37-52 64h58" className="game-artwork__guide" />
          <path d="M85 54c7-22 48-21 50 3-1 17-28 27-42 44" className="game-artwork__trail" />
          <circle cx="93" cy="101" r="9" className="game-artwork__cursor" />
          <path d="m191 79 23 13-10 4 7 15-8 4-7-15-8 8z" className="game-artwork__solid" />
        </>
      );
    case "shape-quest":
      return (
        <>
          <circle cx="92" cy="90" r="45" className="game-artwork__guide" />
          <path d="M92 45a45 45 0 0 1 39 68" className="game-artwork__trail" />
          <circle cx="131" cy="113" r="9" className="game-artwork__cursor" />
          <path d="m176 119 31-57 31 57z" className="game-artwork__soft-shape" />
        </>
      );
    case "pattern-race":
      return (
        <>
          {[0, 1, 2, 3].map((index) => (
            <g key={index} transform={`translate(${48 + index * 53} 80)`}>
              <circle r={13 + index * 2} className={index === 3 ? "game-artwork__guide" : "game-artwork__solid"} />
            </g>
          ))}
          <path d="M45 126h170" className="game-artwork__baseline" />
          <text x="229" y="94" className="game-artwork__question">?</text>
        </>
      );
    case "math-warung":
      return (
        <>
          <path d="M55 69h150l-13-29H68z" className="game-artwork__awning" />
          <path d="M65 70v61h130V70" className="game-artwork__stall" />
          <circle cx="92" cy="91" r="12" className="game-artwork__fruit" />
          <rect x="116" y="79" width="29" height="26" rx="7" className="game-artwork__soft-shape" />
          <rect x="158" y="82" width="22" height="22" rx="5" className="game-artwork__solid" />
          <text x="207" y="126" className="game-artwork__price">Rp</text>
        </>
      );
    case "iqro-motion":
      return (
        <>
          <path d="M49 58c31-13 58-8 81 10v66c-23-18-50-23-81-10z" className="game-artwork__book" />
          <path d="M211 58c-31-13-58-8-81 10v66c23-18 50-23 81-10z" className="game-artwork__book game-artwork__book--right" />
          <path d="M130 68v66" className="game-artwork__baseline" />
          <text x="77" y="107" className="game-artwork__arabic">ب</text>
          <circle cx="90" cy="76" r="6" className="game-artwork__cursor" />
        </>
      );
    case "airboard-presenter":
      return (
        <>
          <rect x="45" y="39" width="170" height="92" rx="13" className="game-artwork__board" />
          <path d="M71 103c22-42 42 18 67-23 14-23 31-3 48-20" className="game-artwork__trail" />
          <path d="M130 132v17m-37 0h74" className="game-artwork__stand" />
          <path d="m201 92 23 13-10 4 7 15-8 4-7-15-8 8z" className="game-artwork__solid" />
        </>
      );
    case "dodge-motion":
      return (
        <>
          <path d="M54 51h43l-21 22zm109 0h43l-21 22z" className="game-artwork__arrow-down" />
          <circle cx="130" cy="70" r="15" className="game-artwork__head" />
          <path d="M130 87v39m0-28-30 17m30-17 25 15m-25 13-25 29m25-29 24 29" className="game-artwork__person" />
          <path d="M47 143h166" className="game-artwork__baseline" />
        </>
      );
    case "run-to-target":
      return (
        <>
          <circle cx="194" cy="80" r="47" className="game-artwork__target-ring" />
          <circle cx="194" cy="80" r="28" className="game-artwork__target-ring" />
          <circle cx="194" cy="80" r="9" className="game-artwork__solid" />
          <circle cx="75" cy="73" r="13" className="game-artwork__head" />
          <path d="M75 88v31m0-21-21 15m21-15 18 11m-18 10-17 25m17-25 19 25" className="game-artwork__person" />
          <path d="M99 116c28 6 42-5 61-21" className="game-artwork__route" />
        </>
      );
  }
}

export function GameArtwork({ slug, label }: { slug: GameSlug; label?: string }) {
  return (
    <svg
      className="game-artwork"
      viewBox="0 0 260 180"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <circle cx="28" cy="29" r="5" className="game-artwork__dot" />
      <circle cx="45" cy="29" r="5" className="game-artwork__dot" />
      <path d="M61 29h54" className="game-artwork__chrome" />
      <Scene slug={slug} />
    </svg>
  );
}
