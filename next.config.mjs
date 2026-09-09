import path from "node:path";
import { fileURLToPath } from "node:url";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const buildSha = process.env.WORKERS_CI_COMMIT_SHA ?? process.env.GITHUB_SHA ?? "local";
const buildBranch = process.env.WORKERS_CI_BRANCH ?? process.env.GITHUB_REF_NAME ?? "local";
const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "unset";
const dataBackend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "unset";

function getSupabaseProjectRef(value) {
  if (!value) return "unset";

  try {
    const hostname = new URL(value).hostname;
    if (hostname.endsWith(".supabase.co")) {
      return hostname.slice(0, -".supabase.co".length) || "unset";
    }
    return "non-supabase-host";
  } catch {
    return "invalid-url";
  }
}

const supabaseProjectRef = getSupabaseProjectRef(process.env.NEXT_PUBLIC_SUPABASE_URL);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: { root: projectRoot },
  // Public, non-secret release/configuration metadata. Cloudflare Workers
  // Builds injects commit metadata; NEXT_PUBLIC_* values are client-safe by
  // definition. Only the Supabase project ref is exposed, never any key.
  env: {
    MAINLAGI_BUILD_SHA: buildSha,
    MAINLAGI_BUILD_BRANCH: buildBranch,
    MAINLAGI_PUBLIC_SITE_URL: publicSiteUrl,
    MAINLAGI_DATA_BACKEND: dataBackend,
    MAINLAGI_SUPABASE_PROJECT_REF: supabaseProjectRef
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" }
        ]
      }
    ];
  },
  async redirects() {
    return [
      {
        source: "/papan-skor",
        destination: "/leaderboards",
        permanent: true
      }
    ];
  }
};

// Lets `next dev` simulate Cloudflare bindings locally (Workers deploy uses
// the OpenNext build separately, see wrangler.jsonc / open-next.config.ts).
initOpenNextCloudflareForDev();

export default nextConfig;
