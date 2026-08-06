import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameShell } from "@/components/GameShell";
import { GAMES, isGameSlug } from "@/lib/data/games";

export function generateStaticParams() { return Object.keys(GAMES).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; if (!isGameSlug(slug)) return {}; const game = GAMES[slug]; return { title: game.title, description: game.description, openGraph: { title: `${game.title} — Mainlagi TV`, description: game.description, images: [{ url: `/og/${game.slug}.png`, width: 1200, height: 630 }] } }; }
export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; if (!isGameSlug(slug)) notFound(); return <GameShell game={GAMES[slug]} />; }
