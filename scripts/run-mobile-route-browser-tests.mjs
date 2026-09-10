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
  ["coloring", "/child/demo-gian/activity/color-gavi"]
];

const SCREENSHOTS = new Set([
  "320:/child/demo-gian/home",
  "375:/child/demo-gian/learn",
  "390:/parent/children/demo-gian/reports",
  "430:/play/math-choice",
  "768:/child/demo-gian/stage/math-angka",
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
  } finally {
    await browser.close();
  }

  console.log(`Mainlagi browser mobile route QA passed ${ROUTES.length} canonical routes across ${VIEWPORTS.length} viewport widths plus ${RUNTIME_ROUTES.length} runtime representatives at phone extremes.`);
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
