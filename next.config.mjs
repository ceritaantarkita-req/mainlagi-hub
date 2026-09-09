import path from "node:path";
import { fileURLToPath } from "node:url";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const buildSha = process.env.WORKERS_CI_COMMIT_SHA ?? process.env.GITHUB_SHA ?? "local";
const buildBranch = process.env.WORKERS_CI_BRANCH ?? process.env.GITHUB_REF_NAME ?? "local";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: { root: projectRoot },
  // Public, non-secret release metadata. Cloudflare Workers Builds injects
  // WORKERS_CI_COMMIT_SHA / WORKERS_CI_BRANCH during the production build.
  // Baking them into the server bundle lets /api/health prove which Git
  // commit is actually serving production traffic.
  env: {
    MAINLAGI_BUILD_SHA: buildSha,
    MAINLAGI_BUILD_BRANCH: buildBranch
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
