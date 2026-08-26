import Link from "next/link";

/**
 * Placeholder content for routes that Phase 0 wires up but does not fully
 * build yet. Keeps navigation working so the shell can be verified before the
 * real page content lands in later phases.
 */
export function StubPage({
  title,
  description,
  links
}: {
  title: string;
  description: string;
  links?: Array<{ href: string; label: string }>;
}) {
  return (
    <section className="page-shell stub-page">
      <h1>{title}</h1>
      <p>{description}</p>
      {links && links.length > 0 && (
        <nav className="stub-page__links" aria-label={`Tautan ${title}`}>
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </section>
  );
}
