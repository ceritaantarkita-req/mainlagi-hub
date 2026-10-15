/**
 * Child-facing visual hierarchy contract (foundation v1).
 *
 * Pure presentation metadata. It does not mutate the canonical activity,
 * change prompts/answers, call audio, alter assessment, or render markup.
 * It is intentionally NOT wired into gameplay renderers until a
 * representative family passes visual and pedagogy QA.
 */
export type ChildActivityMode = "choice" | "sorting" | "audio-first" | "creative" | "reading";

export type ChildFirstAction = "choose" | "sort" | "listen" | "draw" | "read";

export interface ChildVisualHierarchyInput {
  mode: ChildActivityMode;
  activityTitle: string;
  /** Visible, answer-safe instruction; never pass an audio-only target. */
  visibleInstruction?: string;
  /** Supplementary help available after explicit child/parent action. */
  supportingHint?: string;
}

export interface ChildVisualHierarchyPlan {
  /** Navigation/ARIA context only: must NOT become another large task heading. */
  contextTitle: string;
  /** Exactly one initially visible primary task instruction. */
  primaryInstruction: string;
  /** Reveal via Help; not a second initially visible instruction strip. */
  onDemandHelp: string | null;
  firstAction: ChildFirstAction;
  initiallyVisiblePrimaryInstructions: 1;
}

const FIRST_ACTION: Readonly<Record<ChildActivityMode, ChildFirstAction>> = {
  choice: "choose",
  sorting: "sort",
  "audio-first": "listen",
  creative: "draw",
  reading: "read"
};

function normalized(value: string | undefined): string {
  return (value ?? "").trim().replace(/\s+/g, " ");
}

/**
 * Caller supplies ONLY visible text. For audio-first activities the distinct
 * private audioPrompt stays with the audio runtime and must not be passed in.
 * Reading passages and creative workspace content are task material, not
 * duplicate instructions; their content stays with their renderer.
 */
export function planChildVisualHierarchy(input: ChildVisualHierarchyInput): ChildVisualHierarchyPlan {
  const activityTitle = normalized(input.activityTitle);
  const visibleInstruction = normalized(input.visibleInstruction);

  if (!activityTitle) {
    throw new Error("Child visual hierarchy needs a canonical activity title.");
  }
  if (input.mode === "audio-first" && !visibleInstruction) {
    throw new Error("Audio-first requires an explicit answer-safe visible instruction.");
  }

  const primaryInstruction = visibleInstruction || activityTitle;
  const supportingHint = normalized(input.supportingHint);
  const help = supportingHint &&
    supportingHint.toLocaleLowerCase() !== primaryInstruction.toLocaleLowerCase()
    ? supportingHint
    : null;

  return {
    contextTitle: activityTitle,
    primaryInstruction,
    onDemandHelp: help,
    firstAction: FIRST_ACTION[input.mode],
    initiallyVisiblePrimaryInstructions: 1
  };
}
