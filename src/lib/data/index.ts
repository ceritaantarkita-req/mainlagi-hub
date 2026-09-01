import type { DataRepositories } from "./repositories/contracts";
import { createMockRepositories } from "./mock";
import { createSupabaseArticleRepository } from "./repositories/articles-supabase";

let cache: DataRepositories | null = null;

/**
 * Resolve the active data repositories.
 *
 * Everything except `articles` still runs on the in-memory mock (Phase 1
 * auth landed long ago and moved profiles/scores/etc. to their own
 * Supabase-backed code paths outside this layer, but nobody came back to
 * finish wiring this contract -- see docs/data-layer.md). `articles` is
 * wired to Supabase here because the admin CMS (src/app/admin/articles)
 * writes real rows to `public.articles`, and the public Jelajah pages need
 * to read those same rows rather than the static seed in `./content`.
 */
export function getData(): DataRepositories {
  if (cache) return cache;
  const mock = createMockRepositories();
  cache = { ...mock, articles: createSupabaseArticleRepository() };
  return cache;
}

export type { DataRepositories };
