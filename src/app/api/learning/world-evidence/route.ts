import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/auth/supabase-server-admin";
import { requireParentSession } from "@/lib/auth/requireParent";
import {
  MONEY_WORLD_EVIDENCE_INGESTION_ENABLED,
  evaluateMoneyWorldEvidenceIngestion
} from "@/lib/learning/world/moneyWorldEvidenceIngestion";

export const dynamic = "force-dynamic";

function noStoreJson(
  body: Record<string, unknown>,
  status: number
): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" }
  });
}

export async function POST(request: Request) {
  // Implementation wave 1 deliberately exposes no active ingestion surface.
  // The DB RPC has an independent false mapping gate as defense-in-depth.
  if (!MONEY_WORLD_EVIDENCE_INGESTION_ENABLED) {
    return noStoreJson(
      { accepted: false, reason: "world-evidence-ingestion-disabled" },
      404
    );
  }

  const gate = await requireParentSession();
  if (gate.mode !== "authenticated") {
    return noStoreJson({ accepted: false, reason: "authentication-required" }, 401);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return noStoreJson({ accepted: false, reason: "invalid-json" }, 400);
  }

  const evaluation = evaluateMoneyWorldEvidenceIngestion(raw);
  if (evaluation.disposition !== "ready" || !evaluation.writePayload) {
    return noStoreJson(
      {
        accepted: false,
        reason: "world-evidence-observation-rejected",
        blockers: evaluation.blockers
      },
      422
    );
  }

  const admin = await getAdminClient();
  if (!admin) {
    return noStoreJson(
      { accepted: false, reason: "server-evidence-backend-unavailable" },
      503
    );
  }

  const payload = evaluation.writePayload;
  const { data, error } = await admin.rpc("record_world_skill_evidence", {
    p_account_id: gate.userId,
    p_child_key: payload.childId,
    p_client_observation_id: payload.clientObservationId,
    p_world_id: payload.worldId,
    p_stage_id: payload.stageId,
    p_world_activity_id: payload.worldActivityId,
    p_mechanic_id: payload.mechanicId,
    p_content_version: payload.contentVersion,
    p_answer_sequence: payload.answerSequence,
    p_input_mode: payload.inputMode,
    p_started_at: payload.startedAt,
    p_completed_at: payload.completedAt,
    p_metadata: payload.metadata
  });

  if (error || typeof data !== "string") {
    return noStoreJson(
      { accepted: false, reason: "world-evidence-write-rejected" },
      409
    );
  }

  return noStoreJson(
    { accepted: true, evidenceId: data },
    201
  );
}
