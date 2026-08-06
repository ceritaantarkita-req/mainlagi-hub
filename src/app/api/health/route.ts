import { NextResponse } from "next/server";
export function GET() { return NextResponse.json({ ok: true, service: "motion-learning-hub-mainlagitv-v2", modules: 9, timestamp: new Date().toISOString() }); }
