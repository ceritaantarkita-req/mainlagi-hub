import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor configuration.
 *
 * This app uses SSR (server cookies via @supabase/ssr + proxy) and Next server
 * actions, which will not run inside a WebView from a static `webDir`. So the
 * native shell loads the **hosted web app** over HTTPS via `server.url`.
 *
 * Trade-off (documented in `docs/native-launch.md`): the app needs a reachable
 * backend, but keeps SSR/auth/SEO intact. A fully offline static bundle would
 * require `output: "export"` and dropping cookie-session auth - a bigger change
 * deferred until the web app is stable.
 */

const webUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://app.mainlagi.id";

const config: CapacitorConfig = {
  appId: "tv.mainlagi.motionlearnhub",
  appName: "Mainlagi Hub",
  // Static fallback dir; ignored while `server.url` is set.
  webDir: "out",
  server: {
    url: webUrl,
    cleartext: false
  },
  android: {
    allowMixedContent: false
  },
  ios: {
    contentInset: "automatic"
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#0f2344"
    }
  }
};

export default config;
