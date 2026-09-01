import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Simple config for the first deploy: no R2-backed ISR/data cache yet.
// This app is mostly dynamic (auth-gated pages use force-dynamic / cookies),
// so the default in-memory cache is fine to start with. Add an R2 bucket +
// incrementalCache override later if static/ISR routes need cross-request
// caching in production.
export default defineCloudflareConfig();
