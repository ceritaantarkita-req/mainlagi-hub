import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_VISUAL_QA_PORT ?? 4011);
const baseUrl = process.env.MAINLAGI_VISUAL_QA_BASE_URL ?? `http://${host}:${port}`;
const outputDir = process.env.MAINLAGI_VISUAL_QA_SCREENSHOT_DIR ?? path.join(root, ".mobile-route-qa", "visual-baseline");
const shouldStartServer = !process.env.MAINLAGI_VISUAL_QA_BASE_URL;

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 }
];

const ROUTES = [
  { name: "public-root", path: "/", expectedPath: "/" },
  { name: "child-select", path: "/child/select", expectedPath: "/child/select", kind: "child-select", touch: true },
  { name: "child-home", path: "/child/demo-gian/home", expectedPath: "/child/demo-gian/home", kind: "child-learning", touch: true },
  { name: "subject-math", path: "/child/demo-gian/subject/math", expectedPath: "/child/demo-gian/subject/math", kind: "child-learning", touch: true },
  { name: "stage-math-angka", path: "/child/demo-gian/stage/math-angka", expectedPath: "/child/demo-gian/stage/math-angka", kind: "child-learning", touch: true },
  { name: "activity-math-count", path: "/child/demo-gian/activity/math-count-3", expectedPath: "/child/demo-gian/activity/math-count-3", kind: "child-learning", touch: true },
  { name: "rewards", path: "/child/demo-gian/rewards", expectedPath: "/child/demo-gian/rewards", kind: "child-learning", touch: true },
  { name: "parent-report", path: "/parent/children/demo-gian/reports", expectedPath: "/parent/children/demo-gian/reports", kind: "parent" },
  { name: "account", path: "/account", expectedPath: "/account" },
  { name: "login", path: "/login", expectedPath: "/login" },
  { name: "signup", path: "/signup", expectedPath: "/signup" },
  { name: "forgot-password", path: "/forgot-password", expectedPath: "/forgot-password" },
  { name: "auth-error", path: "/auth/callback?error_code=otp_expired", expectedPath: "/auth/callback" },
  { name: "not-found", path: "/__visual-baseline-not-found__", expectedPath: "/__visual-baseline-not-found__", expectedStatus: 404 }
];

const INTENTIONAL_NOT_FOUND_CONSOLE = "Failed to load resource: the server responded with a status of 404 (Not Found)";
const PARENT_PRIMARY_JARGON = /\battempts?\b|\bassessed\b|\bpractice\b|qualifying evidence|mastery canonical|\bretry\b/i;

let server = null;
let serverLog = "";

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
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Next server did not become ready at ${url}. ${lastError ?? ""}\n${serverLog.slice(-4000)}`);
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

function unexpectedConsoleErrors(route, consoleErrors) {
  if (route.expectedStatus !== 404) return consoleErrors;
  return consoleErrors.filter((message) => message !== INTENTIONAL_NOT_FOUND_CONSOLE);
}

async function assertParentReportPrimaryCopy(page, viewport) {
  const primary = page.locator("[data-mainlagi-parent-report-primary]");
  assert.equal(await primary.count(), 1, `parent-report primary copy layer missing at ${viewport.width}px`);
  const primaryCopy = await primary.evaluate((element) => {
    const clone = element.cloneNode(true);
    clone.querySelectorAll("[data-mainlagi-parent-report-diagnostic]").forEach((node) => node.remove());
    return (clone.textContent ?? "").replace(/\s+/g, " ").trim();
  });
  assert.match(primaryCopy, /Gambaran belajar minggu ini/i, `parent-report family summary missing at ${viewport.width}px`);
  assert.doesNotMatch(primaryCopy, PARENT_PRIMARY_JARGON, `parent-report primary layer leaked internal jargon at ${viewport.width}px: ${primaryCopy}`);
}

async function assertSubjectJourneyLayout(page, viewport) {
  const journey = page.locator("[data-stage-journey]");
  assert.equal(await journey.count(), 1, `subject journey missing at ${viewport.width}px`);
  if (viewport.width < 700) return;

  const geometry = await journey.evaluate((element) => {
    const items = Array.from(element.querySelectorAll("[data-stage-journey-item]"));
    return {
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      itemWidths: items.map((item) => Math.round(item.getBoundingClientRect().width * 10) / 10)
    };
  });
  assert.ok(geometry.itemWidths.length >= 2, `subject journey unexpectedly sparse at ${viewport.width}px`);
  assert.ok(geometry.scrollWidth <= geometry.clientWidth + 1, `subject journey still requires internal horizontal scrolling at ${viewport.width}px: ${JSON.stringify(geometry)}`);
  assert.ok(Math.min(...geometry.itemWidths) >= 200, `subject journey cards are too cramped at ${viewport.width}px: ${JSON.stringify(geometry.itemWidths)}`);
}

async function assertStageHierarchy(page, viewport) {
  assert.equal(await page.locator("[data-mainlagi-stage-screen]").count(), 1, `stage screen marker missing at ${viewport.width}px`);
  assert.equal(await page.locator("[data-stage-readiness]").count(), 1, `stage readiness summary missing at ${viewport.width}px`);
  assert.ok(await page.locator("[data-stage-lesson-grid]").count(), `stage lesson grid missing at ${viewport.width}px`);
  assert.equal(await page.locator("[data-stage-recommended='true']").count(), 1, `stage recommendation emphasis drifted at ${viewport.width}px`);

  if (viewport.width < 700) return;
  const geometry = await page.locator("[data-stage-lesson-grid]").first().evaluate((element) => {
    const cards = Array.from(element.querySelectorAll("[data-stage-activity-card='true']"));
    return {
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      cardWidths: cards.map((card) => Math.round(card.getBoundingClientRect().width * 10) / 10)
    };
  });
  assert.ok(geometry.cardWidths.length >= 2, `stage canonical lesson needs at least two cards for layout QA at ${viewport.width}px`);
  assert.ok(geometry.scrollWidth <= geometry.clientWidth + 1, `stage lesson grid overflows at ${viewport.width}px: ${JSON.stringify(geometry)}`);
  const minimumReadableWidth = viewport.width >= 1200 ? 320 : 240;
  assert.ok(Math.min(...geometry.cardWidths) >= minimumReadableWidth, `stage cards underuse available width at ${viewport.width}px: ${JSON.stringify(geometry.cardWidths)}`);
}

async function assertPublicFamilyEntry(page, viewport) {
  assert.equal(await page.locator("[data-mainlagi-public-family-entry]").count(), 1, `public family entry missing at ${viewport.width}px`);
  assert.equal(await page.locator("[data-mainlagi-public-child-cta]").count(), 1, `public child CTA missing at ${viewport.width}px`);
  assert.equal(await page.locator("[data-mainlagi-public-parent-cta]").count(), 1, `public parent CTA missing at ${viewport.width}px`);
  const copy = (await page.locator("[data-mainlagi-public-family-entry]").innerText()).replace(/\s+/g, " ");
  assert.match(copy, /kamera\s+(bersifat\s+)?opsional/i, `public entry must explain optional camera use at ${viewport.width}px`);

  const ctaGeometry = await page.locator("[data-mainlagi-public-child-cta], [data-mainlagi-public-parent-cta]").evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { width: Math.round(rect.width * 10) / 10, height: Math.round(rect.height * 10) / 10 };
    })
  );
  assert.ok(ctaGeometry.every((item) => item.height >= 44), `public family CTAs fell below touch target at ${viewport.width}px: ${JSON.stringify(ctaGeometry)}`);
}

async function assertAuthFamilySurface(page, route, viewport) {
  assert.equal(await page.locator("[data-mainlagi-auth-family-shell]").count(), 1, `${route.name} family shell missing at ${viewport.width}px`);
  assert.equal(await page.locator("[data-mainlagi-auth-context]").count(), 1, `${route.name} family context missing at ${viewport.width}px`);
  assert.equal(await page.locator("[data-mainlagi-auth-panel]").count(), 1, `${route.name} auth panel missing at ${viewport.width}px`);

  if (route.name === "auth-error") {
    assert.equal(await page.locator("[data-mainlagi-auth-status]").count(), 1, `auth callback status missing at ${viewport.width}px`);
  } else {
    const expectedMode = route.name === "forgot-password" ? "forgot" : route.name;
    assert.equal(await page.locator(`[data-mainlagi-auth-form="${expectedMode}"]`).count(), 1, `${route.name} auth form mode drifted at ${viewport.width}px`);
    const controls = await page.locator(`[data-mainlagi-auth-form="${expectedMode}"] input, [data-mainlagi-auth-form="${expectedMode}"] button`).evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { width: Math.round(rect.width * 10) / 10, height: Math.round(rect.height * 10) / 10 };
      })
    );
    assert.ok(controls.length >= 2, `${route.name} auth controls unexpectedly sparse at ${viewport.width}px`);
    assert.ok(controls.every((item) => item.height >= 44), `${route.name} auth controls fell below target height at ${viewport.width}px: ${JSON.stringify(controls)}`);
  }

  if (viewport.width >= 700) {
    const geometry = await page.locator("[data-mainlagi-auth-context], [data-mainlagi-auth-panel]").evaluateAll((elements) =>
      elements.map((element) => Math.round(element.getBoundingClientRect().width * 10) / 10)
    );
    assert.ok(Math.min(...geometry) >= 280, `${route.name} wide auth composition collapsed at ${viewport.width}px: ${JSON.stringify(geometry)}`);
  }
}

async function assertAccountFamilySurface(page, viewport) {
  assert.equal(await page.locator("[data-mainlagi-account-family-shell]").count(), 1, `account family shell missing at ${viewport.width}px`);
  const settings = page.locator("[data-mainlagi-account-settings]");
  assert.equal(await settings.count(), 1, `account settings region missing at ${viewport.width}px`);
  const links = settings.locator("a[href]");
  assert.ok(await links.count() >= 7, `account settings links unexpectedly sparse at ${viewport.width}px`);

  const geometry = await links.evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { width: Math.round(rect.width * 10) / 10, height: Math.round(rect.height * 10) / 10 };
  }));
  assert.ok(geometry.every((item) => item.height >= 64), `account settings cards are too cramped at ${viewport.width}px: ${JSON.stringify(geometry)}`);
  if (viewport.width >= 700) {
    assert.ok(Math.min(...geometry.map((item) => item.width)) >= 280, `account settings underuse wide layout at ${viewport.width}px: ${JSON.stringify(geometry)}`);
  }
}

async function inspect(page, route, viewport) {
  const consoleErrors = [];
  const pageErrors = [];
  const onConsole = (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  };
  const onPageError = (error) => pageErrors.push(error.message);
  page.on("console", onConsole);
  page.on("pageerror", onPageError);

  try {
    const response = await page.goto(`${baseUrl}${route.path}`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000
    });
    assert.ok(response, `${route.name} returned no navigation response at ${viewport.width}px`);
    const expectedStatus = route.expectedStatus ?? 200;
    if (route.expectedStatus !== undefined) {
      assert.equal(response.status(), expectedStatus, `${route.name} returned HTTP ${response.status()} instead of ${expectedStatus}`);
    } else {
      assert.ok(response.status() < 400, `${route.name} returned HTTP ${response.status()}`);
    }

    await page.waitForTimeout(240);
    const finalPath = new URL(page.url()).pathname;
    assert.equal(finalPath, route.expectedPath, `${route.name} redirected to ${finalPath}; expected ${route.expectedPath}`);

    const bodyText = (await page.locator("body").innerText()).trim();
    assert.ok(bodyText.length > 20, `${route.name} rendered an unexpectedly blank body`);
    assert.ok(await page.locator("main").count(), `${route.name} must expose a main landmark`);
    assert.ok(await page.locator("h1, [role='heading'][aria-level='1']").count(), `${route.name} must expose a top-level heading`);

    if (route.kind) {
      assert.ok(
        await page.locator(`[data-mainlagi-route-boundary="${route.kind}"]`).count(),
        `${route.name} is missing route boundary ${route.kind}`
      );
    }

    if (route.name === "public-root") await assertPublicFamilyEntry(page, viewport);
    if (route.name === "parent-report") await assertParentReportPrimaryCopy(page, viewport);
    if (route.name === "subject-math") await assertSubjectJourneyLayout(page, viewport);
    if (route.name === "stage-math-angka") await assertStageHierarchy(page, viewport);
    if (route.name === "account") await assertAccountFamilySurface(page, viewport);
    if (["login", "signup", "forgot-password", "auth-error"].includes(route.name)) await assertAuthFamilySurface(page, route, viewport);

    const overlayCount = await page.locator("nextjs-portal, [data-nextjs-dialog-overlay], [data-next-badge-root]").count();
    assert.equal(overlayCount, 0, `${route.name} rendered a Next.js error overlay`);

    const layout = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      htmlWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth
    }));
    assert.ok(
      layout.htmlWidth <= layout.viewportWidth + 1 && layout.bodyWidth <= layout.viewportWidth + 1,
      `${route.name} has horizontal overflow: ${JSON.stringify(layout)}`
    );

    if (route.touch && viewport.width <= 430) {
      const tooSmall = await page.evaluate(() => {
        const root = document.querySelector("[data-mainlagi-route-boundary]") ?? document.querySelector("main");
        if (!root) return [{ label: "missing-root", width: 0, height: 0 }];
        return Array.from(root.querySelectorAll("a[href], button, input:not([type='hidden']), select, [role='button']"))
          .map((element) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            const hidden = style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0 || rect.width === 0 || rect.height === 0;
            const inlineTextLink = element.tagName === "A" && style.display === "inline";
            const label = (element.getAttribute("aria-label") || element.textContent || element.getAttribute("name") || element.tagName)
              .trim().replace(/\s+/g, " ").slice(0, 80);
            return { hidden, inlineTextLink, label, width: Math.round(rect.width * 10) / 10, height: Math.round(rect.height * 10) / 10 };
          })
          .filter((item) => !item.hidden && !item.inlineTextLink && (item.width < 42 || item.height < 42))
          .slice(0, 12);
      });
      assert.deepEqual(tooSmall, [], `${route.name} has undersized touch controls: ${JSON.stringify(tooSmall)}`);
    }

    assert.deepEqual(pageErrors, [], `${route.name} raised page errors: ${pageErrors.join(" | ")}`);
    const unexpectedErrors = unexpectedConsoleErrors(route, consoleErrors);
    assert.deepEqual(unexpectedErrors, [], `${route.name} logged console errors: ${unexpectedErrors.join(" | ")}`);

    const fileName = `${viewport.width}x${viewport.height}-${route.name}.png`;
    await page.screenshot({ path: path.join(outputDir, fileName), fullPage: false });
    return {
      viewport: `${viewport.width}x${viewport.height}`,
      name: route.name,
      requestedPath: route.path,
      expectedPath: route.expectedPath,
      finalPath,
      status: response.status(),
      screenshot: `visual-baseline/${fileName}`
    };
  } finally {
    page.off("console", onConsole);
    page.off("pageerror", onPageError);
  }
}

async function main() {
  rmSync(outputDir, { recursive: true, force: true });
  mkdirSync(outputDir, { recursive: true });

  if (shouldStartServer) {
    startServer();
    await waitForServer(`${baseUrl}/`);
  }

  const browser = await chromium.launch({ headless: true });
  const captures = [];
  try {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
      const page = await context.newPage();
      for (const route of ROUTES) captures.push(await inspect(page, route, viewport));
      await context.close();
      console.log(`Visual product baseline passed at ${viewport.width}x${viewport.height}.`);
    }
  } finally {
    await browser.close();
    stopServer();
  }

  assert.equal(captures.length, VIEWPORTS.length * ROUTES.length, "visual baseline capture count drifted");
  writeFileSync(path.join(outputDir, "manifest.json"), `${JSON.stringify({
    generatedBy: "scripts/run-visual-baseline-browser-tests.mjs",
    viewports: VIEWPORTS,
    routes: ROUTES.map(({ name, path: routePath, expectedPath, expectedStatus = 200 }) => ({ name, path: routePath, expectedPath, expectedStatus })),
    captures
  }, null, 2)}\n`);

  console.log(`Permanent visual product baseline passed ${captures.length} exact-path captures across ${VIEWPORTS.length} viewports.`);
}

main().catch((error) => {
  console.error(error);
  console.error(serverLog.slice(-6000));
  stopServer();
  process.exitCode = 1;
});
