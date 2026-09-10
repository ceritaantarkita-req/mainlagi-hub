import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/noto-sans";
import "./globals.css";
import "./modules.css";
import { AppShell } from "@/components/AppShell";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LearningCloudOutboxBridge } from "@/components/learning/LearningCloudOutboxBridge";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const themeScript = `
  try {
    const saved = localStorage.getItem("mainlagi-theme");
    const dark = saved === "dark" || (saved !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch {}
`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1ec9a6"
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mainlagi — Belajar & Main untuk Anak",
    template: "%s | Mainlagi"
  },
  description:
    "Platform belajar anak usia 3–7 tahun yang mobile-first: Bahasa Indonesia, English, Matematika, Iqro, Mewarnai, serta 10 game gerak opsional yang tetap bisa dimainkan.",
  applicationName: "Mainlagi",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mainlagi"
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    title: "Mainlagi — Belajar & Main untuk Anak",
    description: "Belajar nyaman di HP lewat sentuh, audio, trace, warna, dan game gerak opsional.",
    url: siteUrl,
    siteName: "Mainlagi",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Mainlagi — Belajar & Main untuk Anak" }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mainlagi — Belajar & Main untuk Anak",
    description: "Belajar nyaman di HP lewat sentuh, audio, trace, warna, dan game gerak opsional.",
    images: ["/og/home.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <LearningCloudOutboxBridge />
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
