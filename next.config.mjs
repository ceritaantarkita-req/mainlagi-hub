import path from "node:path";
import { fileURLToPath } from "node:url";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: { root: projectRoot },
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
