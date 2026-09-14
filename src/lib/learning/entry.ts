import { getSubject } from "./system";

// This is a navigation preference, never an ownership/access decision. Resolve
// it against the currently loaded account's profile collection before using it.
const ACTIVE_CHILD_KEY = "mainlagi:active-child:v1";

export function rememberChild(childId: string) {
  try { localStorage.setItem(ACTIVE_CHILD_KEY, childId); } catch { /* Storage may be disabled. */ }
}

export function readActiveChild(): string | null {
  try { return localStorage.getItem(ACTIVE_CHILD_KEY); } catch { return null; }
}

export function childDestination(childId: string, subjectId?: string | null): string {
  const base = `/child/${encodeURIComponent(childId)}`;
  return subjectId && getSubject(subjectId)
    ? `${base}/subject/${encodeURIComponent(subjectId)}`
    : `${base}/home`;
}
