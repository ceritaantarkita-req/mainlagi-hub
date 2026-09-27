export type CanonicalShareContext = "belajar" | "world" | "bermain";

export type CanonicalShareInput =
  | {
      context: "belajar";
    }
  | {
      context: "world";
      worldId: string;
      stageTitle?: string;
      final?: boolean;
    }
  | {
      context: "bermain";
      gameSlug: string;
      gameTitle: string;
    };

export interface CanonicalSharePayload {
  context: CanonicalShareContext;
  title: string;
  text: string;
  publicPath: string;
  privacyNote: string;
}

export interface CanonicalShareProviderUrls {
  whatsapp: string;
  telegram: string;
  x: string;
  facebook: string;
  threads: string;
}

function safeSegment(value: string): string {
  return encodeURIComponent(value.trim());
}

export function resolveCanonicalSharePayload(input: CanonicalShareInput): CanonicalSharePayload {
  if (input.context === "world") {
    const worldTitle = input.worldId === "money-festival" ? "Petualangan Uang" : "Mainlagi World";
    const text = input.final
      ? `⭐⭐⭐ ${worldTitle} selesai. Petualangan Mainlagi tuntas!`
      : input.stageTitle
        ? `⭐⭐⭐ Stage “${input.stageTitle}” selesai di Mainlagi!`
        : `⭐⭐⭐ Satu Stage di ${worldTitle} selesai di Mainlagi!`;

    return {
      context: "world",
      title: "Mainlagi",
      text,
      publicPath: `/worlds/${safeSegment(input.worldId)}`,
      privacyNote: "Yang dibagikan hanya pesan umum dan halaman World publik—tanpa nama anak, umur, akun, atau detail progres."
    };
  }

  if (input.context === "bermain") {
    return {
      context: "bermain",
      title: "Mainlagi",
      text: `⭐⭐⭐ ${input.gameTitle} selesai di Mainlagi!`,
      publicPath: `/play/${safeSegment(input.gameSlug)}`,
      privacyNote: "Yang dibagikan hanya pesan umum dan halaman permainan publik—tanpa nama anak, umur, akun, skor pribadi, atau detail progres."
    };
  }

  return {
    context: "belajar",
    title: "Mainlagi",
    text: "Aku baru menyelesaikan permainan di Mainlagi! ⭐⭐⭐",
    publicPath: "/",
    privacyNote: "Yang dibagikan hanya tautan publik Mainlagi dan pesan umum—tanpa nama anak, umur, akun, atau detail progres."
  };
}

export function resolveCanonicalShareUrl(origin: string, publicPath: string): string {
  const parsed = new URL(origin);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Canonical Share requires an http(s) origin.");
  }
  return new URL(publicPath, parsed.origin).toString();
}

export function buildCanonicalShareProviderUrls({
  url,
  text
}: {
  url: string;
  text: string;
}): CanonicalShareProviderUrls {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const encodedCombined = encodeURIComponent(`${text} ${url}`);

  return {
    whatsapp: `https://wa.me/?text=${encodedCombined}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    x: `https://twitter.com/intent/tweet?text=${encodedCombined}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    threads: `https://www.threads.net/intent/post?text=${encodedCombined}`
  };
}
