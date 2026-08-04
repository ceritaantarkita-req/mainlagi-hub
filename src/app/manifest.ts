import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Motion Learning Hub",
    short_name: "Motion Hub",
    description: "Belajar dengan kamera, gerakan, dan tulisan di udara.",
    start_url: "/",
    display: "standalone",
    background_color: "#eef7ff",
    theme_color: "#0b2d66"
  };
}
