import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_CLOZE_SENTENCE_QA_PORT ?? 4040);
const baseUrl = `http://${host}:${port}`;
const route = "/child/demo-gian/activity/bahasa-lengkap-ayah-minum";
const activityId = "bahasa-lengkap-ayah-minum";
const correctChoice = "air";
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
  const append = (chunk) => {
    serverLog += chunk.toString();
  };
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
  throw new Error(`Cloze Sentence Choice QA server did not become ready.\n${serverLog.slice(-4000)}`);
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
      ["bahasa-urut-ibu-memasak", "bahasa.kalimat.order", "tap_choice"],
      ["bahasa-urut-siti-membaca", "bahasa.kalimat.order", "tap_choice"],
      ["bahasa-makna-rina-apel", "bahasa.kalimat.comprehension", "tap_choice"],
      ["bahasa-makna-ayah-koran", "bahasa.kalimat.comprehension", "tap_choice"],
      ["bahasa-instruksi-ambil-buku", "bahasa.instruksi.listening", "listen_and_choose"],
      ["bahasa-instruksi-angkat-tangan", "bahasa.instruksi.listening", "listen_and_choose"],
      ["bahasa-relasi-panas-dingin", "bahasa.kosakata.relations", "matching"],
      ["bahasa-relasi-senang-gembira", "bahasa.kosakata.relations", "matching"],
      ["bahasa-baca-lala-kucing", "bahasa.bacaan.short_comprehension", "tap_choice"],
      ["bahasa-baca-raka-sarapan", "bahasa.bacaan.short_comprehension", "tap_choice"]
    ];
    const requiredIds = seeds.map(([id]) => id);
    localStorage.setItem(
      progressKey,
      JSON.stringify({
        [childId]: {
          completedActivityIds: requiredIds,
          stars: 0,
          lastActivityId: requiredIds.at(-1)
        }
      })
    );

    const attempts = seeds.map(([seedActivityId, skillId, runtime], index) => {
      const attemptId = `qa-cloze-prereq-${index}`;
      const completedAt = `2026-09-17T02:${String(index).padStart(2, "0")}:00.000Z`;
      return {
        id: attemptId,
        childId,
        activityId: seedActivityId,
        subjectId: "bahasa",
        stageId: "bahasa-kalimat-pemahaman",
        runtime,
        difficulty: 3,
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
        metadata: { source: "cloze-sentence-browser-prerequisite" },
        evidence: [
          {
            attemptId,
            activityId: seedActivityId,
            skillId,
            score: 1,
            weight: 1,
            createdAt: completedAt,
            qualifiesForMastery: true
          }
        ],
        masteryEligible: true
      };
    });
    localStorage.setItem(attemptsKey, JSON.stringify({ [childId]: attempts }));
  });
}

async function waitForScene(page) {
  await page.waitForLoadState("load");
  await page.waitForFunction(
    () => {
      const scene = document.querySelector("[data-cloze-sentence-choice]");
      return (
        scene?.getAttribute("data-cloze-sentence-choice-ready") === "true" &&
        scene.querySelectorAll("[data-cloze-answer]").length === 3 &&
        Boolean(scene.querySelector("[data-cloze-slot]"))
      );
    },
    undefined,
    { timeout: 6000 }
  );
  await page.waitForTimeout(80);
}

async function completed(page) {
  return page.evaluate(
    ({ id }) => {
      const progress = JSON.parse(localStorage.getItem("mainlagi-learning-progress-v1") ?? "{}");
      return (progress["demo-gian"]?.completedActivityIds ?? []).includes(id);
    },
    { id: activityId }
  );
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
  throw new Error("Keyboard navigation did not reach a wrong cloze answer");
}

async function assertFullyVisible(locator, viewportHeight, label) {
  const box = await locator.boundingBox();
  assert(box, `${label} must render`);
  assert(box.y >= -1 && box.y + box.height <= viewportHeight + 1, `${label} must remain fully visible in viewport`);
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
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    assert(response && response.status() < 400, `cloze sentence bad HTTP at ${viewport.width}`);
    await waitForScene(page);
    assert.equal(
      new URL(page.url()).pathname,
      route,
      `progression guard must accept legitimate Bahasa Wave C readiness at ${viewport.width}`
    );

    const sentence = page.locator("[data-cloze-sentence]");
    const slot = page.locator("[data-cloze-slot]");
    const choices = page.locator("[data-cloze-answer]");
    assert.equal(await sentence.count(), 1, "canonical sentence renders as one cloze surface");
    assert.equal(await slot.count(), 1, "one visible cloze slot renders");
    assert.equal((await sentence.textContent())?.includes("Ayah minum"), true, "sentence keeps canonical prefix");
    assert.equal((await sentence.textContent())?.includes("setelah berolahraga."), true, "sentence keeps canonical suffix");
    assert.equal((await slot.textContent())?.trim(), "_____", "idle cloze slot is visibly empty");
    assert.equal(await choices.count(), 3, "cloze keeps three canonical choices");
    assert.deepEqual(await choices.allTextContents(), ["air", "bantal", "sepatu"], "choice order and labels remain canonical");
    assert.equal(await completed(page), false, "idle cloze state cannot complete activity");

    const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const scrollWidth = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth));
    assert(scrollWidth <= viewportWidth + 1, `cloze sentence overflows horizontally at ${viewport.width}`);

    for (const box of await choices.evaluateAll((items) =>
      items.map((node) => {
        const rect = node.getBoundingClientRect();
        return { width: rect.width, height: rect.height, left: rect.left, right: rect.right };
      })
    )) {
      assert(box.width >= 44 && box.height >= 44, "cloze choices keep minimum touch target");
      assert(box.left >= -1 && box.right <= viewportWidth + 1, "cloze choices remain inside viewport");
    }

    const status = page.getByRole("status");
    await assertFullyVisible(sentence, viewportHeight, `cloze sentence at ${viewport.width}`);
    await assertFullyVisible(status, viewportHeight, `idle cloze feedback at ${viewport.width}`);
    mkdirSync(screenshotDir, { recursive: true });
    await page.screenshot({
      path: path.join(screenshotDir, `${viewport.width}-cloze-sentence-idle.png`),
      fullPage: false
    });

    const wrongChoice = await keyboardWrongChoice(page);
    assert.notEqual(wrongChoice, correctChoice);
    await status.filter({ hasText: "Belum tepat" }).waitFor({ state: "visible", timeout: 2000 });
    assert.equal((await slot.textContent())?.trim(), wrongChoice, "wrong selection binds visibly into the blank");
    assert.equal(await slot.getAttribute("data-slot-state"), "try", "slot exposes retry state without completing");
    assert.equal(await completed(page), false, "wrong cloze choice cannot complete activity");
    await assertFullyVisible(status, viewportHeight, `retry cloze feedback at ${viewport.width}`);
    await page.screenshot({
      path: path.join(screenshotDir, `${viewport.width}-cloze-sentence-try.png`),
      fullPage: false
    });

    await page.getByRole("button", { name: correctChoice, exact: true }).click();
    await status.filter({ hasText: "Tepat" }).waitFor({ state: "visible", timeout: 2000 });
    assert.equal((await slot.textContent())?.trim(), correctChoice, "correct selection binds visibly into the blank");
    assert.equal(await slot.getAttribute("data-slot-state"), "good", "slot exposes success state");
    assert.equal(await completed(page), true, "correct cloze choice completes canonical activity");
    await assertFullyVisible(status, viewportHeight, `success cloze feedback at ${viewport.width}`);
    const nextLink = page.getByRole("link", { name: "Pilih permainan lain" });
    await assertFullyVisible(nextLink, viewportHeight, `cloze success CTA at ${viewport.width}`);

    const state = await page.evaluate(
      ({ id }) => {
        const attempts = JSON.parse(localStorage.getItem("mainlagi-learning-attempts-v1") ?? "{}");
        const list = attempts["demo-gian"] ?? [];
        return [...list].reverse().find((item) => item.activityId === id);
      },
      { id: activityId }
    );
    assert(state, "cloze sentence records attempt evidence");
    assert.equal(state.assessed, true, "cloze sentence activity remains assessed");
    assert.equal(state.metadata?.source, "cloze-sentence-choice-runtime");
    assert.equal(state.metadata?.evidenceFidelity, "choice_cloze_sentence_interaction");
    assert.equal(state.metadata?.selectedChoice, correctChoice);
    assert.equal(state.correctCount, 1);
    assert.equal(state.incorrectCount, 1);
    assert.equal(state.retryCount, 1);
    assert.equal(state.accuracy, 0.5);

    await page.screenshot({
      path: path.join(screenshotDir, `${viewport.width}-cloze-sentence-success.png`),
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
  for (const viewport of viewports) await inspect(viewport);
  console.log(
    `Cloze Sentence Choice browser QA passed ${viewports.length} viewports with legitimate Bahasa Wave C readiness, exact sentence/choices, keyboard wrong-state, pointer completion, touch targets, feedback/CTA visibility and assessed evidence checks.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    console.error(serverLog.slice(-6000));
    process.exitCode = 1;
  })
  .finally(stopServer);
