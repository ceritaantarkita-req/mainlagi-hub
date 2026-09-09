# Security Policy

Mainlagi Hub is child-facing software with camera, authentication, optional cloud data, and planned AI/OCR capabilities. Security and privacy reports are treated as high priority.

## Supported code

Security fixes target the current `main` branch and the production version derived from it. Historical branches, snapshots, experimental branches, and forks are not guaranteed to receive fixes.

## Reporting a vulnerability

**Do not open a public GitHub issue for an unpatched vulnerability.**

Preferred reporting path after the repository becomes public:

1. Use GitHub **Private Vulnerability Reporting / Security Advisories** when enabled for this repository.
2. Include a concise description, affected path/version, reproduction steps, impact, and any safe proof-of-concept details.
3. Remove real secrets, child data, production tokens, personal data, and unnecessary screenshots from the report.

If private vulnerability reporting is not available, contact the repository maintainer privately through the GitHub account that owns this repository before publishing details.

## High-priority categories

Please report issues involving:

- authentication/authorization bypass;
- Supabase RLS or owner/admin privilege escalation;
- leaked service-role, OpenRouter, OAuth, deployment, or other secrets;
- XSS, HTML injection, unsafe redirects, SSRF, arbitrary URL fetching;
- dependency vulnerabilities with a realistic production path;
- unintended camera/image upload or retention;
- access to another family/child profile or progress data;
- unsafe file handling;
- remote code execution or command injection;
- bypass of rate/size/security boundaries around future OCR/AI features;
- child privacy/data exposure.

## Secret handling

Secrets must never be committed.

Examples of server-only values:

- `SUPABASE_SERVICE_ROLE_KEY`
- future `OPENROUTER_API_KEY`
- deployment SSH keys
- provider credentials

Rules:

- no secret may use a `NEXT_PUBLIC_` prefix;
- no secret may be placed in browser bundles;
- logs and thrown client errors must not echo secret values;
- `.env.local` and equivalent runtime secret files stay outside Git;
- rotate a credential immediately if it has ever been committed or exposed in CI logs; deleting the latest file is not sufficient because Git history may retain it.

## Camera and child-data expectations

Current gameplay processes camera inference in the browser and should not add raw-frame upload paths casually.

Any future feature that sends child-related visual/audio/text data to an external provider is a security/privacy architecture change and must include:

- explicit server/client boundary;
- payload minimization;
- provider data-use/retention review;
- bounded inputs;
- rate limiting/timeouts;
- parent-facing explanation/control where appropriate;
- tests for leakage and failure behavior.

## Dependency policy

Production CI runs a high-severity dependency audit. Do not bypass or suppress a production advisory merely to make CI green. Prefer patched dependency versions or a documented, reviewed exception when no fix exists.

## Disclosure

Please allow maintainers a reasonable opportunity to investigate and release a fix before public disclosure. Coordinated disclosure is preferred.
