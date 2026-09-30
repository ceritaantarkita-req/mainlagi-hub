import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_SI10_WORLD_QA_PORT ?? 4080);
const baseUrl = `http://${host}:${port}`;
const outDir = path.resolve(".mobile-route-qa/si10-world-adapter");
const stageRoute = "/child/demo-gian/world/money-festival/stage/money-stage-01-money-use";
const mapPath = "/child/demo-gian/world/money-festival";
const nextStagePath = "/child/demo-gian/world/money-festival/stage/money-stage-02-price-change";
const publicWorldPath = "/worlds/money-festival";
const portrait = { width: 390, height: 844 };
const landscape = { width: 844, height: 390 };

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
      const response = await fetch(baseUrl + stageRoute);
      if (response.status < 500) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  throw new Error(`SI-10 World QA server did not become ready.\n${serverLog.slice(-4000)}`);
}

async function advanceNarrative(page) {
  const next = page.locator("[data-world-next]").first();
  await next.waitFor({ state: "visible", timeout: 5_000 });
  if (await next.isDisabled()) {
    const hear = page.locator("[data-world-hear]").first();
    await hear.waitFor({ state: "visible", timeout: 5_000 });
    await hear.click();
    await page.waitForFunction(() => {
      const button = document.querySelector("[data-world-next]");
      return button instanceof HTMLButtonElement && !button.disabled;
    }, null, { timeout: 5_000 });
  }
  await next.click();
}

async function completeFirstDragChallenge(page) {
  await page.getByRole("button", { name: "Rp3", exact: true }).click();
  await page.getByRole("button", { name: /🎈 Balon · Rp3/ }).click();
  await page.getByRole("button", { name: "Rp4", exact: true }).click();
  await page.getByRole("button", { name: /🍎 Buah · Rp4/ }).click();
  await page.getByRole("button", { name: "Rp5", exact: true }).click();
  await page.getByRole("button", { name: /🧃 Jus · Rp5/ }).click();
  await page.waitForTimeout(520);
}

async function completeMatchingChallenge(page) {
  const left = page.getByRole("group", { name: "Kartu kiri" });
  const right = page.getByRole("group", { name: "Kartu kanan" });
  for (const [leftLabel, rightLabel] of [
    ["🎈 Balon", "Rp3"],
    ["🍎 Buah", "Rp4"],
    ["🧃 Jus", "Rp5"]
  ]) {
    await left.getByRole("button", { name: leftLabel, exact: true }).click();
    await right.getByRole("button", { name: rightLabel, exact: true }).click();
  }
  await page.waitForTimeout(520);
}

async function completeStageOne(page) {
  await advanceNarrative(page);
  await advanceNarrative(page);
  await advanceNarrative(page);
  await advanceNarrative(page);
  await completeFirstDragChallenge(page);
  await advanceNarrative(page);
  await advanceNarrative(page);
  await completeMatchingChallenge(page);
  await advanceNarrative(page);
  await advanceNarrative(page);
}

async function assertNoHorizontalOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    html: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));
  assert(
    metrics.html <= metrics.viewport + 1 && metrics.body <= metrics.viewport + 1,
    `${label}: horizontal overflow ${JSON.stringify(metrics)}`
  );
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  startServer();
  await waitForServer();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: portrait, reducedMotion: "reduce", hasTouch: true });
  await context.addInitScript(() => {
    window.__mainlagiSi10DocumentToken = "same-document";
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value) => {
          window.__mainlagiSi10Copied = value;
        }
      }
    });
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (payload) => {
        window.__mainlagiSi10NativeShare = payload;
      }
    });
  });

  const page = await context.newPage();
  await page.route("**/api/parent/share-gate", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ allowed: true })
    });
  });

  try {
    await page.goto(baseUrl + stageRoute, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.locator('[data-world-stage-shell="garden-baseline-v1"]').waitFor({ state: "visible", timeout: 10_000 });
    assert.equal(
      await page.locator("[data-world-story-character]").first().locator(":scope > strong").count(),
      0,
      "SI-10 must preserve SI-02 World SpeechCard name-label removal"
    );

    await completeStageOne(page);

    let completion = page.locator('[data-si10-world="completion"][data-canonical-completion="v1"]');
    await completion.waitFor({ state: "visible", timeout: 8_000 });
    assert.equal(await completion.getAttribute("data-completion-context"), "world", "World uses canonical Completion context");
    assert.equal(await completion.getAttribute("data-completion-surface"), "inline", "World preserves inline terminal surface");
    assert.equal(await completion.getAttribute("data-world-completion-stage"), "money-stage-01-money-use", "World stage marker is preserved");
    assert.equal(await completion.getAttribute("data-world-completion-final"), "false", "Stage 1 is not final");
    assert.equal(await completion.getAttribute("data-world-completion-chapter"), "money-chapter-01-road-to-festival", "World chapter marker is preserved");
    assert.equal(await completion.getAttribute("data-completion-stars"), "3", "canonical completion locks three-star contract");
    assert.equal(await completion.locator('[aria-label="Tiga bintang"] svg').count(), 3, "World completion renders exactly three stars");

    const actionOrder = await completion.locator("[data-completion-action]").evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("data-completion-action"))
    );
    assert.deepEqual(actionOrder, ["back", "again", "next", "share"], "World completion exposes exact canonical action order");

    const backHref = await completion.locator('[data-completion-action="back"]').getAttribute("href");
    const nextHref = await completion.locator('[data-completion-action="next"]').getAttribute("href");
    assert.equal(backHref, mapPath, "Back preserves World map route");
    assert.equal(nextHref, nextStagePath, "Next preserves canonical World stage order");

    const characterIds = await completion.locator("[data-world-character-state] [data-character-id]").evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("data-character-id"))
    );
    assert.deepEqual(characterIds, ["gavi", "paca"], "World canonical completion preserves Gavi/Paca celebration cast");

    await assertNoHorizontalOverflow(page, "SI-10 portrait completion");
    await page.screenshot({ path: path.join(outDir, "completion-390-portrait.png"), fullPage: false });

    await page.setViewportSize(landscape);
    await page.waitForTimeout(120);
    completion = page.locator('[data-si10-world="completion"][data-canonical-completion="v1"]');
    assert.equal(await completion.isVisible(), true, "World completion remains mounted through portrait to landscape rotation");
    assert.equal(await completion.getAttribute("data-world-completion-stage"), "money-stage-01-money-use", "rotation preserves completed Stage identity");
    await assertNoHorizontalOverflow(page, "SI-10 landscape completion");
    await page.screenshot({ path: path.join(outDir, "completion-844x390-landscape.png"), fullPage: false });

    await page.setViewportSize(portrait);
    await page.waitForTimeout(120);
    completion = page.locator('[data-si10-world="completion"][data-canonical-completion="v1"]');
    assert.equal(await completion.isVisible(), true, "World completion remains mounted after portrait recovery");

    await completion.locator('[data-completion-action="share"]').click();
    const dialog = page.locator('[data-canonical-share="v1"][data-share-context="world"]');
    await dialog.waitFor({ state: "visible", timeout: 5_000 });
    await page.waitForFunction(() =>
      document.querySelector('[data-canonical-share="v1"][data-share-context="world"]')?.getAttribute("data-share-gate") === "allowed"
    );
    assert.equal(await dialog.getAttribute("data-share-public-path"), publicWorldPath, "World canonical Share resolves public World landing");
    assert.equal(await dialog.getAttribute("data-share-url"), baseUrl + publicWorldPath, "World canonical Share exposes public-only absolute URL");

    const providerHrefs = await dialog.locator('a[data-share-provider]').evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("href") ?? "")
    );
    for (const href of providerHrefs) {
      assert(!href.includes("/child/"), `provider must not expose child route: ${href}`);
      assert(!href.includes("demo-gian"), `provider must not expose child id: ${href}`);
      assert(!href.includes("money-stage-01-money-use"), `provider must not expose private Stage route: ${href}`);
    }

    await dialog.locator('[data-share-provider="copy"]').click();
    await page.waitForFunction((expected) => window.__mainlagiSi10Copied === expected, baseUrl + publicWorldPath);
    assert.equal(await page.evaluate(() => window.__mainlagiSi10Copied), baseUrl + publicWorldPath, "Copy link uses public World landing");

    await dialog.locator('[data-share-provider="device"]').click();
    await page.waitForFunction(() => Boolean(window.__mainlagiSi10NativeShare?.url));
    const nativeShare = await page.evaluate(() => window.__mainlagiSi10NativeShare);
    assert.equal(nativeShare.url, baseUrl + publicWorldPath, "native Share uses public World landing");
    assert(!JSON.stringify(nativeShare).includes("demo-gian"), "native Share excludes child id");

    await dialog.getByRole("button", { name: "Tutup" }).click();
    await dialog.waitFor({ state: "hidden", timeout: 5_000 });
    completion = page.locator('[data-si10-world="completion"][data-canonical-completion="v1"]');
    assert.equal(await completion.isVisible(), true, "closing Share returns to the same completion state");

    await completion.locator('[data-completion-action="again"]').click();
    await page.locator('[data-world-stage-shell="garden-baseline-v1"]').waitFor({ state: "visible", timeout: 8_000 });
    assert.equal(await page.evaluate(() => window.__mainlagiSi10DocumentToken), "same-document", "Again must not reload the document");
    assert.equal(new URL(page.url()).pathname, stageRoute, "Again keeps the same World Stage route");
    assert.equal(await page.locator('[data-si10-world="completion"]').count(), 0, "Again exits completion back to Stage runtime");

    console.log("SI-10 World adapter browser QA PASS: canonical Completion/Share, public-only share payloads, stage routing, Gavi/Paca cast, orientation persistence, SI-02 name-label guarantee, and same-document Again are preserved.");
  } finally {
    await context.close();
    await browser.close();
    stopServer();
  }
}

main().catch((error) => {
  console.error(error);
  console.error(serverLog.slice(-6000));
  process.exitCode = 1;
  stopServer();
});
