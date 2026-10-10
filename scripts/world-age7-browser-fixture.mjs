/**
 * Browser-only QA profile for the existing 6–8 World pilot.
 * The canonical demo-gian remains age 5; never override its age or the production gate.
 * This script is loaded only by local Playwright test runners.
 */
export const WORLD_QA_CHILD_ID = "qa-world-age7";

export async function worldAge7Context(browser, options) {
  const context = await browser.newContext(options);
  await context.addInitScript(() => {
    try {
      const key = "mainlagi-learning-profiles-v1";
      const raw = window.localStorage.getItem(key);
      const stored = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(stored) ? stored.filter((item) => item?.id !== "qa-world-age7") : [];
      list.push({ id: "qa-world-age7", name: "World QA", age: 7, guide: "paca", language: "id" });
      window.localStorage.setItem(key, JSON.stringify(list));
    } catch {
      // Browsers may deny local storage on non-site/blank pages. Re-run on site navigation.
    }
  });
  return context;
}
