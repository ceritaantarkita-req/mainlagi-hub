import type { Metadata } from "next";
import { MoneyWorldPublicLanding } from "@/components/learning/world-v2/MoneyWorldExperience";

const title = "Petualangan Uang — Mainlagi World";
const description = "Bantu Gian dan Naya menyiapkan Festival Mainlagi lewat cerita, audio, dan mini-game tentang harga, pilihan, menabung, dan risiko.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/worlds/money-festival",
    images: [
      {
        url: "/og/math-warung.png",
        width: 1200,
        height: 630,
        alt: "Petualangan Uang — Mainlagi World"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og/math-warung.png"]
  }
};

export default function MoneyWorldPublicPage() {
  return <MoneyWorldPublicLanding />;
}
