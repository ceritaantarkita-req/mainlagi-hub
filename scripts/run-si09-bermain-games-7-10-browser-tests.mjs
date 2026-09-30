import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_SI09_BERMAIN_QA_PORT ?? 4079);
const baseUrl = `http://${host}:${port}`;
const games = [
  { slug: "iqro-motion", ready: ".iqro-layout", timeoutMs: 130_000 },
  { slug: "airboard-presenter", ready: ".airboard-page", workspace: true },
  { slug: "dodge-motion", ready: ".beat-field", timeoutMs: 70_000 },
  { slug: "run-to-target", ready: ".run-hud", timeoutMs: 70_000 }
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
      const response = await fetch(baseUrl + "/play/iqro-motion");
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`SI-09 Bermain QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function installFastClock(context) {
  await context.addInitScript(() => {
    const nativeNow = performance.now.bind(performance);
    let offset = 0;
    Object.defineProperty(performance, "now", {
      configurable: true,
      value: () => nativeNow() + offset
    });
    window.__mainlagiSi09AdvanceClock = (milliseconds) => {
      offset += milliseconds;
    };
  });
}

async function enterChallengeDemo(page, game) {
  await page.goto(baseUrl + "/play/" + game.slug, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.locator(".preflight-layout").waitFor({ state: "visible", timeout: 8_000 });
  await page.locator(".preflight-toggle").click();
  await page.getByRole("button", { name: "Mouse / keyboard", exact: true }).click();
  await page.getByRole("button", { name: "Tutup mode orang tua", exact: true }).click();
  await page.getByRole("button", { name: "Tantangan", exact: true }).click();
  await page.getByRole("button", { name: "Ayo main", exact: true }).click();
  await page.locator(game.ready).waitFor({ state: "visible", timeout: 7_000 });
}

async function finishGame(page, game) {
  if (game.workspace) {
    await page.locator('[data-airboard-action="finish"]').click();
  } else {
    await page.evaluate((value) => window.__mainlagiSi09AdvanceClock?.(value), game.timeoutMs);
  }
  const completion = page.locator('[data-si09-bermain="games-7-10"][data-completion-context="bermain"]');
  await completion.waitFor({ state: "visible", timeout: 7_000 });
  return completion;
}

async function verifyCompletion(page, completion, game) {
  const slug = game.slug;
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
    await completion.locator('[data-bermain-completion-action="calibrate"]').count(),
    1,
    `${slug}: calibration remains available`
  );

  if (game.workspace) {
    assert.equal(
      await completion.locator("[data-bermain-workspace-completion]").count(),
      1,
      "airboard-presenter: workspace terminal is preserved"
    );
    assert.equal(
      await completion.locator("[data-bermain-completion-score]").count(),
      0,
      "airboard-presenter: no fake score/leaderboard result is rendered"
    );
    assert.equal(
      await completion.locator('[data-completion-action="next"]').getAttribute("href"),
      "/play/dodge-motion",
      "airboard-presenter: Next follows canonical GAME_SLUGS order"
    );
  } else {
    assert.equal(
      await completion.locator("[data-bermain-completion-score]").count(),
      1,
      `${slug}: score context remains inside canonical completion`
    );
  }

  if (slug === "run-to-target") {
    assert.equal(
      await completion.locator('[data-completion-action="next"]').getAttribute("href"),
      "/play/math-choice",
      "run-to-target: final catalog entry wraps Next to the first canonical game"
    );
  }
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
      await enterChallengeDemo(page, game);
      const completion = await finishGame(page, game);
      await verifyCompletion(page, completion, game);

      if (game.workspace) {
        await page.evaluate(() => { window.__mainlagiSi09ReplayProbe = "alive"; });
        await completion.locator('[data-completion-action="again"]').click();
        await page.locator(".countdown-screen").waitFor({ state: "visible", timeout: 5_000 });
        assert.equal(
          await page.evaluate(() => window.__mainlagiSi09ReplayProbe),
          "alive",
          "airboard-presenter: Again preserves the same document instead of reloading"
        );
        assert.equal(
          await page.locator('[data-si09-bermain="games-7-10"]').count(),
          0,
          "airboard-presenter: Again dismisses completion and resets through the existing local session seam"
        );
      }

      await context.close();
    }

    console.log("SI-09 Bermain games 7-10 browser QA PASS: canonical terminal for timed games, explicit AirBoard workspace finish without fake scoring, exact actions, retired header Share, and local Again replay verified.");
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
