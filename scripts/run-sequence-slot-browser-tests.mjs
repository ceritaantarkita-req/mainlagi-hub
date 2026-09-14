import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_SEQUENCE_SLOT_QA_PORT ?? 4014);
const baseUrl = `http://${host}:${port}`;
const route = "/child/demo-gian/activity/letters-order-after-g";
const activityId = "letters-order-after-g";
const correctChoice = "H";
const screenshotDir = path.join(root, ".mobile-route-qa");
const viewports = [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 }
];
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

async function waitForServer() {
  const started = Date.now();
  while (Date.now() - started < 60_000) {
    try {
      const response = await fetch(`${baseUrl}${route}`);
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`Sequence-slot QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer() {
  if (server && !server.killed) server.kill("SIGTERM");
}

async function seedPrerequisiteReadiness(context) {
  await context.addInitScript(() => {
    const childId = "demo-gian";
    const progressKey = "mainlagi-learning-progress-v1";
    const attemptsKey = "mainlagi-learning-attempts-v1";
    const requiredIds = [
      "letters-find-upper-b",
      "letters-find-upper-e",
      "letters-find-lower-b",
      "letters-find-lower-e",
      "letters-match-case-cd",
      "letters-match-case-bce",
      "letters-discriminate-upper-b",
      "letters-discriminate-lower-bd"
    ];

    localStorage.setItem(progressKey, JSON.stringify({
      [childId]: {
        completedActivityIds: requiredIds,
        stars: 0,
        lastActivityId: requiredIds.at(-1)
      }
    }));

    const evidenceSeeds = [
      ["letters-find-upper-b", "letters.latin.uppercase.recognition.early"],
      ["letters-find-lower-b", "letters.latin.lowercase.recognition.early"],
      ["letters-match-case-cd", "letters.latin.case_matching.early"],
      ["letters-discriminate-upper-b", "letters.latin.visual_discrimination.early"]
    ];
    const attempts = evidenceSeeds.map(([seedActivityId, skillId], index) => {
      const attemptId = `qa-sequence-prereq-${index}`;
      const completedAt = `2026-09-14T10:0${index}:00.000Z`;
      return {
        id: attemptId,
        childId,
        activityId: seedActivityId,
        subjectId: "letters",
        stageId: "letters-recognition-prewriting-basics",
        runtime: seedActivityId.includes("match-case") ? "matching" : "tap_choice",
        difficulty: 2,
        status: "completed",
        assessed: true,
        score: 1,
        accuracy: 1,
        correctCount: 1,
        incorrectCount: 0,
        hintCount: 0,
        retryCount: 0,
        durationMs: 1000,
        inputMode: "touch",
        startedAt: completedAt,
        completedAt,
        metadata: { source: "sequence-slot-browser-prerequisite" },
        evidence: [{
          attemptId,
          activityId: seedActivityId,
          skillId,
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

async function waitForHydratedBoard(page) {
  await page.waitForLoadState("load");
  await page.waitForFunction(() => {
    const scene = document.querySelector("[data-sequence-slot]");
    return scene?.getAttribute("data-sequence-slot-ready") === "true" && scene.querySelectorAll("[data-sequence-choices] button").length === 3;
  }, undefined, { timeout: 6_000 });
  await page.waitForTimeout(80);
}

async function chooseWrongWithKeyboard(page) {
  const trace = [];
  for (let step = 0; step < 96; step += 1) {
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => {
      const element = document.activeElement;
      return {
        inChoices: Boolean(element?.closest?.("[data-sequence-choices]")),
        tag: element?.tagName ?? "",
        label: element?.getAttribute?.("aria-label") ?? ""
      };
    });
    trace.push(`${focused.tag}:${focused.label || "(no label)"}`);
    if (focused.inChoices && focused.tag === "BUTTON" && focused.label !== "Pilih huruf H") {
      await page.keyboard.press("Enter");
      return focused.label;
    }
  }
  throw new Error(`Keyboard navigation did not reach a wrong sequence candidate. Focus trace: ${focusTrace.join(" -> ")}`);
}

async function inspect(viewport) {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    await seedPrerequisiteReadiness(context);
    const page = await context.newPage();
    const pageErrors = [];
    const consoleErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });

    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    assert(response && response.status() < 400, `sequence slot bad HTTP at ${viewport.width}`);
    await waitForHydratedBoard(page);
    assert.equal(new URL(page.url()).pathname, route, `progression guard must accept seeded sequence prerequisites at ${viewport.width}`);

    const scene = page.locator("[data-sequence-slot]");
    await scene.waitFor({ state: "visible", timeout: 5_000 });
    const choices = page.locator("[data-sequence-choices] button");
    assert.equal(await choices.count(), 3, "representative sequence activity keeps three canonical choices");

    const choiceGeometry = await choices.evaluateAll((nodes) => nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return { width: rect.width, height: rect.height, left: rect.left, right: rect.right, top: rect.top };
    }));
    const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const scrollWidth = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth));
    assert(scrollWidth <= viewportWidth + 1, `sequence slot overflows at ${viewport.width}`);
    for (const choice of choiceGeometry) {
      assert(choice.width >= 44 && choice.height >= 44, "sequence candidate keeps touch target");
      assert(choice.left >= -1 && choice.right <= viewportWidth + 1, "sequence candidate remains inside viewport");
    }
    assert.equal(new Set(choiceGeometry.map((item) => Math.round(item.top))).size, 1, `three sequence candidates stay on one balanced row at ${viewport.width}`);

    const target = page.locator("[data-sequence-slot-target]");
    assert.equal((await target.textContent())?.trim(), "?", "sequence slot begins visibly empty");
    const railText = await page.locator('[aria-label="Urutan huruf dengan satu bagian kosong"]').textContent();
    assert.equal(railText?.replace(/\s+/g, ""), "G?I", "representative board communicates the G _ I sequence");

    mkdirSync(screenshotDir, { recursive: true });
    await page.screenshot({ path: path.join(screenshotDir, `${viewport.width}-sequence-slot-idle.png`), fullPage: false });

    const wrongLabel = await chooseWrongWithKeyboard(page);
    assert.notEqual(wrongLabel, `Pilih huruf ${correctChoice}`);
    await page.getByRole("status").filter({ hasText: "Belum tepat" }).waitFor({ state: "visible", timeout: 2_000 });
    assert.notEqual((await target.textContent())?.trim(), "?", "wrong keyboard answer is placed visibly in the slot");
    await page.screenshot({ path: path.join(screenshotDir, `${viewport.width}-sequence-slot-try.png`), fullPage: false });

    await page.getByRole("button", { name: `Pilih huruf ${correctChoice}` }).click();
    await page.getByRole("status").filter({ hasText: "Tepat" }).waitFor({ state: "visible", timeout: 2_000 });
    assert.equal((await target.textContent())?.trim(), correctChoice, "correct answer visibly completes the sequence");

    const nextLink = page.getByRole("link", { name: "Pilih permainan lain" });
    const nextLinkBox = await nextLink.boundingBox();
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    assert(nextLinkBox, "success CTA must render");
    assert(nextLinkBox.y >= -1 && nextLinkBox.y + nextLinkBox.height <= viewportHeight + 1, `success CTA must remain fully visible at ${viewport.width}`);

    const state = await page.evaluate(({ activityId: id }) => {
      const progress = JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1") ?? "{}");
      const attempts = JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1") ?? "{}");
      const list = attempts["demo-gian"] ?? [];
      return {
        completed: (progress["demo-gian"]?.completedActivityIds ?? []).includes(id),
        attempt: [...list].reverse().find((item) => item.activityId === id)
      };
    }, { activityId });

    assert.equal(state.completed, true, "sequence slot completes canonical activity");
    assert(state.attempt, "sequence slot records attempt evidence");
    assert.equal(state.attempt.assessed, true, "alphabet ordering remains assessed");
    assert.equal(state.attempt.metadata?.evidenceFidelity, "choice_sequence_interaction", "explicit sequence interaction owns evidence");
    assert.equal(state.attempt.correctCount, 1);
    assert.equal(state.attempt.incorrectCount, 1);
    assert.equal(state.attempt.retryCount, 1);
    assert.equal(state.attempt.accuracy, 0.5);

    await page.screenshot({ path: path.join(screenshotDir, `${viewport.width}-sequence-slot-success.png`), fullPage: false });
    assert.deepEqual(pageErrors, [], `page errors at ${viewport.width}: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors, [], `console errors at ${viewport.width}: ${consoleErrors.join(" | ")}`);
    await context.close();
  } finally {
    await browser.close();
  }
}

async function main() {
  startServer();
  await waitForServer();
  for (const viewport of viewports) await inspect(viewport);
  console.log(`Sequence-slot browser QA passed ${viewports.length} viewports with progression, keyboard wrong-state, pointer completion, layout, in-viewport CTA, and assessed evidence checks.`);
}

main()
  .catch((error) => {
    console.error(error);
    console.error(serverLog.slice(-6000));
    process.exitCode = 1;
  })
  .finally(stopServer);
