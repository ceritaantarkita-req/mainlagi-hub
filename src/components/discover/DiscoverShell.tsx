/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { GameIcon } from "@/components/GameIcon";
import { GameArtwork } from "@/components/GameArtwork";
import { GAME_LIST, type GameDefinition } from "@/lib/data/games";
import { GAME_THEMES } from "@/lib/data/gameThemes";
import { getData } from "@/lib/data";
import type { AffiliateItem, Article } from "@/lib/data/domain";

type Tab = "semua" | "game" | "artikel" | "produk";
type View = "grid" | "list";
type SectionKey = "game" | "article" | "product";

const PAGE = 9;

const TABS: { value: Tab; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "game", label: "Game" },
  { value: "artikel", label: "Artikel" },
  { value: "produk", label: "Produk" }
];

function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconList() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function ViewToggle({ value, onChange }: { value: View; onChange: (v: View) => void }) {
  return (
    <div className="view-toggle" role="group" aria-label="Tampilan">
      <button
        type="button"
        className={value === "grid" ? "is-active" : ""}
        onClick={() => onChange("grid")}
        aria-label="Tampilan grid"
      >
        <IconGrid />
      </button>
      <button
        type="button"
        className={value === "list" ? "is-active" : ""}
        onClick={() => onChange("list")}
        aria-label="Tampilan daftar"
      >
        <IconList />
      </button>
    </div>
  );
}

function MoreButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="discover-more" type="button" onClick={onClick}>
      More ▾
    </button>
  );
}

function GameTile({ game }: { game: GameDefinition }) {
  const theme = GAME_THEMES[game.slug];
  return (
    <Link
      href={`/games/${game.slug}`}
      className="fun-card"
      style={{ "--from": theme.from, "--to": theme.to } as React.CSSProperties}
    >
      <span className="fun-card__art" aria-hidden>
        <GameArtwork slug={game.slug} />
      </span>
      <span className="fun-card__body">
        <span className="fun-card__title">
          <span className="fun-card__glyph" aria-hidden>
            <GameIcon name={game.icon} size={30} />
          </span>
          <strong>{game.shortTitle}</strong>
        </span>
        <span className="fun-card__meta">{game.age} · {game.visionMode === "pose" ? "Gerak badan" : "Gerak tangan"}</span>
        <span className="fun-card__play">Mainkan <b aria-hidden><Icon name="arrow" size={19} /></b></span>
      </span>
    </Link>
  );
}

function ArticleTile({ article }: { article: Article }) {
  return (
    <Link href={`/discover/articles/${article.slug}`} className="tile tile--article">
      <span className="tile__media tile__media--letter" aria-hidden>
        {article.category?.slice(0, 1) ?? "A"}
      </span>
      <span className="tile__body">
        <strong>{article.title}</strong>
        <small>{article.category}</small>
      </span>
    </Link>
  );
}

function ProductTile({ item }: { item: AffiliateItem }) {
  return (
    <a href={`/go/${item.slug}`} className="product-tile">
      <span className="product-tile__media">
        {item.imageUrl ? <img src={item.imageUrl} alt="" loading="lazy" /> : null}
      </span>
      <span className="product-tile__overlay" aria-hidden>
        <strong>{item.title}</strong>
        <small>Lihat di Shopee ↗</small>
      </span>
    </a>
  );
}

function Row({
  href,
  thumb,
  title,
  meta
}: {
  href: string;
  thumb: ReactNode;
  title: string;
  meta: string;
}) {
  return (
    <Link href={href} className="row">
      <span className="row__thumb">{thumb}</span>
      <span className="row__body">
        <strong>{title}</strong>
        <small>{meta}</small>
      </span>
      <span className="row__arrow" aria-hidden><Icon name="arrow" size={18} /></span>
    </Link>
  );
}

export function DiscoverShell() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("semua");
  const [view, setView] = useState<View>("grid");
  const [articles, setArticles] = useState<Article[]>([]);
  const [products, setProducts] = useState<AffiliateItem[]>([]);
  const [limits, setLimits] = useState<Record<SectionKey, number>>({
    game: PAGE,
    article: PAGE,
    product: PAGE
  });

  useEffect(() => {
    void getData().articles.listPublished("id").then(setArticles).catch(() => setArticles([]));
    void getData().products.listActive().then(setProducts).catch(() => setProducts([]));
  }, []);

  const q = query.trim().toLowerCase();

  const games = useMemo(
    () =>
      GAME_LIST.filter((g) =>
        q ? [g.title, g.shortTitle, g.description, g.age].join(" ").toLowerCase().includes(q) : true
      ),
    [q]
  );
  const filteredArticles = useMemo(
    () =>
      articles.filter((a) =>
        q ? [a.title, a.excerpt, a.category, ...a.tags].join(" ").toLowerCase().includes(q) : true
      ),
    [q, articles]
  );
  const filteredProducts = useMemo(
    () => products.filter((p) => (q ? [p.title].join(" ").toLowerCase().includes(q) : true)),
    [q, products]
  );

  const showGame = tab === "semua" || tab === "game";
  const showArticle = tab === "semua" || tab === "artikel";
  const showProduct = tab === "semua" || tab === "produk";

  const empty =
    (showGame && games.length === 0) &&
    (showArticle && filteredArticles.length === 0) &&
    (showProduct && filteredProducts.length === 0);

  const more = (key: SectionKey) => setLimits((s) => ({ ...s, [key]: s[key] + PAGE }));

  const gameMore = games.length - limits.game;
  const articleMore = filteredArticles.length - limits.article;
  const productMore = filteredProducts.length - limits.product;

  // "more" reveals everything up to the running limit; default limit is PAGE.
  const gameLimit = Math.min(limits.game, games.length);
  const articleLimit = Math.min(limits.article, filteredArticles.length);
  const productLimit = Math.min(limits.product, filteredProducts.length);

  return (
    <div className="discover">
      <div className="discover-toolbar">
        <label className="catalog-search">
          <span className="catalog-search__icon" aria-hidden><Icon name="discover" size={21} /></span>
          <input
            type="search"
            placeholder="Cari di Discover…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Cari di Discover"
          />
        </label>
        <ViewToggle value={view} onChange={setView} />
      </div>

      <div className="catalog-filter-group discover-tabs">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            className={tab === t.value ? "is-active" : ""}
            onClick={() => setTab(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {empty ? (
        <p className="catalog-empty">Tidak ada hasil. Coba kata kunci lain atau ubah kategori.</p>
      ) : (
        <div className="discover__sections">
          {showGame && games.length > 0 && (
            <section>
              <h3>Game</h3>
              {view === "grid" ? (
                <div className="discover-grid">
                  {games.slice(0, gameLimit).map((game) => (
                    <GameTile key={game.slug} game={game} />
                  ))}
                </div>
              ) : (
                <div className="discover-list">
                  {games.slice(0, gameLimit).map((game) => (
                    <Row
                      key={game.slug}
                      href={`/games/${game.slug}`}
                      thumb={<GameIcon name={game.icon} size={26} />}
                      title={game.shortTitle}
                      meta={game.description}
                    />
                  ))}
                </div>
              )}
              {gameMore > 0 && <MoreButton onClick={() => more("game")} />}
            </section>
          )}

          {showArticle && filteredArticles.length > 0 && (
            <section>
              <h3>Artikel</h3>
              {view === "grid" ? (
                <div className="discover-grid">
                  {filteredArticles.slice(0, articleLimit).map((article) => (
                    <ArticleTile key={article.slug} article={article} />
                  ))}
                </div>
              ) : (
                <div className="discover-list">
                  {filteredArticles.slice(0, articleLimit).map((article) => (
                    <Row
                      key={article.slug}
                      href={`/discover/articles/${article.slug}`}
                      thumb={<span className="row__letter">{article.category?.slice(0, 1) ?? "A"}</span>}
                      title={article.title}
                      meta={article.excerpt ?? ""}
                    />
                  ))}
                </div>
              )}
              {articleMore > 0 && <MoreButton onClick={() => more("article")} />}
            </section>
          )}

          {showProduct && filteredProducts.length > 0 && (
            <section>
              <h3>Produk</h3>
              {view === "grid" ? (
                <div className="discover-grid">
                  {filteredProducts.slice(0, productLimit).map((item) => (
                    <ProductTile key={item.slug} item={item} />
                  ))}
                </div>
              ) : (
                <div className="discover-list">
                  {filteredProducts.slice(0, productLimit).map((item) => (
                    <Row
                      key={item.slug}
                      href={`/go/${item.slug}`}
                      thumb={
                        item.imageUrl ? <img src={item.imageUrl} alt="" loading="lazy" /> : <span />
                      }
                      title={item.title}
                      meta={item.disclosure ?? "Tautan afiliasi"}
                    />
                  ))}
                </div>
              )}
              {productMore > 0 && <MoreButton onClick={() => more("product")} />}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
