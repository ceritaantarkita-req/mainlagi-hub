/**
 * Backend selection.
 *
 * The app talks to a `DataRepositories` interface. `DATA_BACKEND` chooses the
 * implementation:
 *   - "mock"     → in-memory repositories (development, no backend needed)
 *   - "supabase" → Supabase-backed repositories (production, wired in later)
 *
 * Defaults to "mock" so the app runs without Supabase. When Supabase is ready,
 * set NEXT_PUBLIC_DATA_BACKEND=supabase and provide the Supabase env vars.
 */

export type DataBackend = "mock" | "supabase";

export function dataBackend(): DataBackend {
  const value = (
    process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock"
  ).toLowerCase() as DataBackend;
  return value === "supabase" ? "supabase" : "mock";
}

export function isMock(): boolean {
  return dataBackend() === "mock";
}
