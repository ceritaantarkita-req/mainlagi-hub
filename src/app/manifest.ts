import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mainlagi Hub — Motion Learning",
    short_name: "Mainlagi Hub",
    description: "Game dan belajar berbasis gerakan tangan dan badan.",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#fbfaf6",
    theme_color: "#0f2344",
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
