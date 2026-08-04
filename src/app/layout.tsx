import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Motion Learning Hub", template: "%s | Motion Learning Hub" },
  description: "Game edukasi berbasis webcam, air-writing, dan gerakan untuk anak TK sampai SD kelas 2.",
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
