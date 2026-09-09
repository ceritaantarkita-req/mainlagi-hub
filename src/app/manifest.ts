import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mainlagi — Belajar & Main untuk Anak",
    short_name: "Mainlagi",
    description: "Platform belajar anak mobile-first dengan sentuh, audio, trace, warna, dan game gerak opsional.",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#f8fbff",
    theme_color: "#1ec9a6",
    categories: ["education", "games", "kids"],
    icons: [
      {
        src: "/brand/mainlagi-square.png",
        sizes: "1080x1080",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
