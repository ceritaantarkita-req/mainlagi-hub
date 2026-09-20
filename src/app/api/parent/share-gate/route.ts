import { NextResponse } from "next/server";
import { requireParentSession } from "@/lib/auth/requireParent";

export const dynamic = "force-dynamic";

export async function GET() {
  const gate = await requireParentSession();
  return NextResponse.json(
    { allowed: gate.mode === "authenticated" || gate.mode === "unconfigured" },
    { headers: { "Cache-Control": "no-store" } }
  );
}
