"use client";

import { useEffect, useRef } from "react";
import type { GameSlug } from "@/lib/data/games";
import { getValidAccessToken, isSupabaseConfigured } from "./supabase-auth";

const KEY = "mainlagi-progress-v2";

export interface LocalProgress {
  bestScores: Partial<Record<GameSlug, number>>;
  lastPlayed: GameSlug | null;
  updatedAt: number;
}

export function readLocalProgress(): LocalProgress {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<LocalProgress>) : {};
    return {
      bestScores:
        typeof parsed.bestScores === "object" && parsed.bestScores
          ? parsed.bestScores
          : {},
      lastPlayed:
        typeof parsed.lastPlayed === "string"
          ? (parsed.lastPlayed as GameSlug)
          : null,
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : 0
    };
  } catch {
    return { bestScores: {}, lastPlayed: null, updatedAt: 0 };
  }
}

export function writeLocalBest(game: GameSlug, score: number): LocalProgress {
  const current = readLocalProgress();
  const safe = Math.max(0, Math.round(Number.isFinite(score) ? score : 0));
  const next = {
    ...current,
    bestScores: {
      ...current.bestScores,
      [game]: Math.max(current.bestScores[game] ?? 0, safe)
    },
    lastPlayed: game,
    updatedAt: Date.now()
  };
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("mainlagi-progress"));
  return next;
}

async function syncCloud(game: GameSlug, score: number) {
  const token = await getValidAccessToken();
  if (!token || !isSupabaseConfigured()) return;
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  await fetch(`${url}/rest/v1/rpc/record_best_score`, {
    method: "POST",
    headers: {
      apikey: anon,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      p_game_slug: game,
      p_score: Math.max(0, Math.round(score))
    })
  }).catch(() => undefined);
}

export function useProgressSync(game: GameSlug, score: number) {
  const lastRef = useRef(0);
  useEffect(() => {
    if (score <= lastRef.current) return;
    lastRef.current = score;
    const timer = window.setTimeout(() => {
      writeLocalBest(game, score);
      void syncCloud(game, score);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [game, score]);
}
