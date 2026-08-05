import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameClient } from "@/components/GameClient";
import { QuizGame } from "@/components/QuizGame";
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
  // The quiz selects instead of writing, so it does not share the
  // challenge/session machinery the writing games are built on.
  if (gameId === "pilih-jawaban") return <QuizGame />;
  return <GameClient gameId={gameId} />;
}
