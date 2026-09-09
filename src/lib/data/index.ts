import type { DataRepositories } from "./repositories/contracts";
import { createMockRepositories } from "./mock";
import { createSupabaseArticleRepository } from "./repositories/articles-supabase";
import { createSupabaseProductRepository } from "./repositories/products-supabase";

let cache: DataRepositories | null = null;

/**
 * Resolve the active data repositories.
 *
 * Profiles/scores still have older Supabase-backed paths outside this factory,
 * but public CMS-backed content now has one source of truth here: articles read
 * from `public.articles`, and affiliate products read from
 * `public.affiliate_items`. Both repositories fail safely to existing local
 * data when their backend is unavailable, so local development remains usable.
 */
export function getData(): DataRepositories {
  if (cache) return cache;
  const mock = createMockRepositories();
  cache = {
    ...mock,
    articles: createSupabaseArticleRepository(),
    products: createSupabaseProductRepository(mock.products)
  };
  return cache;
}

export type { DataRepositories };
