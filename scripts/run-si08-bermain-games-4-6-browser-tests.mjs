import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_SI08_BERMAIN_QA_PORT ?? 4078);
const baseUrl = `http://${host}:${port}`;
const games = [
  { slug: "shape-quest", timeoutMs: 65_000 },
  { slug: "pattern-race", timeoutMs: 95_000 },
  { slug: "math-warung", timeoutMs: 95_000 }
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

function stopServer() {
  if (server && !server.killed) server.kill("SIGTERM");
}

async function waitForServer(timeoutMs = 60_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(baseUrl + "/play/shape-quest");
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`SI-08 Bermain QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function installFastClock(context) {
  await context.addInitScript(() => {
    const nativeNow = performance.now.bind(performance);
    let offset = 0;
    Object.defineProperty(performance, "now", {
      configurable: true,
      value: () => nativeNow() + offset
    });
    window.__mainlagiSi08AdvanceClock = (milliseconds) => {
      offset += milliseconds;
    };
  });
}

async function enterChallengeDemo(page, slug) {
  await page.goto(baseUrl + "/play/" + slug, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.locator(".preflight-layout").waitFor({ state: "visible", timeout: 8_000 });
  await page.locator(".preflight-toggle").click();
  await page.getByRole("button", { name: "Mouse / keyboard", exact: true }).click();
  await page.getByRole("button", { name: "Tutup mode orang tua", exact: true }).click();
  await page.getByRole("button", { name: "Tantangan", exact: true }).click();
  await page.getByRole("button", { name: "Ayo main", exact: true }).click();
  await page.locator(".game-hud").waitFor({ state: "visible", timeout: 7_000 });
}

async function finishByClock(page, milliseconds) {
  await page.evaluate((value) => window.__mainlagiSi08AdvanceClock?.(value), milliseconds);
  const completion = page.locator('[data-si08-bermain="games-4-6"][data-completion-context="bermain"]');
  await completion.waitFor({ state: "visible", timeout: 6_000 });
  return completion;
}

async function verifyCompletion(page, completion, slug) {
  assert.equal(await completion.getAttribute("data-canonical-completion"), "v1", `${slug}: canonical completion marker`);
  assert.equal(await completion.getAttribute("data-completion-stars"), "3", `${slug}: exact three-star completion`);
  for (const action of ["back", "again", "next", "share"]) {
    assert.equal(
      await completion.locator(`[data-completion-action="${action}"]`).count(),
      1,
      `${slug}: exactly one ${action} action`
    );
  }
  assert.equal(
    await page.locator(".experience-actions").getByRole("button", { name: /bagikan|share/i }).count(),
    0,
    `${slug}: legacy gameplay header Share is retired`
  );
  assert.equal(
    await completion.locator("[data-bermain-completion-score]").count(),
    1,
    `${slug}: score context remains inside canonical completion`
  );
  assert.equal(
    await completion.locator('[data-bermain-completion-action="calibrate"]').count(),
    1,
    `${slug}: calibration remains available`
  );
}

async function main() {
  startServer();
  await waitForServer();
  const browser = await chromium.launch({ headless: true });

  try {
    for (const game of games) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
      await installFastClock(context);
      const page = await context.newPage();
      await enterChallengeDemo(page, game.slug);
      const completion = await finishByClock(page, game.timeoutMs);
      await verifyCompletion(page, completion, game.slug);

      if (game.slug === "shape-quest") {
        await completion.locator('[data-completion-action="again"]').click();
        await page.locator(".countdown-screen").waitFor({ state: "visible", timeout: 3_000 });
        await page.locator(".game-hud").waitFor({ state: "visible", timeout: 7_000 });
        assert.equal(
          await page.locator('[data-si08-bermain="games-4-6"]').count(),
          0,
          "shape-quest: Again dismisses completion and starts a fresh local session"
        );
      }

      await context.close();
    }

    console.log("SI-08 Bermain games 4-6 browser QA PASS: canonical Completion+Share terminal, exact actions, score/calibration preservation, retired header Share, and local Again replay verified.");
  } catch (error) {
    console.error(error);
    console.error(serverLog.slice(-6000));
    process.exitCode = 1;
  } finally {
    await browser.close();
    stopServer();
  }
}

await main();
