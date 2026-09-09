import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "motion-learning-hub-mainlagitv-v2",
    modules: 9,
    release: {
      sha: process.env.MAINLAGI_BUILD_SHA ?? "unknown",
      branch: process.env.MAINLAGI_BUILD_BRANCH ?? "unknown"
    },
    productionTarget: {
      siteUrl: process.env.MAINLAGI_PUBLIC_SITE_URL ?? "unknown",
      dataBackend: process.env.MAINLAGI_DATA_BACKEND ?? "unknown",
      supabaseProjectRef: process.env.MAINLAGI_SUPABASE_PROJECT_REF ?? "unknown"
    },
    timestamp: new Date().toISOString()
  });
}
