import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_CHARACTER_BELAJAR_QA_PORT ?? 4056);
const baseUrl = `http://${host}:${port}`;
const viewport = { width: 390, height: 844 };

let server = null;
let serverLog = "";

function startServer() {
  const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
  server = spawn(process.execPath, [nextBin, "start", "-H", host, "-p", String(port)], {
    cwd: root,
    env: {
      ...process.env,
      NODE_ENV: "production",
      NEXT_PUBLIC_SITE_URL: baseUrl,
      NEXT_PUBLIC_DATA_BACKEND: "local"
    },
    stdio: ["ignore", "pipe", "pipe"]
  });
  const append = (chunk) => { serverLog += chunk.toString(); };
  server.stdout.on("data", append);
  server.stderr.on("data", append);
}

async function waitForServer(route, timeoutMs = 60_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(`${baseUrl}${route}`, { redirect: "follow" });
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`Character Belajar QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer() {
  if (server && !server.killed) server.kill("SIGTERM");
}

async function seedEnglishPrerequisiteReadiness(context) {
  await context.addInitScript(() => {
    const childId = "demo-gian";
    const progressKey = "mainlagi-learning-progress-v1";
    const attemptsKey = "mainlagi-learning-attempts-v1";
    const required = [
      {
        activityId: "english-find-blue",
        skillId: "english.color.blue",
        runtime: "tap_choice",
        correctCount: 1
      },
      {
        activityId: "english-listen-cat",
        skillId: "english.word.cat.listening",
        runtime: "listen_and_choose",
        correctCount: 1
      },
      {
        activityId: "english-match-hello",
        skillId: "english.word.picture_matching",
        runtime: "matching",
        correctCount: 2
      }
    ];

    localStorage.setItem(progressKey, JSON.stringify({
      [childId]: {
        completedActivityIds: required.map((item) => item.activityId),
        stars: 0,
        lastActivityId: required.at(-1)?.activityId ?? null
      }
    }));

    const attempts = required.map((item, index) => {
      const attemptId = `qa-character-session06-english-prereq-${index}`;
      const completedAt = `2026-09-25T05:0${index}:00.000Z`;
      return {
        id: attemptId,
        childId,
        activityId: item.activityId,
        subjectId: "english",
        stageId: "english-first-words",
        runtime: item.runtime,
        difficulty: item.runtime === "matching" ? 2 : 1,
        status: "completed",
        assessed: true,
        score: 1,
        accuracy: 1,
        correctCount: item.correctCount,
        incorrectCount: 0,
        hintCount: 0,
        retryCount: 0,
        durationMs: 1000,
        inputMode: item.runtime === "listen_and_choose" ? "audio" : "touch",
        startedAt: completedAt,
        completedAt,
        metadata: { source: "character-session06-browser-prerequisite" },
        evidence: [{
          attemptId,
          activityId: item.activityId,
          skillId: item.skillId,
          score: 1,
          weight: 1,
          createdAt: completedAt,
          qualifiesForMastery: true
        }],
        masteryEligible: true
      };
    });

    localStorage.setItem(attemptsKey, JSON.stringify({ [childId]: attempts }));
  });
}

async function waitForMoment(page, moment, state, timeout = 4_000) {
  try {
    await page.waitForFunction(
      ({ expectedMoment, expectedState }) => {
        const frame = document.querySelector('[data-activity-frame="garden"]');
        return frame?.getAttribute("data-character-moment") === expectedMoment
          && frame?.getAttribute("data-character-state") === expectedState;
      },
      { expectedMoment: moment, expectedState: state },
      { timeout }
    );
  } catch (error) {
    const snapshot = await page.locator('[data-activity-frame="garden"]').evaluate((frame) => ({
      moment: frame.getAttribute("data-character-moment"),
      state: frame.getAttribute("data-character-state"),
      source: frame.getAttribute("data-character-source"),
      left: frame.getAttribute("data-character-left"),
      right: frame.getAttribute("data-character-right"),
      pathname: window.location.pathname
    })).catch(() => null);
    throw new Error(
      `Character moment timeout: expected ${moment}/${state}, actual ${JSON.stringify(snapshot)}`,
      { cause: error }
    );
  }
}

async function assertPair(page, expectedIds, state) {
  const frame = page.locator('[data-activity-frame="garden"]');
  assert.equal(await frame.getAttribute("data-character-left"), expectedIds[0]);
  assert.equal(await frame.getAttribute("data-character-right"), expectedIds[1]);
  assert.equal(await frame.getAttribute("data-character-source"), "subject-preference");

  const images = page.locator("[data-character-layer] img");
  assert.equal(await images.count(), 2, "Belajar must render exactly two shared foreground characters");
  const snapshot = await images.evaluateAll((items) => items.map((item) => ({
    id: item.getAttribute("data-character-id"),
    state: item.getAttribute("data-character-state"),
    source: item.getAttribute("data-character-asset-source"),
    src: item.getAttribute("src")
  })));
  assert.deepEqual(snapshot.map((item) => item.id), expectedIds);
  assert(snapshot.every((item) => item.state === state), `both characters must use ${state}`);
  assert(snapshot.every((item) => item.source === "svg-state"), "Belajar must use the approved SVG state bank");
  for (const item of snapshot) {
    const normalizedState = state === "try_again" ? "try-again" : state;
    assert.equal(item.src, `/artwork/characters/${item.id}-${normalizedState}-v1.svg`);
  }
}

async function inspectEnglish(page) {
  const route = "/child/demo-gian/activity/english-letter-a";
  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
  assert(response && response.status() < 400, "English character route must return successfully");
  await page.waitForLoadState("load");
  await page.locator("[data-symbol-hunt]").waitFor({ state: "visible", timeout: 6_000 });
  assert.equal(new URL(page.url()).pathname, route, "English representative route must not be redirected");

  await waitForMoment(page, "waiting", "hero", 12_000);
  await assertPair(page, ["naya", "zia"], "hero");

  await page.getByRole("button", { name: "Dengar petunjuk", exact: true }).click();
  await waitForMoment(page, "guide", "pointing");
  await assertPair(page, ["naya", "zia"], "pointing");
  await waitForMoment(page, "waiting", "hero");

  await page.getByRole("button", { name: "Letter H", exact: true }).click();
  await waitForMoment(page, "retry", "try_again");
  await assertPair(page, ["naya", "zia"], "try_again");

  await page.getByRole("button", { name: "Letter A", exact: true }).click();
  await waitForMoment(page, "correct", "correct");
  await assertPair(page, ["naya", "zia"], "correct");
  await waitForMoment(page, "completion", "celebrate");
  await assertPair(page, ["naya", "zia"], "celebrate");
}

async function inspectMath(page) {
  const route = "/child/demo-gian/activity/math-count-3";
  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
  assert(response && response.status() < 400, "Math character route must return successfully");
  await page.waitForLoadState("load");
  await page.locator("[data-count-select]").waitFor({ state: "visible", timeout: 6_000 });
  assert.equal(new URL(page.url()).pathname, route, "Math representative route must not be redirected");

  await waitForMoment(page, "waiting", "hero", 12_000);
  await assertPair(page, ["gian", "paca"], "hero");

  await page.getByRole("button", { name: "Pilih jumlah 2", exact: true }).click();
  await waitForMoment(page, "retry", "try_again");
  await assertPair(page, ["gian", "paca"], "try_again");

  await page.getByRole("button", { name: "Pilih jumlah 3", exact: true }).click();
  await waitForMoment(page, "correct", "correct");
  await assertPair(page, ["gian", "paca"], "correct");
  await waitForMoment(page, "completion", "celebrate");
  await assertPair(page, ["gian", "paca"], "celebrate");
}

async function main() {
  const firstRoute = "/child/demo-gian/activity/english-letter-a";
  startServer();
  await waitForServer(firstRoute);

  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce", hasTouch: true });
    await seedEnglishPrerequisiteReadiness(context);
    const page = await context.newPage();
    const pageErrors = [];
    const consoleErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await inspectEnglish(page);
    await inspectMath(page);

    assert.deepEqual(pageErrors, [], `character Belajar QA raised page errors: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors, [], `character Belajar QA logged console errors: ${consoleErrors.join(" | ")}`);
    await context.close();
  } finally {
    await browser.close();
  }

  console.log("Belajar character browser regression passed: English Naya/Zia and Math Gian/Paca use approved SVG hero, guide, retry, correct, and completion states through the shared runtime.");
}

main()
  .catch((error) => {
    console.error(error);
    console.error(serverLog.slice(-6000));
    process.exitCode = 1;
  })
  .finally(stopServer);
