export type MainlagiGlobalMenuItem = {
  href: string;
  label: string;
  description: string;
  current: boolean;
  dataShopSlot?: string;
};

function childBase(childId?: string | null) {
  const normalized = childId?.trim();
  return normalized ? `/child/${encodeURIComponent(normalized)}` : null;
}

export const MAINLAGI_GLOBAL_MENU_LABELS = [
  "Beranda",
  "Belajar",
  "Bermain",
  "World",
  "Shop",
  "Bacaan & ide",
  "Area orang tua",
  "Tentang Mainlagi"
] as const;

export function buildMainlagiGlobalMenu({
  pathname,
  childId
}: {
  pathname: string;
  childId?: string | null;
}): MainlagiGlobalMenuItem[] {
  const base = childBase(childId);
  const path = pathname || "/";

  const isChildBelajar =
    Boolean(base) &&
    path.startsWith(base!) &&
    !path.startsWith(`${base}/games`) &&
    !path.startsWith(`${base}/world`) &&
    !path.startsWith(`${base}/worlds`);

  return [
    {
      href: "/",
      label: "Beranda",
      description: "Halaman utama Mainlagi",
      current: path === "/"
    },
    {
      href: base ? `${base}/home` : "/child/select?continue=1",
      label: "Belajar",
      description: "Belajar dan lanjutkan perjalanan",
      current: Boolean(isChildBelajar)
    },
    {
      href: base ? `${base}/games` : "/games",
      label: "Bermain",
      description: "Main Gerak dan permainan Mainlagi",
      current: base ? path.startsWith(`${base}/games`) : path.startsWith("/games") || path.startsWith("/play/")
    },
    {
      href: base ? `${base}/worlds` : "/child/select?continue=1",
      label: "World",
      description: "Petualangan Mainlagi",
      current: base ? path.startsWith(`${base}/world`) || path.startsWith(`${base}/worlds`) : path.startsWith("/worlds")
    },
    {
      href: "/shop/parent-entry",
      label: "Shop",
      description: "Buka bersama orang tua",
      current: path.startsWith("/shop"),
      dataShopSlot: "parent-gated"
    },
    {
      href: "/discover",
      label: "Bacaan & ide",
      description: "Artikel dan ide aktivitas keluarga",
      current: path.startsWith("/discover")
    },
    {
      href: "/parent",
      label: "Area orang tua",
      description: "Ringkasan, profil anak, privasi, dan pengaturan",
      current: path.startsWith("/parent") || path.startsWith("/account")
    },
    {
      href: "/about",
      label: "Tentang Mainlagi",
      description: "Kenali Mainlagi lebih dekat",
      current: path === "/about" || path === "/account/about"
    }
  ];
}
