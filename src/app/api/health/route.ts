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
    timestamp: new Date().toISOString()
  });
}
