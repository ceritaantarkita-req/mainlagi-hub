import { getStage } from "./system";

export type JourneyHeaderSection = "belajar" | "bermain" | "world";

export interface JourneyHeaderRouteState {
  backHref: string | null;
  currentSection: JourneyHeaderSection;
}

function baseForChild(childId: string): string {
  const normalized = childId.trim();
  if (!normalized) throw new Error("Journey header requires a non-empty childId");
  return `/child/${encodeURIComponent(normalized)}`;
}

export function resolveJourneyHeaderRoute(args: {
  childId: string;
  pathname: string;
}): JourneyHeaderRouteState {
  const base = baseForChild(args.childId);
  const pathname = args.pathname || base;

  if (pathname === base || pathname === `${base}/home`) {
    return { backHref: null, currentSection: "belajar" };
  }

  if (pathname === `${base}/learn` || pathname.startsWith(`${base}/subject/`)) {
    return {
      backHref: `${base}/home#choose-subject`,
      currentSection: "belajar"
    };
  }

  if (pathname.startsWith(`${base}/stage/`)) {
    const rawStageId = pathname.slice(`${base}/stage/`.length).split("/")[0] ?? "";
    let stageId = rawStageId;
    try {
      stageId = decodeURIComponent(rawStageId);
    } catch {
      stageId = rawStageId;
    }
    const stage = getStage(stageId);
    return {
      backHref: stage ? `${base}/subject/${encodeURIComponent(stage.subjectId)}` : `${base}/home#choose-subject`,
      currentSection: "belajar"
    };
  }

  if (pathname === `${base}/games` || pathname.startsWith(`${base}/games/`)) {
    return {
      backHref: `${base}/home`,
      currentSection: "bermain"
    };
  }

  if (pathname === `${base}/worlds`) {
    return {
      backHref: `${base}/home`,
      currentSection: "world"
    };
  }

  if (pathname.startsWith(`${base}/world/`)) {
    return {
      backHref: `${base}/worlds`,
      currentSection: "world"
    };
  }

  return {
    backHref: `${base}/home`,
    currentSection: "belajar"
  };
}

export function journeyHeaderDestinations(childId: string) {
  const base = baseForChild(childId);
  return [
    { id: "belajar" as const, label: "Belajar", href: `${base}/home` },
    { id: "bermain" as const, label: "Bermain", href: `${base}/games` },
    { id: "world" as const, label: "World", href: `${base}/worlds` }
  ];
}
