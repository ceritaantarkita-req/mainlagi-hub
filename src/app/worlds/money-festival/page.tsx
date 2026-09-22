import type { Metadata } from "next";
import { MoneyWorldPublicLanding } from "@/components/learning/world-v2/MoneyWorldExperience";
import { MONEY_WORLD_SOCIAL_CARD } from "@/lib/learning/world/moneyWorldSocial";

const title = "Petualangan Uang — Mainlagi World";
const description = MONEY_WORLD_SOCIAL_CARD.description;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/worlds/money-festival",
    images: [
      {
        url: MONEY_WORLD_SOCIAL_CARD.path,
        width: MONEY_WORLD_SOCIAL_CARD.width,
        height: MONEY_WORLD_SOCIAL_CARD.height,
        alt: MONEY_WORLD_SOCIAL_CARD.alt
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [MONEY_WORLD_SOCIAL_CARD.path]
  }
};

export default function MoneyWorldPublicPage() {
  return <MoneyWorldPublicLanding />;
}
