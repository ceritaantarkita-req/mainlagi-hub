import Link from "next/link";
import { getCompanionApps } from "@/engine/apps";

/**
 * Launcher for the four standalone products.
 *
 * The hub links to each deployment rather than embedding a copy of its code.
 * That keeps every product independently installable, deployable and sellable,
 * while giving users one place to start from. Nothing in the original projects
 * is removed or altered by this.
 */
export function CompanionApps() {
  const apps = getCompanionApps();

  return (
    <section className="companion-section" aria-labelledby="companion-heading">
      <div className="companion-heading">
        <h2 id="companion-heading">Aplikasi lain dalam satu keluarga</h2>
        <p>Setiap aplikasi berjalan sendiri dan bisa dipakai terpisah. Hub ini hanya pintu masuknya.</p>
      </div>

      <div className="companion-grid">
        {apps.map((app) => {
          const configured = app.url.length > 0;
          return (
            <article key={app.id} className={`companion-card companion-card--${app.accent}`}>
              <header>
                <h3>{app.title}</h3>
                <span className="companion-tagline">{app.tagline}</span>
              </header>
              <p>{app.description}</p>
              <ul className="companion-capabilities">
                {app.capabilities.map((capability) => (
                  <li key={capability}>{capability}</li>
                ))}
              </ul>
              <footer>
                <span className="companion-audience">{app.audience}</span>
                {configured ? (
                  <a className="companion-launch" href={app.url} target="_blank" rel="noreferrer noopener">
                    Buka aplikasi
                  </a>
                ) : (
                  <span className="companion-unset" title={`Set NEXT_PUBLIC_APP_* untuk ${app.repository}`}>
                    Belum dikonfigurasi
                  </span>
                )}
              </footer>
            </article>
          );
        })}
      </div>

      <p className="companion-note">
        Alamat tiap aplikasi diatur lewat environment variable, jadi build yang sama bisa dipakai di localhost
        maupun di subdomain produksi. Lihat <Link href="/how-to-play">cara bermain</Link> untuk panduan gesture
        yang berlaku di semua aplikasi.
      </p>
    </section>
  );
}
