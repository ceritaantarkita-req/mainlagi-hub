import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/noto-sans";
import "./globals.css";
import "./modules.css";
import { AppShell } from "@/components/AppShell";
import { ThemeProvider } from "@/components/ThemeProvider";

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
  themeColor: "#08152c"
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mainlagi Hub — Motion Learning",
    template: "%s | Mainlagi Hub"
  },
  description:
    "10 game interaktif gerakan tangan & tubuh — ajak anak belajar matematika, huruf Hijaiyah, dan aktif bergerak lewat kamera laptop atau HP.",
  applicationName: "Mainlagi Hub",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mainlagi Hub"
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    title: "Mainlagi Hub — Motion Learning",
    description: "10 game interaktif gerakan tangan & tubuh — ajak anak belajar matematika, huruf Hijaiyah, dan aktif bergerak lewat kamera laptop atau HP.",
    url: siteUrl,
    siteName: "Mainlagi Hub",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Mainlagi Hub — Motion Learning" }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mainlagi Hub — Motion Learning",
    description: "10 game interaktif gerakan tangan & tubuh — ajak anak belajar matematika, huruf Hijaiyah, dan aktif bergerak lewat kamera laptop atau HP.",
    images: ["/og/home.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
