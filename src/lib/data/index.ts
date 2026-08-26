import type { DataRepositories } from "./repositories/contracts";
import { createMockRepositories } from "./mock";

let cache: DataRepositories | null = null;

/**
 * Resolve the active data repositories.
 *
 * Defaults to the in-memory mock so the app runs without Supabase. The
 * Supabase implementation is wired in once Phase 1 (auth) lands.
 */
export function getData(): DataRepositories {
  if (cache) return cache;
  cache = createMockRepositories();
  return cache;
}

export type { DataRepositories };
