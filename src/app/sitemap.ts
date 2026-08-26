import type { MetadataRoute } from "next";
import { GAME_LIST } from "@/lib/data/games";
import { ARTICLES } from "@/lib/data/content";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_PRIORITY: Record<string, number> = {
  "": 1,
  "/games": 0.8,
  "/discover": 0.7,
  "/discover/articles": 0.7,
  "/leaderboards": 0.6
};

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/games",
    "/discover",
    "/discover/articles",
    "/discover/products",
    "/leaderboards",
    "/about",
    "/faq",
    "/privacy",
    "/terms",
    "/cookie-policy",
    "/parental-consent",
    "/data-request"
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
      priority: STATIC_PRIORITY[path] ?? 0.5
    })),
    ...GAME_LIST.map((game) => ({
      url: `${base}/games/${game.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7
    })),
    ...GAME_LIST.map((game) => ({
      url: `${base}/leaderboards/${game.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5
    })),
    ...ARTICLES.map((article) => ({
      url: `${base}/discover/articles/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6
    }))
  ];
}
