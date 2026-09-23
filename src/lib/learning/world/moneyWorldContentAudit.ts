import {
  MONEY_WORLD_STAGES,
  getMoneyWorldSegments,
  type MoneyWorldSegment
} from "./moneyWorld";

export const MONEY_WORLD_CONTENT_AUDIT_VERSION = "money-world-content-audit-v1";

export interface MoneyWorldContentFocus {
  stageId: string;
  focus: string;
  continuityGoal: string;
  requiredTerms: readonly string[];
}

export interface MoneyWorldContentAuditRow {
  stageId: string;
  stageOrder: number;
  segmentCount: number;
  spokenCount: number;
  activityCount: number;
  narrativeChoiceCount: number;
  recapCount: number;
  mechanicIds: readonly string[];
  maxSpokenWords: number;
}

export const MONEY_WORLD_CONTENT_FOCUS: readonly MoneyWorldContentFocus[] = [
  {
    stageId: "money-stage-01-money-use",
    focus: "money-and-price",
    continuityGoal: "Introduce money as a way to buy priced goods before any price-change concept appears.",
    requiredTerms: ["uang", "harga"]
  },
  {
    stageId: "money-stage-02-price-change",
    focus: "price-change-and-inflation",
    continuityGoal: "Build from one observed price change to the child-safe idea that many prices can rise over time.",
    requiredTerms: ["harga berubah", "inflasi"]
  },
  {
    stageId: "money-stage-03-income-sources",
    focus: "work-and-business",
    continuityGoal: "Connect money to real work/business activity instead of magical acquisition.",
    requiredTerms: ["pekerjaan", "usaha"]
  },
  {
    stageId: "money-stage-04-needs-wants",
    focus: "needs-before-wants",
    continuityGoal: "Use the festival goal to make needs/wants contextual rather than moralizing.",
    requiredTerms: ["butuh", "mau"]
  },
  {
    stageId: "money-stage-05-saving",
    focus: "saving-for-later",
    continuityGoal: "Move from prioritization into delaying use of money for a future goal.",
    requiredTerms: ["menabung", "simpan"]
  },
  {
    stageId: "money-stage-06-investment-intro",
    focus: "saving-versus-investing",
    continuityGoal: "Introduce investment as an adult concept without promising growth.",
    requiredTerms: ["orang dewasa", "investasi", "tidak selalu naik"]
  },
  {
    stageId: "money-stage-07-risk",
    focus: "uncertainty-and-risk",
    continuityGoal: "Explain that investment outcomes can differ from expectations and are not guaranteed.",
    requiredTerms: ["risiko", "belum pasti", "bisa naik atau turun"]
  },
  {
    stageId: "money-stage-08-final-festival",
    focus: "integrated-festival-choice",
    continuityGoal: "Recombine needs, remaining money, open choice, arithmetic, and recap without scoring the child preference.",
    requiredTerms: ["dua puluh token", "kebutuhan", "simpan", "risiko"]
  }
] as const;

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function segmentCorpus(segment: MoneyWorldSegment): string[] {
  if (segment.type === "narrative" || segment.type === "concept" || segment.type === "payoff") {
    return [segment.text];
  }
  if (segment.type === "narrative_choice") {
    return [
      segment.prompt,
      ...segment.options.flatMap((option) => [option.label, option.reaction])
    ];
  }
  if (segment.type === "recap") {
    return [segment.title, ...segment.items.map((item) => item.label)];
  }
  return collectStrings(segment.activity.payload);
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectStrings);
  }
  return [];
}

function factualSpokenText(segment: MoneyWorldSegment): string | null {
  return segment.type === "narrative" || segment.type === "concept" || segment.type === "payoff"
    ? segment.text
    : null;
}

export const MONEY_WORLD_CONTENT_AUDIT_ROWS: readonly MoneyWorldContentAuditRow[] =
  MONEY_WORLD_STAGES.map((stage) => {
    const segments = getMoneyWorldSegments(stage.id);
    const spoken = segments
      .map(factualSpokenText)
      .filter((value): value is string => Boolean(value));
    const activities = segments.filter((segment) => segment.type === "activity");
    return {
      stageId: stage.id,
      stageOrder: stage.order,
      segmentCount: segments.length,
      spokenCount: spoken.length,
      activityCount: activities.length,
      narrativeChoiceCount: segments.filter((segment) => segment.type === "narrative_choice").length,
      recapCount: segments.filter((segment) => segment.type === "recap").length,
      mechanicIds: activities.map((segment) => segment.type === "activity" ? segment.activity.mechanicId : ""),
      maxSpokenWords: spoken.reduce((max, value) => Math.max(max, wordCount(value)), 0)
    };
  });

export function validateMoneyWorldContentAudit(): {
  valid: boolean;
  errors: readonly string[];
} {
  const errors: string[] = [];
  const expectedStageIds = MONEY_WORLD_STAGES.map((stage) => stage.id);

  if (
    JSON.stringify(MONEY_WORLD_CONTENT_FOCUS.map((entry) => entry.stageId)) !==
    JSON.stringify(expectedStageIds)
  ) {
    errors.push("content focus registry must follow the exact canonical eight-Stage order");
  }

  for (const [index, stage] of MONEY_WORLD_STAGES.entries()) {
    const segments = getMoneyWorldSegments(stage.id);
    const row = MONEY_WORLD_CONTENT_AUDIT_ROWS[index];
    const focus = MONEY_WORLD_CONTENT_FOCUS[index];
    const corpus = segments.flatMap(segmentCorpus).join(" ").toLowerCase();
    const factual = segments
      .map(factualSpokenText)
      .filter((value): value is string => Boolean(value));

    if (!segments.length) errors.push(stage.id + " has no content");
    if (segments[0]?.type !== "narrative") errors.push(stage.id + " must open with narrative");
    if (segments.at(-1)?.type !== "payoff") errors.push(stage.id + " must close with payoff");
    if (row.activityCount !== 2) errors.push(stage.id + " must keep exactly two challenges");
    if (row.maxSpokenWords > 18) errors.push(stage.id + " child-facing spoken copy exceeds 18 words");

    for (const segment of segments) {
      if (segment.type === "activity") {
        const reviewedStage8Assessment =
          segment.activity.id === "money-s08-activity-02"
            ? "assessed"
            : "practice";
        if (segment.activity.assessment !== reviewedStage8Assessment) {
          errors.push(
            segment.activity.id
              + " assessment drifted; only money-s08-activity-02 may be assessed"
          );
        }
        if (String(segment.activity.mechanicId) === "motion_game") {
          errors.push(segment.activity.id + " must not require the Bermain motion engine");
        }
      }
    }

    for (const term of focus.requiredTerms) {
      if (!corpus.includes(term.toLowerCase())) {
        errors.push(stage.id + " is missing required content term: " + term);
      }
    }

    const riskyFactualClaim = factual.find((text) =>
      /pasti\s+(selalu\s+)?(untung|naik)|dijamin\s+(untung|naik)/i.test(text)
    );
    if (riskyFactualClaim) {
      errors.push(stage.id + " contains a guaranteed-return factual claim");
    }

    if (
      /\b(beli|belilah|harus membeli|pilihlah)\s+(saham|obligasi|kripto|crypto|reksa dana|investasi)\b/i.test(corpus)
    ) {
      errors.push(stage.id + " must not give a child direct investment-product advice");
    }

    for (const segment of segments) {
      if (segment.type !== "narrative_choice") continue;
      if (segment.options.length !== 3) {
        errors.push(segment.id + " must keep exactly three open child choices");
      }
      for (const option of segment.options) {
        if (/\b(benar|salah|terbaik|hebat|pintar)\b/i.test(option.reaction)) {
          errors.push(option.id + " open financial choice reaction must remain neutral");
        }
      }
    }

    if (stage.order < 8 && (row.narrativeChoiceCount !== 0 || row.recapCount !== 0)) {
      errors.push(stage.id + " must not introduce final-choice/recap structure early");
    }
    if (stage.order === 8 && (row.narrativeChoiceCount !== 1 || row.recapCount !== 1)) {
      errors.push(stage.id + " must keep exactly one open narrative choice and one recap");
    }
  }

  const stageTwoFactual = getMoneyWorldSegments("money-stage-02-price-change")
    .map(factualSpokenText)
    .filter((value): value is string => Boolean(value))
    .join(" ");
  if (!stageTwoFactual.includes("Kalau banyak harga naik dari waktu ke waktu, itu disebut inflasi.")) {
    errors.push("Stage 2 must explain inflation as many prices rising over time");
  }

  const stageSix = getMoneyWorldSegments("money-stage-06-investment-intro");
  const stageSixOpening = stageSix.find((segment) => segment.id === "money-s06-narrative-01");
  if (
    !stageSixOpening ||
    stageSixOpening.type !== "narrative" ||
    stageSixOpening.text !== "Kalau ditabung, uangnya disimpan untuk nanti."
  ) {
    errors.push("Stage 6 saving bridge must describe saving as storing money for later");
  }

  const stageSevenFactual = getMoneyWorldSegments("money-stage-07-risk")
    .map(factualSpokenText)
    .filter((value): value is string => Boolean(value))
    .join(" ");
  if (!stageSevenFactual.includes("Hasilnya bisa berbeda dari yang kita harapkan.")) {
    errors.push("Stage 7 must explain risk through outcome uncertainty");
  }

  const stageEight = getMoneyWorldSegments("money-stage-08-final-festival");
  const postChoiceMathBridge = stageEight.find(
    (segment) =>
      segment.type === "concept" &&
      segment.text.includes("latihan hitung lain")
  );
  if (!postChoiceMathBridge) {
    errors.push("Stage 8 arithmetic must be framed as a separate exercise after the open child choice");
  }

  return { valid: errors.length === 0, errors };
}

export const MONEY_WORLD_CONTENT_AUDIT_VALIDATION =
  validateMoneyWorldContentAudit();

export const MONEY_WORLD_CONTENT_AUDIT_SUMMARY = {
  stages: MONEY_WORLD_CONTENT_AUDIT_ROWS.length,
  segments: MONEY_WORLD_CONTENT_AUDIT_ROWS.reduce((sum, row) => sum + row.segmentCount, 0),
  activities: MONEY_WORLD_CONTENT_AUDIT_ROWS.reduce((sum, row) => sum + row.activityCount, 0),
  narrativeChoices: MONEY_WORLD_CONTENT_AUDIT_ROWS.reduce((sum, row) => sum + row.narrativeChoiceCount, 0),
  recaps: MONEY_WORLD_CONTENT_AUDIT_ROWS.reduce((sum, row) => sum + row.recapCount, 0),
  maxSpokenWords: MONEY_WORLD_CONTENT_AUDIT_ROWS.reduce((max, row) => Math.max(max, row.maxSpokenWords), 0)
} as const;
