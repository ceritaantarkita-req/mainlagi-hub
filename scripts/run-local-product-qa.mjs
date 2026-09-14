import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const outputDir = path.join(root, ".qa");
const screenshotDir = path.join(outputDir, "screenshots");
const reportJsonPath = path.join(outputDir, "product-report.json");
const reportMarkdownPath = path.join(outputDir, "product-report.md");
const compiledDir = path.join(root, ".learning-test-dist");
const childId = process.env.MAINLAGI_PRODUCT_QA_CHILD_ID ?? "demo-gian";
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_PRODUCT_QA_PORT ?? 4020);
const baseUrl = process.env.MAINLAGI_PRODUCT_QA_BASE_URL ?? `http://${host}:${port}`;
const shouldStartServer = !process.env.MAINLAGI_PRODUCT_QA_BASE_URL;
const activityConcurrency = Math.max(1, Number(process.env.MAINLAGI_PRODUCT_QA_ACTIVITY_CONCURRENCY ?? 4));
// Give local rendering/network work time to settle on resource-constrained
// laptops. This extends (never shortens) the console-error observation window.
const activityWaitMs = Math.max(60, Number(process.env.MAINLAGI_PRODUCT_QA_ACTIVITY_WAIT_MS ?? 200));
if (!Number.isFinite(activityWaitMs) || !Number.isFinite(activityConcurrency)) {
  throw new Error("QA activity concurrency/wait configuration must be finite numbers.");
}
const fullActivityCrawl = process.env.MAINLAGI_PRODUCT_QA_SKIP_ACTIVITY_CRAWL !== "1" && !process.argv.includes("--skip-activity-crawl");

const report = {
  schemaVersion: 2,
  generatedAt: new Date().toISOString(),
  gitSha: "unknown",
  baseUrl,
  mode: fullActivityCrawl ? "full" : "routes-only",
  summary: {},
  catalog: {},
  subjects: [],
  browser: {
    routesChecked: 0,
    activityRoutesChecked: 0,
    screenshots: [],
    flow: {},
    subjectExposure: []
  },
  blockers: [],
  warnings: [],
  notes: [
    "Automated heuristics can find structural, reachability, and responsive problems, but they do not prove that the interface is aesthetically good or cognitively clear.",
    "Screenshots are review evidence, not an automatic design score.",
    "Catalog count, age eligibility, unlocked reachability, and required-for-stage count are intentionally reported separately.",
    "Primary-flow checks wait for client hydration and visible links before treating missing navigation as a blocker."
  ]
};

let server = null;
let serverLog = "";

function gitSha() {
  const result = spawnSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : "unknown";
}

function countBy(items, keyOrFn) {
  return items.reduce((counts, item) => {
    const value = typeof keyOrFn === "function" ? keyOrFn(item) : item[keyOrFn];
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function duplicateIds(items) {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of items) {
    if (seen.has(item.id)) duplicates.add(item.id);
    seen.add(item.id);
  }
  return [...duplicates].sort();
}

function slug(value) {
  return value.replace(/^\//, "").replace(/[^a-zA-Z0-9_-]+/g, "-") || "root";
}

function regexEscape(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function blocker(code, message, details = null) {
  report.blockers.push({ code, message, details });
}

function warning(code, message, details = null) {
  report.warnings.push({ code, message, details });
}

function compileLearningModules() {
  rmSync(compiledDir, { recursive: true, force: true });
  const tscBin = path.join(root, "node_modules", "typescript", "bin", "tsc");
  const result = spawnSync(process.execPath, [tscBin, "-p", "tsconfig.learning-tests.json"], {
    cwd: root,
    stdio: "inherit"
  });
  if (result.status !== 0) {
    throw new Error(`learning module compile failed with exit code ${result.status ?? "unknown"}`);
  }
}

function loadLearningModules() {
  const require = createRequire(import.meta.url);
  return {
    system: require(path.join(compiledDir, "src", "lib", "learning", "system.js")),
    curriculum: require(path.join(compiledDir, "src", "lib", "learning", "curriculum.js")),
    catalog: require(path.join(compiledDir, "src", "lib", "learning", "catalog.js")),
    manifest: require(path.join(compiledDir, "src", "lib", "learning", "contentManifest.js"))
  };
}

function auditCatalog({ system, curriculum, catalog, manifest }) {
  const activities = system.ACTIVITIES;
  const subjects = system.SUBJECTS;
  const stages = system.STAGES;
  const lessons = curriculum.LEARNING_LESSONS;
  const paths = curriculum.LEARNING_PATHS;
  const packs = manifest.CONTENT_PACKS;
  const specs = Object.values(catalog.ACTIVITY_LEARNING_SPECS);
  const profileAge = system.DEMO_PROFILE.age;

  const activityCounts = countBy(activities, "subjectId");
  const runtimeCounts = countBy(activities, "runtime");
  const assessmentCounts = countBy(specs, "assessment");
  const coverage = curriculum.getCurriculumCoverage();
  const activityIds = new Set(activities.map((item) => item.id));
  const stageIds = new Set(stages.map((item) => item.id));
  const lessonIds = new Set(lessons.map((item) => item.id));
  const packedActivityRows = packs.flatMap((pack) => pack.activities.map((item) => ({ pack, item })));
  const packedActivityIds = new Set(packedActivityRows.map(({ item }) => item.activityId));

  report.catalog = {
    subjectCount: subjects.length,
    activityCount: activities.length,
    stageCount: stages.length,
    pathCount: paths.length,
    lessonCount: lessons.length,
    packCount: packs.length,
    skillCount: catalog.LEARNING_SKILLS.length,
    assessmentCounts,
    runtimeCounts,
    uncoveredStageIds: coverage.uncoveredStageIds,
    uncoveredActivityIds: coverage.uncoveredActivityIds,
    duplicateSubjectIds: duplicateIds(subjects),
    duplicateStageIds: duplicateIds(stages),
    duplicateActivityIds: duplicateIds(activities),
    duplicateLessonIds: duplicateIds(lessons),
    duplicatePackIds: duplicateIds(packs),
    demoProfile: { id: system.DEMO_PROFILE.id, age: profileAge }
  };

  const expectedSubjectIds = ["bahasa", "english", "math", "iqro", "letters", "logic", "science", "color", "drawing"];
  if (subjects.length !== 9) blocker("catalog.subject_count", `Expected 9 subjects, found ${subjects.length}.`);
  if (activities.length !== 900) blocker("catalog.activity_count", `Expected 900 activities, found ${activities.length}.`);
  if (stages.length !== 46) blocker("catalog.stage_count", `Expected 46 stages, found ${stages.length}.`);
  if (lessons.length !== 197) blocker("catalog.lesson_count", `Expected 197 lessons, found ${lessons.length}.`);
  if (packs.length !== 197) blocker("catalog.pack_count", `Expected 197 content packs, found ${packs.length}.`);
  if (catalog.LEARNING_SKILLS.length !== 200) blocker("catalog.skill_count", `Expected 200 skills, found ${catalog.LEARNING_SKILLS.length}.`);

  for (const [label, ids] of [
    ["subject", report.catalog.duplicateSubjectIds],
    ["stage", report.catalog.duplicateStageIds],
    ["activity", report.catalog.duplicateActivityIds],
    ["lesson", report.catalog.duplicateLessonIds],
    ["pack", report.catalog.duplicatePackIds]
  ]) {
    if (ids.length) blocker(`catalog.duplicate_${label}_ids`, `Duplicate ${label} ids found.`, ids);
  }

  if (coverage.uncoveredStageIds.length) blocker("catalog.uncovered_stages", "Stages exist outside curriculum paths.", coverage.uncoveredStageIds);
  if (coverage.uncoveredActivityIds.length) blocker("catalog.uncovered_activities", "Activities exist outside curriculum lessons.", coverage.uncoveredActivityIds);

  const missingSpecs = activities.filter((activity) => !catalog.ACTIVITY_LEARNING_SPECS[activity.id]).map((activity) => activity.id);
  const missingPacks = activities.filter((activity) => !packedActivityIds.has(activity.id)).map((activity) => activity.id);
  if (missingSpecs.length) blocker("catalog.missing_learning_specs", "Activities without learning specs found.", missingSpecs);
  if (missingPacks.length) blocker("catalog.missing_content_pack", "Activities without content-pack ownership found.", missingPacks);

  const brokenStageActivityIds = stages.flatMap((stage) => stage.activityIds
    .filter((activityId) => !activityIds.has(activityId))
    .map((activityId) => `${stage.id}:${activityId}`));
  if (brokenStageActivityIds.length) blocker("catalog.broken_stage_activity_refs", "Stage activity references point to missing activities.", brokenStageActivityIds);

  const brokenPathStageIds = paths.flatMap((learningPath) => learningPath.stageIds
    .filter((stageId) => !stageIds.has(stageId))
    .map((stageId) => `${learningPath.id}:${stageId}`));
  if (brokenPathStageIds.length) blocker("catalog.broken_path_stage_refs", "Learning path stage references point to missing stages.", brokenPathStageIds);

  const brokenLessonActivityIds = lessons.flatMap((lesson) => lesson.activityIds
    .filter((activityId) => !activityIds.has(activityId))
    .map((activityId) => `${lesson.id}:${activityId}`));
  if (brokenLessonActivityIds.length) blocker("catalog.broken_lesson_activity_refs", "Lesson activity references point to missing activities.", brokenLessonActivityIds);

  const brokenPackLessonIds = packedActivityRows
    .filter(({ item }) => !lessonIds.has(item.lessonId))
    .map(({ pack, item }) => `${pack.id}:${item.activityId}:${item.lessonId}`);
  if (brokenPackLessonIds.length) blocker("catalog.broken_pack_lesson_refs", "Content-pack activity references point to missing lessons.", brokenPackLessonIds);

  for (const subjectId of expectedSubjectIds) {
    const subject = subjects.find((item) => item.id === subjectId);
    if (!subject) {
      blocker("catalog.missing_subject", `Missing expected subject ${subjectId}.`);
      continue;
    }

    const subjectActivities = activities.filter((item) => item.subjectId === subjectId);
    const subjectStages = stages.filter((item) => item.subjectId === subjectId);
    const subjectPaths = paths.filter((item) => item.subjectId === subjectId);
    const subjectLessons = lessons.filter((item) => item.subjectId === subjectId);
    const subjectPacks = packs.filter((item) => item.subjectId === subjectId);
    const eligible = subjectActivities.filter((item) => profileAge >= item.ageMin && profileAge <= item.ageMax);
    const subjectSpecs = subjectActivities.map((item) => catalog.ACTIVITY_LEARNING_SPECS[item.id]).filter(Boolean);
    const eligibleByStage = subjectStages.map((stage) => {
      const stageActivities = subjectActivities.filter((item) => item.stageId === stage.id);
      const eligibleActivities = stageActivities.filter((item) => profileAge >= item.ageMin && profileAge <= item.ageMax);
      return {
        stageId: stage.id,
        title: stage.title,
        total: stageActivities.length,
        eligible: eligibleActivities.length
      };
    });

    const row = {
      id: subjectId,
      title: subject.title,
      catalogActivities: subjectActivities.length,
      eligibleAtDemoAge: eligible.length,
      ineligibleAtDemoAge: subjectActivities.length - eligible.length,
      stages: subjectStages.length,
      paths: subjectPaths.length,
      lessons: subjectLessons.length,
      packs: subjectPacks.length,
      assessed: subjectSpecs.filter((spec) => spec.assessment === "assessed").length,
      practice: subjectSpecs.filter((spec) => spec.assessment === "practice").length,
      requiredForStage: subjectSpecs.filter((spec) => spec.requiredForStage).length,
      runtimes: countBy(subjectActivities, "runtime"),
      stageEligibility: eligibleByStage
    };
    report.subjects.push(row);

    if (subjectActivities.length !== 100) {
      blocker("catalog.subject_not_100", `${subject.title} has ${subjectActivities.length} catalog activities instead of 100.`, { subjectId });
    }

    const emptyEligibleStages = eligibleByStage.filter((stage) => stage.eligible === 0);
    if (emptyEligibleStages.length) {
      warning("ux.stage_no_age_eligible_activity", `${subject.title} has stages with no activity eligible for the demo age.`, emptyEligibleStages);
    }
  }

  report.summary.catalogActivityCounts = activityCounts;
  report.summary.demoAge = profileAge;
}

async function waitForServer(url, timeoutMs = 60_000) {
  const started = Date.now();
  let lastError = null;
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: "follow" });
      if (response.status < 500) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`server did not become ready at ${url}: ${lastError ?? "unknown error"}\n${serverLog.slice(-4000)}`);
}

function startServer() {
  const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
  server = spawn(process.execPath, [nextBin, "start", "-H", host, "-p", String(port)], {
    cwd: root,
    env: {
      ...process.env,
      NODE_ENV: "production",
      NEXT_PUBLIC_SITE_URL: baseUrl,
      NEXT_PUBLIC_DATA_BACKEND: process.env.NEXT_PUBLIC_DATA_BACKEND ?? "local"
    },
    stdio: ["ignore", "pipe", "pipe"]
  });

  const append = (chunk) => { serverLog += chunk.toString(); };
  server.stdout.on("data", append);
  server.stderr.on("data", append);
}

function stopServer() {
  if (!server || server.killed) return;
  server.kill("SIGTERM");
}

async function inspectRoute(page, routePath, options = {}) {
  const consoleErrors = [];
  const pageErrors = [];
  const onConsole = (message) => {
    // A running local server is not evidence that a reset was harmless.
    // Keep every console error actionable, including connection resets.
    if (message.type() === "error") consoleErrors.push(message.text());
  };
  const onPageError = (error) => pageErrors.push(error.message);
  page.on("console", onConsole);
  page.on("pageerror", onPageError);

  try {
    const response = await page.goto(`${baseUrl}${routePath}`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000
    });
    if (!response) throw new Error("navigation returned no response");
    if (response.status() >= 400) throw new Error(`HTTP ${response.status()}`);

    await page.waitForTimeout(options.waitMs ?? 100);
    const bodyText = (await page.locator("body").innerText()).trim();
    if (bodyText.length <= 20) throw new Error("rendered body is unexpectedly blank");
    if (options.expectedActivityPath) {
      const actualPath = new URL(page.url()).pathname;
      if (actualPath !== options.expectedActivityPath) {
        throw new Error(`activity coverage redirected: expected=${options.expectedActivityPath} actual=${actualPath}`);
      }
      if (await page.locator('[data-activity-frame="garden"]').count() !== 1) {
        throw new Error("activity coverage missing rendered Garden activity frame");
      }
    }

    const overlayCount = await page.locator("nextjs-portal, [data-nextjs-dialog-overlay], [data-next-badge-root]").count();
    if (overlayCount) throw new Error("Next.js error overlay rendered");

    const layout = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      htmlWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth
    }));
    if (layout.htmlWidth > layout.viewportWidth + 1 || layout.bodyWidth > layout.viewportWidth + 1) {
      throw new Error(`horizontal overflow viewport=${layout.viewportWidth} html=${layout.htmlWidth} body=${layout.bodyWidth}`);
    }

    if (pageErrors.length) throw new Error(`page errors: ${pageErrors.join(" | ")}`);
    if (consoleErrors.length) throw new Error(`console errors: ${consoleErrors.join(" | ")}`);

    report.browser.routesChecked += 1;
    return { ok: true, bodyTextLength: bodyText.length };
  } finally {
    page.off("console", onConsole);
    page.off("pageerror", onPageError);
  }
}

async function waitForVisible(locator, label, timeout = 8_000) {
  try {
    await locator.waitFor({ state: "visible", timeout });
  } catch {
    throw new Error(`${label} did not become visible after hydration wait`);
  }
}

async function clickLinkAndWait(page, locator, label) {
  await waitForVisible(locator, label);
  const href = await locator.getAttribute("href");
  if (!href) throw new Error(`${label} has no href`);

  await Promise.all([
    page.waitForURL(new RegExp(`${regexEscape(href)}(?:\\?.*)?$`), { timeout: 10_000 }),
    locator.click()
  ]);
  await page.waitForLoadState("domcontentloaded");
  return href;
}

async function waitForActivityGalleryState(page) {
  const activityLink = page.locator(`a[href^="/child/${childId}/activity/"]`).first();
  try {
    await activityLink.waitFor({ state: "visible", timeout: 8_000 });
    return activityLink;
  } catch {
    const body = (await page.locator("body").innerText()).replace(/\s+/g, " ").slice(0, 1200);
    throw new Error(`subject gallery did not expose an activity link after hydration wait; body=${body}`);
  }
}

async function capture(page, routePath, viewportName) {
  const relative = path.join(viewportName, `${slug(routePath)}.png`);
  const absolute = path.join(screenshotDir, relative);
  mkdirSync(path.dirname(absolute), { recursive: true });
  await page.screenshot({ path: absolute, fullPage: false });
  const sha256 = createHash("sha256").update(readFileSync(absolute)).digest("hex");
  report.browser.screenshots.push({
    route: routePath,
    viewport: viewportName,
    file: path.relative(root, absolute),
    sha256
  });
}

async function inspectSubjectExposure(page, subject, system) {
  const routePath = `/child/${childId}/subject/${subject.id}`;
  await inspectRoute(page, routePath);
  await page.locator("[data-activity-gallery]").waitFor({ timeout: 8_000 });
  const expected = system.ACTIVITIES.filter(item => item.subjectId === subject.id).map(item => item.id);
  const exposure = await page.evaluate(({ currentChild }) => ({
    ids: Array.from(document.querySelectorAll("[data-activity-id]")).map(card => card.dataset.activityId),
    playable: document.querySelectorAll(`[data-activity-gallery] a[href^="/child/${currentChild}/activity/"]`).length,
    unavailable: document.querySelectorAll("[data-activity-gallery] article > button").length,
    stageLinks: document.querySelectorAll(`a[href^="/child/${currentChild}/stage/"]`).length
  }), { currentChild: childId });
  if (JSON.stringify([...exposure.ids].sort()) !== JSON.stringify([...expected].sort())) throw new Error(`${subject.id}: gallery does not match the complete activity catalog`);
  if (exposure.stageLinks) throw new Error(`${subject.id}: gallery adds an unwanted category step`);
  if (exposure.playable + exposure.unavailable !== expected.length) throw new Error(`${subject.id}: missing activity controls`);
  const row = {
    subjectId: subject.id,
    catalogCards: exposure.ids.length,
    immediatelyPlayable: exposure.playable,
    unavailableCards: exposure.unavailable,
    intermediateStageLinks: exposure.stageLinks
  };
  report.browser.subjectExposure.push(row);
  if (exposure.playable < Math.min(20, expected.length)) {
    warning(
      "ux.low_fresh_start_activity_exposure",
      `${subject.title} shows all ${expected.length} thumbnails, but only ${exposure.playable} can be played immediately by a fresh demo profile.`,
      row
    );
  }
}

async function inspectFlow(page) {
  const steps = [];
  const home = `/child/${childId}/home`;
  await inspectRoute(page, home);
  steps.push(home);

  await clickLinkAndWait(
    page,
    page.locator(`a[href^="/child/${childId}/subject/"]`).first(),
    "home subject link"
  );
  steps.push(new URL(page.url()).pathname);

  const activityLink = await waitForActivityGalleryState(page);
  const activityHref = await clickLinkAndWait(page, activityLink, "gallery activity link");
  await page.locator('[data-activity-frame="garden"]').waitFor({ timeout: 8_000 });
  if (new URL(page.url()).pathname !== activityHref) throw new Error("primary flow redirected before rendering its activity");
  steps.push(new URL(page.url()).pathname);

  report.browser.flow = {
    status: "PASS",
    steps,
    clickDepthHomeToActivity: steps.length - 1,
    destinationActivity: activityHref
  };
}

async function browserAudit({ system, curriculum }) {
  if (shouldStartServer) {
    startServer();
    await waitForServer(`${baseUrl}/`);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const phoneContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const phonePage = await phoneContext.newPage();

    const majorRoutes = [
      `/child/${childId}/home`,
      `/child/${childId}/learn`,
      `/child/${childId}/games`,
      `/child/${childId}/rewards`,
      "/parent",
      "/parent/children",
      `/parent/children/${childId}`,
      `/parent/children/${childId}/progress`,
      `/parent/children/${childId}/reports`,
      `/parent/children/${childId}/certificates`,
      "/games",
      "/play/math-choice"
    ];

    for (const routePath of majorRoutes) await inspectRoute(phonePage, routePath);
    for (const subject of system.SUBJECTS) {
      await inspectSubjectExposure(phonePage, subject, system, curriculum);
    }
    for (const stage of system.STAGES) {
      await inspectRoute(phonePage, `/child/${childId}/stage/${stage.id}`);
    }

    try {
      await inspectFlow(phonePage);
    } catch (error) {
      report.browser.flow = { status: "FAIL", error: String(error?.message ?? error) };
      blocker("browser.primary_learning_flow", "Primary fresh-demo learning flow failed.", report.browser.flow);
    }

    const phoneCaptureRoutes = [
      `/child/${childId}/home`,
      `/child/${childId}/learn`,
      ...system.SUBJECTS.map((subject) => `/child/${childId}/subject/${subject.id}`),
      ...system.STAGES.map((stage) => `/child/${childId}/stage/${stage.id}`),
      `/parent/children/${childId}/reports`
    ];

    for (const routePath of phoneCaptureRoutes) {
      await inspectRoute(phonePage, routePath, { waitMs: 150 });
      await capture(phonePage, routePath, "390x844");
    }
    await phoneContext.close();

    for (const viewport of [
      { name: "768x1024", width: 768, height: 1024 },
      { name: "1440x900", width: 1440, height: 900 }
    ]) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
      const page = await context.newPage();
      const captureRoutes = [
        `/child/${childId}/home`,
        `/child/${childId}/learn`,
        ...system.SUBJECTS.map((subject) => `/child/${childId}/subject/${subject.id}`),
        `/parent/children/${childId}/reports`
      ];

      for (const routePath of captureRoutes) {
        await inspectRoute(page, routePath, { waitMs: 150 });
        await capture(page, routePath, viewport.name);
      }
      await context.close();
    }

    if (fullActivityCrawl) {
      const failures = [];
      let activityIndex = 0;
      const workerCount = Math.min(activityConcurrency, system.ACTIVITIES.length);

      await Promise.all(Array.from({ length: workerCount }, async () => {
        const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
        const page = await context.newPage();
        try {
          while (true) {
            const currentIndex = activityIndex;
            activityIndex += 1;
            if (currentIndex >= system.ACTIVITIES.length) return;
            const activity = system.ACTIVITIES[currentIndex];

            try {
              const activityPath = `/child/${childId}/activity/${activity.id}`;
              await inspectRoute(page, activityPath, { waitMs: activityWaitMs, expectedActivityPath: activityPath });
              report.browser.activityRoutesChecked += 1;
            } catch (error) {
              failures.push({
                activityId: activity.id,
                error: String(error?.message ?? error)
              });
            }
          }
        } finally {
          await context.close();
        }
      }));

      if (failures.length) {
        blocker(
          "browser.activity_route_failures",
          `${failures.length} activity routes failed structural browser smoke.`,
          failures
        );
      }
    }
  } finally {
    await browser.close();
  }
}

function markdownTable(headers, rows) {
  const escape = (value) => String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
  return [
    `| ${headers.map(escape).join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(escape).join(" | ")} |`)
  ].join("\n");
}

function writeReports() {
  report.summary.status = report.blockers.length ? "FAIL" : "PASS";
  report.summary.blockerCount = report.blockers.length;
  report.summary.warningCount = report.warnings.length;
  report.summary.screenshotCount = report.browser.screenshots.length;
  report.summary.routesChecked = report.browser.routesChecked;
  report.summary.activityRoutesChecked = report.browser.activityRoutesChecked;

  writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`);

  const subjectRows = report.subjects.map((subject) => [
    subject.title,
    subject.catalogActivities,
    subject.eligibleAtDemoAge,
    subject.assessed,
    subject.practice,
    subject.requiredForStage,
    subject.stages,
    subject.lessons
  ]);

  const exposureRows = report.browser.subjectExposure.map((row) => [
    row.subjectId,
    row.catalogCards,
    row.immediatelyPlayable,
    row.unavailableCards,
    row.intermediateStageLinks
  ]);

  const blockerText = report.blockers.length
    ? report.blockers.map((item) => `- **${item.code}** — ${item.message}${item.details ? `\n  - details: \`${JSON.stringify(item.details).slice(0, 1500)}\`` : ""}`).join("\n")
    : "- None.";

  const warningText = report.warnings.length
    ? report.warnings.map((item) => `- **${item.code}** — ${item.message}${item.details ? `\n  - details: \`${JSON.stringify(item.details).slice(0, 1500)}\`` : ""}`).join("\n")
    : "- None.";

  const markdown = `# Mainlagi Local Product QA

Generated: ${report.generatedAt}

Git SHA: \`${report.gitSha}\`

Status: **${report.summary.status}**

## Scope

This local QA separates catalog truth, age eligibility, fresh-profile UI reachability, browser health, and visual evidence. It does not pretend to automatically score design taste or cognitive clarity.

## Catalog baseline

- Subjects: ${report.catalog.subjectCount ?? "n/a"}
- Activities: ${report.catalog.activityCount ?? "n/a"}
- Stages: ${report.catalog.stageCount ?? "n/a"}
- Lessons: ${report.catalog.lessonCount ?? "n/a"}
- Content packs: ${report.catalog.packCount ?? "n/a"}
- Skills: ${report.catalog.skillCount ?? "n/a"}
- Demo age: ${report.catalog.demoProfile?.age ?? "n/a"}

${markdownTable(["Subject", "Catalog", "Eligible @ demo age", "Assessed", "Practice", "Required", "Stages", "Lessons"], subjectRows)}

## Fresh-profile exposure

This is the critical distinction behind “100 activities per subject”: the catalog may contain 100 while a fresh child can only reach a subset through currently unlocked stages.

${exposureRows.length ? markdownTable(["Subject", "Catalog thumbnails", "Immediately playable", "Locked / age-restricted cards", "Intermediate stage links"], exposureRows) : "Browser exposure audit did not complete."}

## Browser

- Routes checked: ${report.browser.routesChecked}
- Activity routes checked: ${report.browser.activityRoutesChecked}
- Screenshots: ${report.browser.screenshots.length}
- Primary flow: ${report.browser.flow?.status ?? "not-run"}
- Home → activity click depth: ${report.browser.flow?.clickDepthHomeToActivity ?? "n/a"}

Screenshots: \`.qa/screenshots/\`

## Blockers

${blockerText}

## UX / product warnings

${warningText}

## Interpretation boundary

${report.notes.map((note) => `- ${note}`).join("\n")}
`;
  writeFileSync(reportMarkdownPath, markdown);
}

async function main() {
  rmSync(outputDir, { recursive: true, force: true });
  mkdirSync(screenshotDir, { recursive: true });
  report.gitSha = gitSha();

  try {
    compileLearningModules();
    const modules = loadLearningModules();
    auditCatalog(modules);
    await browserAudit(modules);
  } catch (error) {
    blocker("qa.unhandled_error", "Local product QA aborted unexpectedly.", String(error?.stack ?? error));
  } finally {
    stopServer();
    writeReports();
  }

  console.log(`Local product QA ${report.summary.status}: ${report.summary.blockerCount} blocker(s), ${report.summary.warningCount} warning(s).`);
  console.log(`Report: ${path.relative(root, reportMarkdownPath)}`);
  console.log(`JSON:   ${path.relative(root, reportJsonPath)}`);
  console.log(`Shots:  ${path.relative(root, screenshotDir)}`);
  if (report.blockers.length) process.exitCode = 1;
}

main();
