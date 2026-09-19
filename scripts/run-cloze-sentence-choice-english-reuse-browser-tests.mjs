import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_CLOZE_ENGLISH_QA_PORT ?? 4046);
const baseUrl = `http://${host}:${port}`;
const route = "/child/demo-gian/activity/english-complete-cat-sleeps";
const activityId = "english-complete-cat-sleeps";
const correctChoice = "SLEEPS";
const screenshotDir = path.join(root, ".mobile-route-qa");
const cases = [
  { viewport: { width: 320, height: 720 }, completionMode: "touch" },
  { viewport: { width: 390, height: 844 }, completionMode: "pointer" },
  { viewport: { width: 768, height: 1024 }, completionMode: "touch" }
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
  while (Date.now() - started < 60000) {
    try {
      const response = await fetch(`${baseUrl}${route}`);
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`English cloze QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

function stopServer() {
  if (server && !server.killed) server.kill("SIGTERM");
}

async function seedPrerequisiteReadiness(context) {
  await context.addInitScript(() => {
    const childId = "demo-gian";
    const progressKey = "mainlagi-learning-progress-v1";
    const attemptsKey = "mainlagi-learning-attempts-v1";
    const seeds = [
      ["english-food-apple", "english.vocab.food", "tap_choice"],
      ["english-listen-milk", "english.vocab.food", "listen_and_choose"],
      ["english-match-food-rice-apple", "english.vocab.food", "matching"],
      ["english-action-run", "english.vocab.actions", "tap_choice"],
      ["english-listen-sleep", "english.vocab.actions", "listen_and_choose"],
      ["english-match-actions-eat-read", "english.vocab.actions", "matching"],
      ["english-category-food", "english.vocab.category", "tap_choice"],
      ["english-match-category-body-object", "english.vocab.category", "matching"],
      ["english-picture-pair-apple-banana", "english.word.picture_matching.expanded", "matching"],
      ["english-picture-pair-eyes-hand", "english.word.picture_matching.expanded", "matching"],
      ["english-listen-apple-review", "english.word.listening", "listen_and_choose"],
      ["english-listen-hand-review", "english.word.listening", "listen_and_choose"]
    ];
    const requiredIds = seeds.map(([id]) => id);
    localStorage.setItem(progressKey, JSON.stringify({
      [childId]: {
        completedActivityIds: requiredIds,
        stars: 0,
        lastActivityId: requiredIds.at(-1)
      }
    }));

    const attempts = seeds.map(([seedActivityId, skillId, runtime], index) => {
      const attemptId = `qa-cloze-english-prereq-${index}`;
      const completedAt = `2026-09-19T07:${String(index).padStart(2, "0")}:00.000Z`;
      return {
        id: attemptId,
        childId,
        activityId: seedActivityId,
        subjectId: "english",
        stageId: "english-words-actions",
        runtime,
        difficulty: 2,
        status: "completed",
        assessed: true,
        score: 1,
        accuracy: 1,
        correctCount: runtime === "matching" ? 2 : 1,
        incorrectCount: 0,
        hintCount: 0,
        retryCount: 0,
        durationMs: 1000,
        inputMode: "touch",
        startedAt: completedAt,
        completedAt,
        metadata: { source: "cloze-english-browser-prerequisite" },
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

async function waitForScene(page) {
  await page.waitForLoadState("load");
  await page.waitForFunction(() => {
    const scene = document.querySelector("[data-cloze-sentence-choice]");
    return (
      scene?.getAttribute("data-cloze-sentence-choice-ready") === "true" &&
      scene?.getAttribute("data-cloze-locale") === "en-US" &&
      scene.querySelectorAll("[data-cloze-answer]").length === 3 &&
      Boolean(scene.querySelector("[data-cloze-slot]"))
    );
  }, undefined, { timeout: 6000 });
  await page.waitForTimeout(80);
}

async function completed(page) {
  return page.evaluate(({ id }) => {
    const progress = JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1") ?? "{}");
    return (progress["demo-gian"]?.completedActivityIds ?? []).includes(id);
  }, { id: activityId });
}

async function keyboardWrongChoice(page) {
  for (let step = 0; step < 96; step += 1) {
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => ({
      choice: Boolean(document.activeElement?.hasAttribute?.("data-cloze-answer")),
      label: (document.activeElement?.textContent ?? "").trim()
    }));
    if (focused.choice && focused.label !== correctChoice) {
      await page.keyboard.press("Enter");
      return focused.label;
    }
  }
  throw new Error("Keyboard navigation did not reach a wrong English cloze answer");
}

async function assertFullyVisible(locator, viewportHeight, label) {
  const box = await locator.boundingBox();
  assert(box, `${label} must render`);
  assert(box.y >= -1 && box.y + box.height <= viewportHeight + 1, `${label} must remain fully visible in viewport`);
}

async function completeCorrect(page, completionMode) {
  const button = page.getByRole("button", { name: correctChoice, exact: true });
  if (completionMode === "pointer") {
    await button.click();
    return;
  }
  const box = await button.boundingBox();
  assert(box, "correct English cloze choice must have a touchable box");
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
}

async function inspect({ viewport, completionMode }) {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport,
      reducedMotion: "reduce",
      hasTouch: true
    });
    await seedPrerequisiteReadiness(context);
    const page = await context.newPage();
    const pageErrors = [];
    const consoleErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    assert(response && response.status() < 400, `English cloze bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    assert.equal(new URL(page.url()).pathname, route, `progression guard must accept legitimate English readiness at ${viewport.width}`);

    assert.equal(await page.getByRole("heading", { name: "Complete the sentence" }).count(), 1, "English heading must render");
    assert.equal(await page.getByText("Choose the word that makes the sentence complete and meaningful.").count(), 1, "English instruction must render");
    const sentence = page.locator("[data-cloze-sentence]");
    const slot = page.locator("[data-cloze-slot]");
    const choices = page.locator("[data-cloze-answer]");
    assert.equal(await sentence.getAttribute("aria-label"), "Sentence to complete", "English sentence aria label must render");
    assert.equal((await sentence.textContent())?.includes("Complete: The cat"), true, "English sentence keeps canonical prefix");
    assert.equal((await sentence.textContent())?.includes("."), true, "English sentence keeps canonical suffix");
    assert.equal((await slot.textContent())?.trim(), "_____", "idle English cloze slot is visibly empty");
    assert.deepEqual(await choices.allTextContents(), ["SLEEPS", "BOOK", "YELLOW"], "English choices keep canonical order");
    assert.equal(await completed(page), false, "idle English cloze state cannot complete");

    const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const scrollWidth = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth));
    assert(scrollWidth <= viewportWidth + 1, `English cloze overflows horizontally at ${viewport.width}`);

    for (const box of await choices.evaluateAll((items) =>
      items.map((node) => {
        const rect = node.getBoundingClientRect();
        return { width: rect.width, height: rect.height, left: rect.left, right: rect.right };
      })
    )) {
      assert(box.width >= 44 && box.height >= 44, "English cloze choices keep minimum touch target");
      assert(box.left >= -1 && box.right <= viewportWidth + 1, "English cloze choices remain inside viewport");
    }

    const status = page.getByRole("status");
    await assertFullyVisible(sentence, viewportHeight, `English cloze sentence at ${viewport.width}`);
    await assertFullyVisible(status, viewportHeight, `English idle feedback at ${viewport.width}`);
    mkdirSync(screenshotDir, { recursive: true });
    await page.screenshot({
      path: path.join(screenshotDir, `${viewport.width}-cloze-english-idle.png`),
      fullPage: false
    });

    const wrongChoice = await keyboardWrongChoice(page);
    assert.notEqual(wrongChoice, correctChoice);
    await status.filter({ hasText: "Not quite" }).waitFor({ state: "visible", timeout: 2000 });
    assert.equal((await slot.textContent())?.trim(), wrongChoice, "wrong English selection binds visibly into the blank");
    assert.equal(await slot.getAttribute("data-slot-state"), "try", "English slot exposes retry state");
    assert.equal(await completed(page), false, "wrong English cloze choice cannot complete");
    await assertFullyVisible(status, viewportHeight, `English retry feedback at ${viewport.width}`);
    await page.screenshot({
      path: path.join(screenshotDir, `${viewport.width}-cloze-english-try.png`),
      fullPage: false
    });

    await completeCorrect(page, completionMode);
    await status.filter({ hasText: "Correct!" }).waitFor({ state: "visible", timeout: 2000 });
    assert.equal((await slot.textContent())?.trim(), correctChoice, "correct English selection binds visibly into the blank");
    assert.equal(await slot.getAttribute("data-slot-state"), "good", "English slot exposes success state");
    assert.equal(await completed(page), true, "correct English cloze choice completes canonical activity");
    const nextLink = page.getByRole("link", { name: "Choose another activity" });
    await assertFullyVisible(status, viewportHeight, `English success feedback at ${viewport.width}`);
    await assertFullyVisible(nextLink, viewportHeight, `English success CTA at ${viewport.width}`);

    const state = await page.evaluate(({ id }) => {
      const attempts = JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1") ?? "{}");
      const list = attempts["demo-gian"] ?? [];
      return [...list].reverse().find((item) => item.activityId === id);
    }, { id: activityId });
    assert(state, "English cloze records attempt evidence");
    assert.equal(state.assessed, true);
    assert.equal(state.metadata?.source, "cloze-sentence-choice-runtime");
    assert.equal(state.metadata?.evidenceFidelity, "choice_cloze_sentence_interaction");
    assert.equal(state.metadata?.selectedChoice, correctChoice);
    assert.equal(state.correctCount, 1);
    assert.equal(state.incorrectCount, 1);
    assert.equal(state.retryCount, 1);
    assert.equal(state.accuracy, 0.5);

    await page.screenshot({
      path: path.join(screenshotDir, `${viewport.width}-cloze-english-success.png`),
      fullPage: false
    });
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
  for (const item of cases) await inspect(item);
  console.log("English Cloze Sentence Choice browser QA passed 3 viewports with English locale/copy, keyboard retry, pointer + touchscreen completion, touch targets, screenshots and assessed evidence.");
}

main()
  .catch((error) => {
    console.error(error);
    console.error(serverLog.slice(-6000));
    process.exitCode = 1;
  })
  .finally(stopServer);
