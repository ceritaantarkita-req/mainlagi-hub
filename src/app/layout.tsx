import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Mainlagi TV — Motion Learning Hub", template: "%s | Mainlagi TV" },
  description: "Sembilan game dan alat interaktif berbasis gerakan tangan dan tubuh dalam satu Motion Learning Hub.",
  openGraph: {
    title: "Mainlagi TV — Motion Learning Hub",
    description: "Belajar, bergerak, dan bermain langsung dengan kamera.",
    url: siteUrl,
    siteName: "Mainlagi TV",
    images: [{ url: "/og/home.png", width: 1200, height: 630 }],
    type: "website"
  },
  twitter: { card: "summary_large_image", images: ["/og/home.png"] }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body>{children}</body></html>;
}
