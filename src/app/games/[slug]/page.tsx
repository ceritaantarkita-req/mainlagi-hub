import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GameIcon } from "@/components/GameIcon";
import { GameArtwork } from "@/components/GameArtwork";
import { GAMES, GAME_LIST, isGameSlug, type GameDefinition } from "@/lib/data/games";

export function generateStaticParams() {
  return Object.keys(GAMES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isGameSlug(slug)) return {};
  const game = GAMES[slug];
  return {
    title: game.title,
    description: game.description,
    openGraph: { title: game.title, description: game.description },
    alternates: { canonical: `/games/${slug}` }
  };
}

function relatedGames(game: GameDefinition): GameDefinition[] {
  return GAME_LIST.filter((g) => g.slug !== game.slug && g.category === game.category).slice(0, 3);
}

export default async function GameDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isGameSlug(slug)) notFound();
  const game = GAMES[slug];

  return (
    <div className="fun-home">
      <section className="page-shell game-detail">
        <header
          className="game-detail__hero"
          style={
            {
              "--accent": game.accent,
              "--soft": game.accentSoft
            } as React.CSSProperties
          }
        >
          <div className="game-detail__art">
            <GameArtwork slug={game.slug} label={`Ilustrasi ${game.title}`} />
          </div>
          <div className="game-detail__copy">
            <span className="game-detail__eyebrow">
              <GameIcon name={game.icon} size={24} /> {game.category}
            </span>
            <h1>{game.title}</h1>
            <p>{game.description}</p>
          </div>
          <div className="game-detail__play">
            <Link className="button button--primary button--large" href={`/play/${slug}`}>
              Mulai bermain
            </Link>
          </div>
        </header>

        <dl className="game-detail__facts">
          <div><dt>Usia</dt><dd>{game.age}</dd></div>
          <div><dt>Pemain</dt><dd>{game.playerOptions.includes(2) ? "1–2 pemain" : "1 pemain"}</dd></div>
          <div><dt>Input</dt><dd>{game.visionMode === "pose" ? "Badan" : game.visionMode === "hand" ? "Tangan" : "Tangan + badan"}</dd></div>
          <div><dt>Status</dt><dd>{game.status === "ready" ? "Siap" : "Beta"}</dd></div>
        </dl>

        <div className="game-detail__body">
          <section className="game-detail__section">
            <h2>Cara bermain</h2>
            <p>
              Pilih mode pemain, izinkan kamera, lalu selesaikan tahapan
              preflight. Setelah hitung mundur selesai, ikuti instruksi di
              layar dengan gerakan tangan atau badan.
            </p>
            <p>
              Kalau kamera tidak tersedia atau tidak nyaman, gunakan mode mouse
              atau keyboard sebagai alternatif.
            </p>
          </section>

          <section className="game-detail__section">
            <h2>Yang kamu latih</h2>
            <ul className="game-detail__chips">
              {game.capabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
          </section>

          <section className="game-detail__section game-detail__privacy">
            <h2>Privasi</h2>
            <p>
              Video kamera diproses di perangkatmu dan tidak diunggah. Tidak ada
              frame yang disimpan. Kamu bisa berhenti kapan saja.
            </p>
          </section>
        </div>

        {relatedGames(game).length > 0 && (
          <section className="game-detail__related">
            <h2>Game serupa</h2>
            <div className="catalog-grid">
              {relatedGames(game).map((related) => (
                <Link key={related.slug} href={`/games/${related.slug}`} className="catalog-card">
                  <span className="catalog-card__tile" aria-hidden>
                    <GameIcon name={related.icon} size={40} />
                  </span>
                  <span className="catalog-card__body">
                    <strong>{related.shortTitle}</strong>
                    <small>{related.description}</small>
                    <span className="catalog-card__meta">
                      <em>{related.age}</em>
                      <em>{related.playerOptions.includes(2) ? "1–2 pemain" : "1 pemain"}</em>
                    </span>
                  </span>
                  <span className="catalog-card__go">Lihat</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
