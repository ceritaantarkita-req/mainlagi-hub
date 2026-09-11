import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.MAINLAGI_MOBILE_QA_PORT ?? 4010);
const baseUrl = process.env.MAINLAGI_MOBILE_QA_BASE_URL ?? `http://${host}:${port}`;
const screenshotDir = process.env.MAINLAGI_MOBILE_QA_SCREENSHOT_DIR ?? path.join(root, ".mobile-route-qa");
const shouldStartServer = !process.env.MAINLAGI_MOBILE_QA_BASE_URL;

const VIEWPORTS = [
  { width: 320, height: 720 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 860 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 }
];

const ROUTES = [
  { path: "/child", kind: "child-select", touch: true },
  { path: "/child/select", kind: "child-select", touch: true },
  { path: "/child/demo-gian", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/home", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/learn", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/subject/math", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/stage/math-angka", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/activity/math-count-3", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/subject/drawing", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/stage/drawing-lines-shapes-basics", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/activity/drawing-line-vertical", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/games", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/rewards", kind: "child-learning", touch: true },
  { path: "/parent", kind: "parent", touch: false },
  { path: "/parent/children", kind: "parent", touch: false },
  { path: "/parent/children/demo-gian", kind: "parent", touch: false },
  { path: "/parent/children/demo-gian/progress", kind: "parent", touch: false },
  { path: "/parent/children/demo-gian/reports", kind: "parent", touch: false },
  { path: "/parent/children/demo-gian/certificates", kind: "parent", touch: false },
  { path: "/parent/plan", kind: "parent", touch: false },
  { path: "/parent/privacy", kind: "parent", touch: false },
  { path: "/parent/settings", kind: "parent", touch: false },
  { path: "/games", kind: "game-catalog", touch: false },
  { path: "/games/math-choice", kind: "game-catalog", touch: false },
  { path: "/play/math-choice", kind: "game-play", touch: true }
];

const RUNTIME_ROUTES = [
  ["tap_choice", "/child/demo-gian/activity/math-count-3"],
  ["listen_and_choose", "/child/demo-gian/activity/english-find-blue-audio"],
  ["matching", "/child/demo-gian/activity/bahasa-pasang-awal"],
  ["trace", "/child/demo-gian/activity/math-trace-5-touch"],
  ["story", "/child/demo-gian/activity/bahasa-cerita-teman"],
  ["coloring", "/child/demo-gian/activity/color-gavi"],
  ["drawing", "/child/demo-gian/activity/drawing-line-vertical"]
];

const BATCH16_ACCESSIBILITY_ROUTES = [
  { path: "/child/demo-gian/home", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/learn", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/activity/math-count-3", kind: "child-learning", touch: true },
  { path: "/parent/children/demo-gian/reports", kind: "parent", touch: false },
  { path: "/play/math-choice", kind: "game-play", touch: true }
];

const SCREENSHOTS = new Set([
  "320:/child/demo-gian/home",
  "375:/child/demo-gian/learn",
  "390:/parent/children/demo-gian/reports",
  "430:/play/math-choice",
  "768:/child/demo-gian/stage/math-angka",
  "430:/child/demo-gian/stage/drawing-lines-shapes-basics",
  "1024:/games/math-choice"
]);

let server = null;
let serverLog = "";

function slug(value) {
  return value.replace(/^\//, "").replace(/[^a-zA-Z0-9_-]+/g, "-") || "root";
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

async function inspectPage(page, route, viewport) {
  let consoleErrors = [];
  let pageErrors = [];
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
    assert.ok(response, `${route.path} returned no navigation response at ${viewport.width}px`);
    assert.ok(response.status() < 400, `${route.path} returned HTTP ${response.status()} at ${viewport.width}px`);
    await page.waitForTimeout(120);

    const bodyText = (await page.locator("body").innerText()).trim();
    assert.ok(bodyText.length > 20, `${route.path} rendered an unexpectedly blank body at ${viewport.width}px`);

    const boundary = page.locator(`[data-mainlagi-route-boundary="${route.kind}"]`);
    assert.ok(await boundary.count(), `${route.path} is missing route boundary ${route.kind}`);

    const overlayCount = await page.locator("nextjs-portal, [data-nextjs-dialog-overlay], [data-next-badge-root]").count();
    assert.equal(overlayCount, 0, `${route.path} rendered a Next.js error overlay at ${viewport.width}px`);

    const metrics = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth;
      const htmlWidth = document.documentElement.scrollWidth;
      const bodyWidth = document.body.scrollWidth;
      const offenders = Array.from(document.querySelectorAll("body *"))
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName.toLowerCase(),
            className: typeof element.className === "string" ? element.className.slice(0, 100) : "",
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width)
          };
        })
        .filter((item) => item.width > 0 && (item.left < -2 || item.right > viewportWidth + 2))
        .slice(0, 8);
      return { viewportWidth, htmlWidth, bodyWidth, offenders };
    });

    assert.ok(
      metrics.htmlWidth <= metrics.viewportWidth + 1 && metrics.bodyWidth <= metrics.viewportWidth + 1,
      `${route.path} has document horizontal overflow at ${viewport.width}px: viewport=${metrics.viewportWidth}, html=${metrics.htmlWidth}, body=${metrics.bodyWidth}, offenders=${JSON.stringify(metrics.offenders)}`
    );

    if (route.touch && viewport.width <= 430) {
      const tooSmall = await page.evaluate(() => {
        const root = document.querySelector("[data-mainlagi-route-boundary]");
        if (!root) return [{ label: "missing-root", width: 0, height: 0 }];
        return Array.from(root.querySelectorAll("a[href], button, input:not([type='hidden']), select, [role='button']"))
          .map((element) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            const hidden = style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0 || rect.width === 0 || rect.height === 0;
            const inlineTextLink = element.tagName === "A" && style.display === "inline";
            const label = (element.getAttribute("aria-label") || element.textContent || element.getAttribute("name") || element.tagName).trim().replace(/\s+/g, " ").slice(0, 80);
            return { hidden, inlineTextLink, label, width: Math.round(rect.width * 10) / 10, height: Math.round(rect.height * 10) / 10 };
          })
          .filter((item) => !item.hidden && !item.inlineTextLink && (item.width < 42 || item.height < 42))
          .slice(0, 12);
      });
      assert.deepEqual(tooSmall, [], `${route.path} has undersized touch controls at ${viewport.width}px: ${JSON.stringify(tooSmall)}`);
    }

    assert.deepEqual(pageErrors, [], `${route.path} raised page errors at ${viewport.width}px: ${pageErrors.join(" | ")}`);
    assert.deepEqual(consoleErrors, [], `${route.path} logged console errors at ${viewport.width}px: ${consoleErrors.join(" | ")}`);

    if (SCREENSHOTS.has(`${viewport.width}:${route.path}`)) {
      await page.screenshot({
        path: path.join(screenshotDir, `${viewport.width}-${slug(route.path)}.png`),
        fullPage: false
      });
    }
  } finally {
    page.off("console", onConsole);
    page.off("pageerror", onPageError);
  }
}

async function inspectBatch16Accessibility(page, route) {
  const requestedUrls = [];
  const onRequest = (request) => requestedUrls.push(request.url());
  page.on("request", onRequest);
  try {
    await inspectPage(page, route, { width: 390, height: 844 });

    const audit = await page.evaluate(() => {
      const isVisible = (element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
      };
      const labelForControl = (element) => {
        const ariaLabel = element.getAttribute("aria-label")?.trim();
        if (ariaLabel) return ariaLabel;
        const labelledBy = element.getAttribute("aria-labelledby");
        if (labelledBy && labelledBy.split(/\s+/).some((id) => document.getElementById(id)?.textContent?.trim())) return labelledBy;
        if (element.closest("label")?.textContent?.trim()) return "wrapped-label";
        if (element.id && document.querySelector(`label[for="${CSS.escape(element.id)}"]`)?.textContent?.trim()) return "for-label";
        if (element.getAttribute("title")?.trim()) return element.getAttribute("title");
        return "";
      };
      const parseDurations = (value) => value
        .split(",")
        .map((item) => item.trim())
        .map((item) => item.endsWith("ms") ? Number.parseFloat(item) : Number.parseFloat(item) * 1000)
        .filter(Number.isFinite);

      const imagesWithoutAlt = Array.from(document.querySelectorAll("img"))
        .filter(isVisible)
        .filter((image) => !image.hasAttribute("alt"))
        .map((image) => image.getAttribute("src")?.slice(0, 120) ?? "img")
        .slice(0, 10);
      const unlabeledControls = Array.from(document.querySelectorAll("input:not([type='hidden']), select, textarea"))
        .filter(isVisible)
        .filter((element) => !labelForControl(element))
        .map((element) => `${element.tagName.toLowerCase()}#${element.id || "?"}`)
        .slice(0, 10);
      const ariaHiddenFocusable = Array.from(document.querySelectorAll("[aria-hidden='true'] a[href], [aria-hidden='true'] button, [aria-hidden='true'] input, [aria-hidden='true'] select, [aria-hidden='true'] textarea, [aria-hidden='true'] [tabindex]"))
        .filter(isVisible)
        .filter((element) => element.getAttribute("tabindex") !== "-1")
        .map((element) => element.outerHTML.slice(0, 140))
        .slice(0, 10);
      const longMotion = Array.from(document.querySelectorAll("body *"))
        .filter(isVisible)
        .map((element) => {
          const style = getComputedStyle(element);
          const durations = [...parseDurations(style.animationDuration), ...parseDurations(style.transitionDuration)];
          return { element, maxMs: durations.length ? Math.max(...durations) : 0 };
        })
        .filter((item) => item.maxMs > 20)
        .map((item) => ({ tag: item.element.tagName.toLowerCase(), maxMs: item.maxMs, className: typeof item.element.className === "string" ? item.element.className.slice(0, 100) : "" }))
        .slice(0, 10);

      return {
        lang: document.documentElement.lang,
        imagesWithoutAlt,
        unlabeledControls,
        ariaHiddenFocusable,
        longMotion
      };
    });

    assert.equal(audit.lang, "id", `${route.path} must keep document language id`);
    assert.deepEqual(audit.imagesWithoutAlt, [], `${route.path} has visible images without alt: ${JSON.stringify(audit.imagesWithoutAlt)}`);
    assert.deepEqual(audit.unlabeledControls, [], `${route.path} has visible unlabeled form controls: ${JSON.stringify(audit.unlabeledControls)}`);
    assert.deepEqual(audit.ariaHiddenFocusable, [], `${route.path} has focusable controls inside aria-hidden: ${JSON.stringify(audit.ariaHiddenFocusable)}`);
    assert.deepEqual(audit.longMotion, [], `${route.path} ignores prefers-reduced-motion: ${JSON.stringify(audit.longMotion)}`);

    let focused = false;
    for (let index = 0; index < 8; index += 1) {
      await page.keyboard.press("Tab");
      focused = await page.evaluate(() => {
        const active = document.activeElement;
        return Boolean(active && active !== document.body && active !== document.documentElement);
      });
      if (focused) break;
    }
    assert.ok(focused, `${route.path} did not expose keyboard focus after repeated Tab navigation`);

    const unexpectedHeavyRequests = requestedUrls.filter((url) => /mediapipe|hand_landmarker|pose_landmarker|\.wasm(?:\?|$)|\.task(?:\?|$)/i.test(url));
    assert.deepEqual(unexpectedHeavyRequests, [], `${route.path} eagerly loaded optional vision assets: ${JSON.stringify(unexpectedHeavyRequests)}`);

    const eagerRemoteTts = requestedUrls.filter((url) => /\/api\/tts(?:\?|$)/.test(url));
    assert.deepEqual(eagerRemoteTts, [], `${route.path} eagerly requested remote TTS before user interaction`);
  } finally {
    page.off("request", onRequest);
  }
}

async function main() {
  rmSync(screenshotDir, { recursive: true, force: true });
  mkdirSync(screenshotDir, { recursive: true });

  if (shouldStartServer) {
    startServer();
    await waitForServer(`${baseUrl}/`);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      for (const route of ROUTES) {
        await inspectPage(page, route, viewport);
      }
      await context.close();
      console.log(`Mobile route matrix passed at ${viewport.width}px.`);
    }

    for (const width of [320, 430]) {
      const viewport = VIEWPORTS.find((item) => item.width === width);
      assert.ok(viewport, `missing viewport ${width}px`);
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      for (const [runtime, routePath] of RUNTIME_ROUTES) {
        await inspectPage(page, { path: routePath, kind: "child-learning", touch: true }, viewport);
        console.log(`Runtime ${runtime} passed responsive smoke at ${width}px.`);
      }
      await context.close();
    }

    const accessibilityContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce"
    });
    const accessibilityPage = await accessibilityContext.newPage();
    for (const route of BATCH16_ACCESSIBILITY_ROUTES) {
      await inspectBatch16Accessibility(accessibilityPage, route);
      console.log(`Batch 16 accessibility/lazy-load gate passed for ${route.path}.`);
    }
    await accessibilityContext.close();
  } finally {
    await browser.close();
  }

  console.log(`Mainlagi browser mobile route QA passed ${ROUTES.length} canonical routes across ${VIEWPORTS.length} viewport widths, ${RUNTIME_ROUTES.length} runtime representatives at phone extremes, and ${BATCH16_ACCESSIBILITY_ROUTES.length} reduced-motion/accessibility/lazy-load representatives.`);
}

main()
  .catch((error) => {
    console.error(error);
    console.error(serverLog.slice(-6000));
    process.exitCode = 1;
  })
  .finally(() => {
    stopServer();
  });