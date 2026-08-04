import { NextResponse } from "next/server";
export function GET() {
  return NextResponse.json({ success: true, service: "motion-learning-hub", version: "1.0.0", timestamp: new Date().toISOString() });
}
