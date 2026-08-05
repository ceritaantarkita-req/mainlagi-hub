/**
 * Companion applications reachable from the hub.
 *
 * These are the four standalone products - AirBoard Presenter, Iqro Motion,
 * Math Motion Battle and Math Warung - surfaced inside the hub as launchable
 * entries. They are deliberately NOT copied in: each remains its own repository,
 * its own deployment and its own sellable product. The hub only needs to know
 * where each one lives, which is supplied per environment so the same build
 * works on localhost, on staging and on production subdomains.
 */

export type CompanionAppId =
  | "airboard-presenter"
  | "iqro-motion"
  | "math-motion-battle"
  | "math-warung";

export interface CompanionApp {
  id: CompanionAppId;
  title: string;
  tagline: string;
  description: string;
  audience: string;
  accent: "blue" | "green" | "orange" | "purple" | "pink";
  /** Where the standalone deployment lives. Empty means "not configured yet". */
  url: string;
  /** Shown when no URL is configured, so the card explains itself. */
  repository: string;
  capabilities: string[];
}

function envUrl(value: string | undefined, fallback: string): string {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed.replace(/\/+$/, "") : fallback;
}

export function getCompanionApps(): CompanionApp[] {
  return [
    {
      id: "math-motion-battle",
      title: "Math Motion Battle",
      tagline: "Duel matematika dua pemain",
      description:
        "Adu cepat menjawab tambah, kurang, kali, dan bagi dengan menulis angka di udara. Layar terbagi dua, satu kamera.",
      audience: "TK - SD kelas 2",
      accent: "blue",
      url: envUrl(process.env.NEXT_PUBLIC_APP_MATH_MOTION_BATTLE, ""),
      repository: "ceritaantarkita-req/math-motion-battle",
      capabilities: ["Hand tracking", "Tulis angka di udara", "2 pemain", "Soal acak"]
    },
    {
      id: "math-warung",
      title: "Math Warung",
      tagline: "Belajar berhitung lewat jual beli",
      description:
        "Anak jadi pembeli, orang tua jadi kasir. Berhitung uang dan kembalian dengan menulis angka di udara.",
      audience: "TK - SD kelas 2",
      accent: "orange",
      url: envUrl(process.env.NEXT_PUBLIC_APP_MATH_WARUNG, ""),
      repository: "ceritaantarkita-req/math-warung-fullstack",
      capabilities: ["Hand tracking", "Mode keluarga", "Tema warung", "Tanpa dependensi"]
    },
    {
      id: "iqro-motion",
      title: "Iqro Motion",
      tagline: "Latihan huruf hijaiyah dengan gerakan",
      description:
        "Menelusuri dan menulis huruf hijaiyah dengan telunjuk, lengkap dengan panduan titik dan pelafalan.",
      audience: "TK - SD",
      accent: "green",
      url: envUrl(process.env.NEXT_PUBLIC_APP_IQRO_MOTION, ""),
      repository: "ceritaantarkita-req/iqro-motion",
      capabilities: ["Hand tracking", "Tracing berpanduan", "28 huruf", "Mode orang tua"]
    },
    {
      id: "airboard-presenter",
      title: "AirBoard Presenter",
      tagline: "Presentasi dan papan tulis tanpa sentuh",
      description:
        "Kendalikan slide PDF dan papan tulis vektor dengan gesture tangan. Ada jendela audiens dan perekam layar.",
      audience: "Guru dan presenter",
      accent: "purple",
      url: envUrl(process.env.NEXT_PUBLIC_APP_AIRBOARD_PRESENTER, ""),
      repository: "ceritaantarkita-req/airboard-presenter",
      capabilities: ["Gesture control", "PDF + whiteboard", "Jendela audiens", "Rekam layar"]
    }
  ];
}

export function getCompanionApp(id: string): CompanionApp | null {
  return getCompanionApps().find((app) => app.id === id) ?? null;
}

export function isCompanionAppId(value: string): value is CompanionAppId {
  return getCompanionApps().some((app) => app.id === value);
}
