import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameClient } from "@/components/GameClient";
import { GAME_REGISTRY, isGameId } from "@/engine/registry";

export async function generateMetadata({ params }: { params: Promise<{ gameId: string }> }): Promise<Metadata> {
  const { gameId } = await params;
  if (!isGameId(gameId)) return {};
  return { title: GAME_REGISTRY[gameId].title, description: GAME_REGISTRY[gameId].description };
}

export function generateStaticParams() {
  return Object.keys(GAME_REGISTRY).map((gameId) => ({ gameId }));
}

export default async function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  if (!isGameId(gameId)) notFound();
  return <GameClient gameId={gameId} />;
}
