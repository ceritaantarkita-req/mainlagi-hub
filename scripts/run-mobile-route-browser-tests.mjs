import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
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
  { path: "/child/demo-gian/worlds", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/world/money-festival", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/world/money-festival/stage/money-stage-01-money-use", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/subject/math", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/stage/math-angka", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/activity/math-count-3", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/subject/drawing", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/stage/drawing-lines-shapes-basics", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/activity/drawing-line-vertical", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/games", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/rewards", kind: "child-learning", touch: true },
  { path: "/parent", kind: "parent", touch: true },
  { path: "/parent/children", kind: "parent", touch: false },
  { path: "/parent/children/demo-gian", kind: "parent", touch: false },
  { path: "/parent/children/demo-gian/progress", kind: "parent", touch: false },
  { path: "/parent/children/demo-gian/reports", kind: "parent", touch: false },
  { path: "/parent/children/demo-gian/certificates", kind: "parent", touch: false },
  { path: "/parent/plan", kind: "parent", touch: false },
  { path: "/parent/privacy", kind: "parent", touch: false },
  { path: "/parent/settings", kind: "parent", touch: true },
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
  { path: "/child/demo-gian/world/money-festival", kind: "child-learning", touch: true },
  { path: "/child/demo-gian/activity/math-count-3", kind: "child-learning", touch: true },
  { path: "/parent/children/demo-gian/reports", kind: "parent", touch: false },
  { path: "/play/math-choice", kind: "game-play", touch: true }
];

const SCREENSHOTS = new Set([
  "320:/child/demo-gian/home",
  "320:/parent",
  "390:/parent",
  "768:/parent",
  "1024:/parent",
  "320:/child/demo-gian/activity/color-gavi",
  "375:/child/demo-gian/learn",
  "390:/child/demo-gian/worlds",
  "390:/child/demo-gian/world/money-festival",
  "390:/child/demo-gian/world/money-festival/stage/money-stage-01-money-use",
  "390:/parent/children/demo-gian/reports",
  "430:/play/math-choice",
  "768:/child/demo-gian/stage/math-angka",
  "430:/child/demo-gian/stage/drawing-lines-shapes-basics",
  "1024:/games/math-choice"
]);

let server = null;
let serverLog = "";
const browserWarnings = new Map();

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
      NEXT_PUBLIC_DATA_BACKEND: process.env.NEXT_PUBLIC_DATA_BACKEND ?? "local",
      MAINLAGI_QA_UNLOCK_ALL: "1"
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
  let consoleWarnings = [];
  let pageErrors = [];
  const onConsole = (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
    if (message.type() === "warning") consoleWarnings.push(message.text());
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

    const coloringCanvas = page.locator("[data-coloring-hit-areas]");
    if (await coloringCanvas.count()) {
      await coloringCanvas.waitFor({ state: "visible", timeout: 5_000 });
      await page.waitForFunction(
        () => document.querySelector("[data-coloring-hit-areas]")?.getAttribute("data-coloring-hit-areas") === "ready",
        undefined,
        { timeout: 5_000 }
      );
    }

    const boundary = page.locator(`[data-mainlagi-route-boundary="${route.kind}"]`);
    assert.ok(await boundary.count(), `${route.path} is missing route boundary ${route.kind}`);

    const overlayCount = await page.locator("nextjs-portal, [data-nextjs-dialog-overlay], [data-next-badge-root]").count();
    assert.equal(overlayCount, 0, `${route.path} rendered a Next.js error overlay at ${viewport.width}px`);

    if (route.path === "/child/demo-gian/home") {
      assert.equal(await page.getByRole("link", { name: "Belajar", exact: true }).count(), 1, "child home must expose Belajar navigation");
      assert.equal(await page.getByRole("link", { name: "World", exact: true }).count(), 1, "child home must expose World navigation");
      assert.equal(await page.getByRole("link", { name: "Bermain", exact: true }).count(), 1, "child home must expose Bermain navigation");
      const subjectLinks = page.locator('a[href^="/child/demo-gian/subject/"]');
      assert.equal(await subjectLinks.count(), 9, "child home must expose all nine subject cards");
      assert.equal(await page.getByText(/\b100 aktivitas\b/).count(), 0, "subject cards must not expose activity-count subtitles");
      const columns = await subjectLinks.first().evaluate((element) =>
        getComputedStyle(element.parentElement).gridTemplateColumns.split(" ").filter(Boolean).length
      );
      assert.equal(columns, 3, `child home subject directory must stay three columns at ${viewport.width}px`);
      if (viewport.width <= 430) {
        const heroLayout = await page.evaluate(() => {
          const copy = document.querySelector("[data-mainlagi-home-copy]")?.getBoundingClientRect();
          const cast = document.querySelector("[data-mainlagi-home-cast]")?.getBoundingClientRect();
          return copy && cast ? { copyBottom: copy.bottom, castTop: cast.top } : null;
        });
        assert.ok(heroLayout, "child home hero layout markers must exist");
        assert.ok(heroLayout.copyBottom <= heroLayout.castTop + 1, `child home hero copy overlaps characters at ${viewport.width}px: ${JSON.stringify(heroLayout)}`);
      }
    }

    if (route.path === "/parent") {
      assert.equal(await page.getByRole("heading", { name: "Ringkasan belajar keluarga", exact: true }).count(), 1, "parent overview heading must be canonical");
      assert.equal(await page.getByRole("heading", { name: "Profil keluarga", exact: true }).count(), 1, "parent overview must separate family profiles");
      assert.equal(await page.getByRole("heading", { name: "Mode demo", exact: true }).count(), 1, "parent overview must separate demo profile");
      const mobileNav = page.locator("[data-mainlagi-parent-mobile-nav]");
      const sidebar = page.locator("[data-mainlagi-parent-sidebar]");
      if (viewport.width < 760) {
        assert.equal(await sidebar.isVisible(), false, `parent desktop sidebar must be hidden at ${viewport.width}px`);
        assert.ok(await mobileNav.isVisible(), `parent mobile navigation must be visible at ${viewport.width}px`);
        assert.equal(await mobileNav.locator("a").count(), 5, "parent mobile navigation must expose five primary destinations");
        const navGeometry = await mobileNav.evaluate((element) => {
          const rect = element.getBoundingClientRect();
          const links = Array.from(element.querySelectorAll("a")).map((link) => {
            const item = link.getBoundingClientRect();
            return { width: item.width, height: item.height, top: item.top, bottom: item.bottom };
          });
          return { rect: { left: rect.left, right: rect.right, bottom: rect.bottom }, links };
        });
        assert.ok(navGeometry.rect.left >= -1 && navGeometry.rect.right <= viewport.width + 1, `parent mobile nav must fit viewport at ${viewport.width}px: ${JSON.stringify(navGeometry)}`);
        assert.ok(Math.abs(navGeometry.rect.bottom - viewport.height) <= 2, `parent mobile nav must stay pinned to viewport bottom at ${viewport.width}px`);
        assert.ok(navGeometry.links.every((item) => item.height >= 58 && item.width > 0), `parent mobile nav items must stay readable at ${viewport.width}px: ${JSON.stringify(navGeometry.links)}`);
      } else {
        assert.ok(await sidebar.isVisible(), `parent desktop sidebar must be visible at ${viewport.width}px`);
        assert.equal(await mobileNav.isVisible(), false, `parent mobile navigation must be hidden on desktop at ${viewport.width}px`);
      }
    }

    if (route.path === "/parent/settings") {
      assert.equal(await page.getByRole("heading", { name: "Pengaturan", exact: true }).count(), 1, "parent settings heading must use Indonesian product copy");
      assert.equal(await page.locator('main a[href="/parent/children"]').count(), 1, "parent settings must link to family profiles");
      assert.equal(await page.locator('main a[href="/parent/privacy"]').count(), 1, "parent settings must link to privacy controls");
      assert.equal(await page.locator('main a[href="/parent/plan"]').count(), 1, "parent settings must link to plan surface");
    }

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

    for (const message of [...new Set(consoleWarnings)]) {
      const key = `${route.path}\u0000${message}`;
      const existing = browserWarnings.get(key) ?? { route: route.path, message, viewports: [] };
      if (!existing.viewports.includes(viewport.width)) existing.viewports.push(viewport.width);
      browserWarnings.set(key, existing);
    }

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

    {
      const viewport = { width: 390, height: 844 };
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      const response = await page.goto(baseUrl + "/worlds/money-festival", { waitUntil: "domcontentloaded" });
      assert.ok(response && response.status() < 400, "public World share landing must load without authentication");
      await page.getByRole("heading", { name: "Petualangan Uang", exact: true }).waitFor();
      const socialMeta = await page.evaluate(() => ({
        ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? "",
        ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "",
        twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute("content") ?? "",
        description: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
        body: document.body.innerText
      }));
      assert.match(socialMeta.ogTitle, /Petualangan Uang/, "public World share landing must expose World-specific Open Graph title");
      assert.match(socialMeta.ogImage, /\/og\/math-warung\.png$/, "public World share landing must expose a safe large social image");
      assert.equal(socialMeta.twitterCard, "summary_large_image", "public World share landing must use a large social card");
      assert.match(socialMeta.description, /Festival Mainlagi/, "public World share landing must expose safe descriptive metadata");
      assert.doesNotMatch(socialMeta.body, /demo-gian|account[_ -]?id|mastery score/i, "public World share landing must not leak child/account progress identifiers");
      await page.screenshot({ path: path.join(screenshotDir, "390-world-money-public-share.png"), fullPage: false });
      await context.close();
      console.log("World Petualangan Uang public-safe social metadata passed at 390px.");
    }

    {
      const viewport = { width: 390, height: 844 };
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      const route = { path: "/child/demo-gian/subject/math?qa=unlock-all", kind: "child-learning", touch: true };
      await inspectPage(page, route, viewport);
      await page.locator("[data-qa-unlock-all]").waitFor();
      assert.equal(await page.locator("[data-activity-id]").count(), 100, "QA unlock-all must expose all 100 math catalog cards");
      assert.equal(await page.locator('[data-activity-id] a[href^="/child/demo-gian/activity/"]').count(), 100, "QA unlock-all must make all math cards directly playable");
      assert.equal(await page.locator("[data-all-activity-gallery]").count(), 0, "QA unlock-all must leave no locked remainder");
      assert.ok(await page.locator("[data-activity-stage-group]").count() > 1, "QA unlock-all catalog must stay grouped by stage");
      await page.screenshot({ path: path.join(screenshotDir, "390-child-demo-gian-subject-math-qa-unlock.png"), fullPage: false });
      await context.close();
      console.log("WS-13 isolated QA unlock-all passed at 390px.");
    }

    {
      const viewport = { width: 390, height: 844 };
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      const stageUrl = baseUrl + "/child/demo-gian/world/money-festival/stage/money-stage-01-money-use";
      await page.goto(stageUrl, { waitUntil: "domcontentloaded" });
      await page.getByText("Uang Buat Apa?", { exact: true }).waitFor();
      const stageOneScene = page.locator('[data-world-scene="1"]');
      await stageOneScene.waitFor();
      const stageOneBackground = await stageOneScene.evaluate((node) => getComputedStyle(node, "::before").backgroundImage);
      assert.match(stageOneBackground, /playground-park-mobile\.webp/, "World Stage 1 must use the illustrated playground environment on mobile");

      for (let index = 0; index < 4; index += 1) {
        await page.getByRole("button", { name: /Lanjut/ }).click();
      }

      await page.getByRole("button", { name: "Rp3", exact: true }).click();
      await page.getByRole("button", { name: /Balon.*Rp3/ }).click();
      await page.getByRole("button", { name: "Rp4", exact: true }).click();
      await page.getByRole("button", { name: /Buah.*Rp4/ }).click();
      await page.getByRole("button", { name: "Rp5", exact: true }).click();
      await page.getByRole("button", { name: /Jus.*Rp5/ }).click();

      await page.getByRole("button", { name: /Lanjut/ }).waitFor();
      await page.getByRole("button", { name: /Lanjut/ }).click();
      await page.getByRole("button", { name: /Lanjut/ }).click();

      await page.getByRole("button", { name: "🎈 Balon", exact: true }).click();
      await page.getByRole("button", { name: "Rp3", exact: true }).click();
      await page.getByRole("button", { name: "🍎 Buah", exact: true }).click();
      await page.getByRole("button", { name: "Rp4", exact: true }).click();
      await page.getByRole("button", { name: "🧃 Jus", exact: true }).click();
      await page.getByRole("button", { name: "Rp5", exact: true }).click();

      await page.getByRole("button", { name: /Lanjut/ }).waitFor();
      await page.getByRole("button", { name: /Lanjut/ }).click();
      await page.getByRole("button", { name: /Selesai/ }).click();

      await page.getByRole("heading", { name: "Awesome!", exact: true }).waitFor();
      assert.equal(await page.locator('[aria-label="Tiga bintang"] svg').count(), 3, "World Stage 1 completion must show exactly three stars");
      assert.equal(await page.getByRole("link", { name: /Back/ }).count(), 1, "World completion must expose Back");
      assert.equal(await page.getByRole("button", { name: /Again/ }).count(), 1, "World completion must expose Again");
      assert.equal(await page.getByRole("link", { name: /Next/ }).count(), 1, "World completion must expose Next");
      assert.equal(await page.getByRole("button", { name: /Share/ }).count(), 1, "World completion must expose Share below navigation actions");
      await page.screenshot({ path: path.join(screenshotDir, "390-world-money-stage-01-complete.png"), fullPage: false });

      await page.getByRole("button", { name: /Share/ }).click();
      const worldShareDialog = page.getByRole("dialog", { name: "Bagikan pencapaian" });
      await worldShareDialog.waitFor();
      await worldShareDialog.getByText("Fitur berbagi hanya tersedia melalui sesi orang tua.", { exact: true }).waitFor();
      assert.equal(await worldShareDialog.getByRole("link", { name: "Buka Area Orang Tua", exact: true }).count(), 1, "World external share must stay parent-gated in child session");
      await worldShareDialog.getByRole("button", { name: "Tutup", exact: true }).click();

      await page.getByRole("link", { name: /Back/ }).click();
      await page.getByText("Kok Jadi Lebih Mahal?", { exact: true }).waitFor();
      const worldMap = page.locator('[data-world-map="money-festival"]');
      await worldMap.waitFor();
      const worldMapBackground = await worldMap.evaluate((node) => getComputedStyle(node).backgroundImage);
      assert.match(worldMapBackground, /garden-background\.webp/, "World map must use the illustrated Mainlagi garden environment");
      const chapterOneLabel = await page.locator('[data-stage-order="1"]').first().evaluate((node) => getComputedStyle(node, "::before").content);
      const chapterTwoLabel = await page.locator('[data-stage-order="5"]').first().evaluate((node) => getComputedStyle(node, "::before").content);
      assert.match(chapterOneLabel, /Chapter 1/, "World map must expose the Chapter 1 journey marker");
      assert.match(chapterTwoLabel, /Chapter 2/, "World map must expose the Chapter 2 journey marker");
      const stageTwoLink = page.locator('a[href="/child/demo-gian/world/money-festival/stage/money-stage-02-price-change"]');
      await stageTwoLink.waitFor();
      assert.equal(await stageTwoLink.count(), 1, "World Stage 1 completion must unlock Stage 2");
      assert.equal(await page.locator('[data-stage-order="2"][data-current-stage="true"]').count(), 1, "World map must visibly mark Stage 2 as the next journey stop");
      await page.waitForTimeout(50);
      const stageTwoBox = await page.locator('[data-world-stage-id="money-stage-02-price-change"]').boundingBox();
      assert.ok(stageTwoBox && stageTwoBox.y < viewport.height && stageTwoBox.y + stageTwoBox.height > 0, "World map must return the child near the next unlocked Stage");
      await context.close();
      console.log("World Petualangan Uang Stage 1 end-to-end checkpoint passed at 390px.");
    }

    {
      const viewport = { width: 390, height: 844 };
      const context = await browser.newContext({ viewport });
      await context.addInitScript((progress) => {
        window.localStorage.setItem("mainlagi-world-progress-v1", JSON.stringify({
          "demo-gian": { "money-festival": progress }
        }));
      }, {
        worldId: "money-festival",
        completedStageIds: ["money-stage-01-money-use"],
        currentStageId: "money-stage-02-price-change",
        currentSegmentIndex: 4,
        updatedAt: "2026-09-22T00:00:00.000Z"
      });
      const page = await context.newPage();
      await page.goto(baseUrl + "/child/demo-gian/world/money-festival/stage/money-stage-02-price-change", { waitUntil: "domcontentloaded" });
      await page.getByText("Kok Jadi Lebih Mahal?", { exact: true }).waitFor();
      const stageTwoScene = page.locator('[data-world-scene="2"]');
      const stageTwoBackground = await stageTwoScene.evaluate((node) => getComputedStyle(node, "::before").backgroundImage);
      assert.match(stageTwoBackground, /mini-market-mobile\.webp/, "World Stage 2 must use the illustrated market environment");

      await page.getByRole("button", { name: "Sekarang · Rp12", exact: true }).click();
      await page.getByRole("button", { name: /Lanjut/ }).waitFor();
      for (let index = 0; index < 6; index += 1) {
        await page.getByRole("button", { name: /Lanjut/ }).click();
      }

      for (const [card, group] of [
        ["5 → 7", /Naik/],
        ["8 → 8", /Tetap/],
        ["3 → 4", /Naik/],
        ["6 → 6", /Tetap/]
      ]) {
        await page.getByRole("button", { name: card, exact: true }).click();
        await page.getByRole("button", { name: group }).click();
      }

      await page.getByRole("button", { name: /Lanjut/ }).waitFor();
      await page.getByRole("button", { name: /Lanjut/ }).click();
      await page.getByRole("button", { name: /Selesai/ }).click();
      await page.getByRole("heading", { name: "Hebat!", exact: true }).waitFor();
      assert.equal(await page.locator('[aria-label="Tiga bintang"] svg').count(), 3, "World Stage 2 completion must show exactly three stars");
      await page.screenshot({ path: path.join(screenshotDir, "390-world-money-stage-02-complete.png"), fullPage: false });
      await context.close();
      console.log("World Petualangan Uang Stage 2 compare/classify checkpoint passed at 390px.");
    }

    {
      const viewport = { width: 390, height: 844 };
      const context = await browser.newContext({ viewport });
      await context.addInitScript((progress) => {
        window.localStorage.setItem("mainlagi-world-progress-v1", JSON.stringify({
          "demo-gian": { "money-festival": progress }
        }));
      }, {
        worldId: "money-festival",
        completedStageIds: [
          "money-stage-01-money-use",
          "money-stage-02-price-change",
          "money-stage-03-income-sources"
        ],
        currentStageId: "money-stage-04-needs-wants",
        currentSegmentIndex: 10,
        updatedAt: "2026-09-22T00:00:00.000Z"
      });
      const page = await context.newPage();
      await page.goto(baseUrl + "/child/demo-gian/world/money-festival/stage/money-stage-04-needs-wants", { waitUntil: "domcontentloaded" });
      await page.getByText("Butuh atau Mau?", { exact: true }).waitFor();
      await page.getByRole("button", { name: /Selesai/ }).click();
      await page.getByRole("heading", { name: "Excellent!", exact: true }).waitFor();
      await page.getByText("Chapter 1 selesai", { exact: true }).waitFor();
      await page.getByText("Pilih Pintar", { exact: true }).waitFor();
      await page.screenshot({ path: path.join(screenshotDir, "390-world-money-chapter-01-complete.png"), fullPage: false });
      await context.close();
      console.log("World Petualangan Uang Chapter 1 milestone reward passed at 390px.");
    }

    {
      const viewport = { width: 390, height: 844 };
      const context = await browser.newContext({ viewport });
      await context.addInitScript((progress) => {
        window.localStorage.setItem("mainlagi-world-progress-v1", JSON.stringify({
          "demo-gian": { "money-festival": progress }
        }));
      }, {
        worldId: "money-festival",
        completedStageIds: [
          "money-stage-01-money-use",
          "money-stage-02-price-change",
          "money-stage-03-income-sources",
          "money-stage-04-needs-wants"
        ],
        currentStageId: "money-stage-05-saving",
        currentSegmentIndex: 7,
        updatedAt: "2026-09-22T00:00:00.000Z"
      });
      const page = await context.newPage();
      await page.goto(baseUrl + "/child/demo-gian/world/money-festival/stage/money-stage-05-saving", { waitUntil: "domcontentloaded" });
      await page.getByText("Simpan Dulu Yuk", { exact: true }).waitFor();
      const stageFiveScene = page.locator('[data-world-scene="5"]');
      const stageFiveBackground = await stageFiveScene.evaluate((node) => getComputedStyle(node, "::before").backgroundImage);
      assert.match(stageFiveBackground, /number-park-mobile\.webp/, "World Stage 5 must move the story into the illustrated saving-park environment");
      await page.getByRole("button", { name: /Punya tujuan/ }).click();
      await page.getByRole("button", { name: /Simpan sebagian/ }).click();
      await page.getByRole("button", { name: /Uang terkumpul/ }).click();
      await page.getByRole("button", { name: /Pakai saat sudah cukup/ }).click();
      await page.getByRole("button", { name: "Cek urutan", exact: true }).click();
      await page.getByRole("button", { name: /Selesai/ }).waitFor();
      await page.getByRole("button", { name: /Selesai/ }).click();
      await page.getByRole("heading", { name: "Keren!", exact: true }).waitFor();
      await page.screenshot({ path: path.join(screenshotDir, "390-world-money-stage-05-order-complete.png"), fullPage: false });
      await context.close();
      console.log("World Petualangan Uang Stage 5 ordering checkpoint passed at 390px.");
    }

    {
      const viewport = { width: 390, height: 844 };
      const context = await browser.newContext({ viewport });
      await context.addInitScript((progress) => {
        window.localStorage.setItem("mainlagi-world-progress-v1", JSON.stringify({
          "demo-gian": { "money-festival": progress }
        }));
      }, {
        worldId: "money-festival",
        completedStageIds: [
          "money-stage-01-money-use",
          "money-stage-02-price-change",
          "money-stage-03-income-sources",
          "money-stage-04-needs-wants",
          "money-stage-05-saving",
          "money-stage-06-investment-intro",
          "money-stage-07-risk"
        ],
        currentStageId: "money-stage-08-final-festival",
        currentSegmentIndex: 4,
        updatedAt: "2026-09-22T00:00:00.000Z"
      });
      const page = await context.newPage();
      await page.goto(baseUrl + "/child/demo-gian/world/money-festival/stage/money-stage-08-final-festival", { waitUntil: "domcontentloaded" });
      await page.getByText("Kebutuhan sudah lengkap. Masih ada delapan token. Kamu mau apa?", { exact: true }).waitFor();
      const stageEightScene = page.locator('[data-world-scene="8"]');
      const stageEightBackground = await stageEightScene.evaluate((node) => getComputedStyle(node, "::before").backgroundImage);
      assert.match(stageEightBackground, /garden-background\.webp/, "World finale must return to the illustrated festival garden environment");
      await page.getByRole("button", { name: /Tambah pita/ }).click();
      await page.getByText("Kamu memilih membuat meja lebih meriah.", { exact: true }).waitFor();
      await page.getByRole("button", { name: /Lanjut/ }).click();
      await page.getByRole("button", { name: /Lanjut/ }).click();
      await page.getByRole("button", { name: "6", exact: true }).click();
      await page.getByRole("button", { name: /Lanjut/ }).waitFor();
      for (let index = 0; index < 3; index += 1) {
        await page.getByRole("button", { name: /Lanjut/ }).click();
      }
      await page.getByRole("heading", { name: "Yang kita temukan", exact: true }).waitFor();
      assert.equal(await page.locator('[aria-label="Ringkasan Petualangan Uang"] > *').count(), 6, "World finale recap must show six concrete learning moments");
      await page.getByRole("button", { name: /Lanjut/ }).click();
      await page.getByRole("button", { name: /Selesai/ }).click();

      await page.getByRole("heading", { name: "Luar biasa!", exact: true }).waitFor();
      await page.getByText("Petualangan Uang selesai. Festival Mainlagi siap!", { exact: true }).waitFor();
      assert.equal(await page.locator('[aria-label="Tiga bintang"] svg').count(), 3, "Final World Stage must show exactly three stars");
      assert.equal(await page.getByRole("button", { name: /Share/ }).count(), 1, "Final World Stage must retain Share below completion navigation");
      await page.screenshot({ path: path.join(screenshotDir, "390-world-money-stage-08-complete.png"), fullPage: false });

      await page.getByRole("link", { name: /Back/ }).click();
      const completedMap = page.locator('[data-world-map="money-festival"][data-world-complete="true"]');
      await completedMap.waitFor();
      await page.getByText("Festival siap!", { exact: true }).waitFor();
      assert.equal(await completedMap.locator('[aria-label="Tiga bintang"]').count(), 8, "Completed World map must retain three-star completion on all eight stages");
      await page.screenshot({ path: path.join(screenshotDir, "390-world-money-map-complete.png"), fullPage: true });
      await context.close();
      console.log("World Petualangan Uang final narrative-choice/subtraction checkpoint passed at 390px.");
    }

    {
      const viewport = { width: 390, height: 844 };
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      await page.goto(`${baseUrl}/child/demo-gian/activity/english-match-hello`, { waitUntil: "domcontentloaded" });
      const board = page.locator("[data-visible-matching]");
      await board.waitFor();
      const readColumns = async () => {
        const left = await page.locator('[data-match-column="left"] [data-match-card]').allTextContents();
        const right = await page.locator('[data-match-column="right"] [data-match-card]').allTextContents();
        return {
          left: left.map((value) => value.replace(/^✓\s*/, "").trim()),
          right: right.map((value) => value.replace(/^✓\s*/, "").trim())
        };
      };
      const pairOf = (label) => ({ CAT: "cat", "🐱": "cat", SUN: "sun", "☀️": "sun" })[label];
      const initial = await readColumns();
      assert.equal(initial.left.length, 2, "visible matching must split one card per pair into the left column");
      assert.equal(initial.right.length, 2, "visible matching must split one card per pair into the right column");
      for (let row = 0; row < initial.left.length; row += 1) {
        assert.notEqual(pairOf(initial.left[row]), pairOf(initial.right[row]), `matching row ${row + 1} must not reveal a correct adjacent pair`);
      }
      await page.screenshot({ path: path.join(screenshotDir, "390-visible-matching-randomized.png"), fullPage: false });

      await page.getByRole("button", { name: "CAT", exact: true }).click();
      await page.getByRole("button", { name: "🐱", exact: true }).click();
      await page.getByRole("button", { name: "SUN", exact: true }).click();
      await page.getByRole("button", { name: "☀️", exact: true }).click();

      const completion = page.locator("[data-activity-completion]");
      await completion.waitFor();
      assert.equal(await completion.getByLabel("Tiga bintang").locator("svg").count(), 3, "visible matching completion must use shared three-star success");
      const beforeRetry = [initial.left.join(","), initial.right.join(",")].join("|");
      await completion.getByRole("button", { name: "Try Again", exact: true }).click();
      await board.waitFor();
      await page.waitForTimeout(80);
      const retried = await readColumns();
      const afterRetry = [retried.left.join(","), retried.right.join(",")].join("|");
      assert.notEqual(afterRetry, beforeRetry, "Try Again must produce a different valid matching arrangement");
      for (let row = 0; row < retried.left.length; row += 1) {
        assert.notEqual(pairOf(retried.left[row]), pairOf(retried.right[row]), `retry matching row ${row + 1} must not reveal a correct adjacent pair`);
      }
      await page.screenshot({ path: path.join(screenshotDir, "390-visible-matching-retry.png"), fullPage: false });
      await context.close();
      console.log("WS-13 visible matching randomization + retry passed at 390px.");
    }

    {
      const viewport = { width: 390, height: 844 };
      const context = await browser.newContext({ viewport });
      await context.addInitScript(() => {
        window.__mainlagiAudioEntrySamples = [];

        class QaSpeechUtterance {
          constructor(text) {
            this.text = text;
            this.lang = "";
            this.pitch = 1;
            this.rate = 1;
            this.volume = 1;
            this.voice = null;
            this.listeners = new Map();
          }
          addEventListener(type, listener) {
            const list = this.listeners.get(type) ?? [];
            list.push(listener);
            this.listeners.set(type, list);
          }
          emit(type) {
            for (const listener of this.listeners.get(type) ?? []) listener();
          }
        }

        const voices = [
          { default: false, lang: "en-US", localService: true, name: "QA English", voiceURI: "qa-en" },
          { default: true, lang: "id-ID", localService: true, name: "QA Indonesia", voiceURI: "qa-id" }
        ];
        const qaSynth = {
          speaking: false,
          pending: false,
          current: null,
          getVoices() { return voices; },
          addEventListener() {},
          cancel() { this.current = null; this.speaking = false; this.pending = false; },
          speak(utterance) {
            this.current = utterance;
            this.speaking = true;
            setTimeout(() => { if (this.current === utterance) utterance.emit("start"); }, 8);
            setTimeout(() => {
              if (this.current !== utterance) return;
              this.current = null;
              this.speaking = false;
              utterance.emit("end");
            }, 36);
          }
        };

        Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true, value: QaSpeechUtterance });
        Object.defineProperty(window, "speechSynthesis", { configurable: true, value: qaSynth });
        window.addEventListener("mainlagi-activity-audio-entry-latency", (event) => {
          window.__mainlagiAudioEntrySamples.push(event.detail);
        });
      });
      const page = await context.newPage();

      const openFromCatalog = async (activityId) => {
        await page.goto(baseUrl + "/child/demo-gian/subject/english?qa=unlock-all", { waitUntil: "networkidle" });
        const activityLink = page.locator("[data-activity-id=\"" + activityId + "\"] a");
        await activityLink.waitFor();
        await page.waitForTimeout(120);
        const documentMarker = "qa-client-nav-" + activityId;
        await page.evaluate((value) => { window.__mainlagiAudioQaDocumentMarker = value; }, documentMarker);
        await activityLink.click();
        await page.waitForURL(new RegExp("/child/demo-gian/activity/" + activityId + "$"), { timeout: 10000 });
        assert.equal(await page.evaluate(() => window.__mainlagiAudioQaDocumentMarker), documentMarker, "audio QA requires hydrated client-side navigation");
        await page.waitForFunction(
          (expectedId) => window.__mainlagiAudioEntrySamples?.some((sample) => sample.activityId === expectedId),
          activityId,
          { timeout: 10000 }
        );
        return page.evaluate((expectedId) => window.__mainlagiAudioEntrySamples.find((sample) => sample.activityId === expectedId), activityId);
      };

      const genericSample = await openFromCatalog("english-find-blue");
      assert.equal(genericSample.activityId, "english-find-blue");
      assert.equal(genericSample.lang, "en-US", "English navigation must pre-warm English");
      assert.equal(genericSample.source, "navigation", "activity-link gesture must correlate with entry narration");
      assert.ok(Number.isFinite(genericSample.intentToRequestMs) && genericSample.intentToRequestMs >= 0 && genericSample.intentToRequestMs < 5000, "entry intent-to-request latency must be measurable");
      assert.equal("childId" in genericSample, false, "audio entry telemetry must not expose child identity");
      assert.equal("text" in genericSample, false, "audio entry telemetry must not expose narration text");
      assert.equal(genericSample.status, "spoken", "deterministic QA speech must actually start");
      assert.ok(Number.isFinite(genericSample.requestToStartMs), "spoken entry must include request-to-start latency");
      assert.ok(Number.isFinite(genericSample.totalStartLatencyMs), "spoken entry must include total start latency");

      const listeningSample = await openFromCatalog("english-find-blue-audio");
      assert.equal(listeningSample.activityId, "english-find-blue-audio");
      assert.equal(listeningSample.lang, "en-US");
      assert.equal(listeningSample.source, "navigation");
      assert.ok(Number.isFinite(listeningSample.intentToRequestMs) && listeningSample.intentToRequestMs < 5000, "listen-and-choose entry latency must be measurable");
      assert.equal(listeningSample.status, "spoken", "deterministic listening speech must actually start");
      assert.equal(await page.locator("[data-choices] button:disabled").count(), 0, "listening choices unlock only after narration starts");

      await page.screenshot({ path: path.join(screenshotDir, "390-audio-first-instruction.png"), fullPage: false });
      await context.close();
      console.log("WS-02 activity-entry audio warmup + latency instrumentation passed at 390px.");
    }

    {
      const viewport = { width: 390, height: 844 };
      const context = await browser.newContext({ viewport });
      await context.addInitScript(() => {
        const childId = "demo-gian";
        const progressKey = "mainlagi-learning-progress-v1";
        const attemptsKey = "mainlagi-learning-attempts-v1";
        const ids = ["math-recognize-0", "math-recognize-7", "math-count-4", "math-count-8", "math-count-10", "math-match-number-quantity-1-2", "math-subitize-4"];
        localStorage.setItem(progressKey, JSON.stringify({
          [childId]: { completedActivityIds: ids, stars: 0, lastActivityId: ids.at(-1) }
        }));
        const seeds = [
          ["math-recognize-0", "math.numeral.recognition.0_10", "tap_choice"],
          ["math-count-4", "math.count.4_10", "tap_choice"],
          ["math-match-number-quantity-1-2", "math.quantity.matching", "matching"],
          ["math-subitize-4", "math.quantity.subitizing", "tap_choice"]
        ];
        const attempts = seeds.map(([id, skillId, runtime], index) => {
          const attemptId = `qa-shared-completion-prereq-${index}`;
          const completedAt = `2026-09-20T08:0${index}:00.000Z`;
          return {
            id: attemptId, childId, activityId: id, subjectId: "math", stageId: "math-jumlah-dasar",
            runtime, difficulty: 2, status: "completed", assessed: true, score: 1, accuracy: 1,
            correctCount: runtime === "matching" ? 2 : 1, incorrectCount: 0, hintCount: 0, retryCount: 0,
            durationMs: 1000, inputMode: "touch", startedAt: completedAt, completedAt,
            metadata: { source: "shared-completion-browser-prerequisite" },
            evidence: [{ attemptId, activityId: id, skillId, score: 1, weight: 1, createdAt: completedAt, qualifiesForMastery: true }],
            masteryEligible: true
          };
        });
        localStorage.setItem(attemptsKey, JSON.stringify({ [childId]: attempts }));
      });
      const page = await context.newPage();
      await page.goto(`${baseUrl}/child/demo-gian/activity/math-pattern-size`, { waitUntil: "domcontentloaded" });
      await page.getByRole("button", { name: "Pilih •", exact: true }).click();
      let completion = page.locator("[data-activity-completion]");
      await completion.waitFor();
      await page.waitForTimeout(250);
      completion = page.locator("[data-activity-completion]");
      await completion.waitFor();
      assert.equal(await completion.getByLabel("Tiga bintang").locator("svg").count(), 3, "shared completion must render three stars");
      assert.equal(await completion.getByRole("button", { name: "Back", exact: true }).count(), 1, "shared completion must expose Back");
      assert.equal(await completion.getByRole("button", { name: "Try Again", exact: true }).count(), 1, "shared completion must expose Try Again");
      assert.equal(await completion.getByRole("link", { name: "Next", exact: true }).count(), 1, "shared completion must expose Next");
      const completionGeometry = await completion.evaluate((root) => {
        const rootBox = root.getBoundingClientRect();
        const controls = Array.from(root.querySelectorAll("button, a")).map((element) => {
          const box = element.getBoundingClientRect();
          return { text: element.textContent?.trim() ?? "", left: box.left, right: box.right, top: box.top, bottom: box.bottom };
        });
        return { root: { left: rootBox.left, right: rootBox.right, top: rootBox.top, bottom: rootBox.bottom }, controls };
      });
      assert.ok(completionGeometry.root.left >= -1 && completionGeometry.root.right <= viewport.width + 1, "completion overlay must remain inside viewport width");
      assert.ok(completionGeometry.root.top >= -1 && completionGeometry.root.bottom <= viewport.height + 1, "completion overlay must remain inside viewport height");
      for (const control of completionGeometry.controls.filter((item) => ["Back", "Try Again", "Next", "Share"].includes(item.text))) {
        assert.ok(control.left >= -1 && control.right <= viewport.width + 1 && control.top >= -1 && control.bottom <= viewport.height + 1, `completion control ${control.text} must be immediately visible`);
      }
      await page.screenshot({ path: path.join(screenshotDir, "390-shared-completion-success.png"), fullPage: false });
      await page.getByRole("button", { name: "Share", exact: true }).click();
      const shareDialog = page.getByRole("dialog", { name: "Bagikan pencapaian" });
      await shareDialog.waitFor();
      await shareDialog.getByText("Yang dibagikan hanya tautan Mainlagi", { exact: false }).waitFor();
      for (const label of ["Copy link", "WhatsApp", "Telegram", "X", "Facebook", "Threads"]) {
        assert.equal(await shareDialog.getByRole(label === "Copy link" ? "button" : "link", { name: label, exact: true }).count(), 1, `share dialog missing ${label}`);
      }
      await page.screenshot({ path: path.join(screenshotDir, "390-shared-completion.png"), fullPage: false });
      await context.close();
      console.log("WS-13 shared completion + parent-gated share passed at 390px.");
    }

    for (const width of [320, 430]) {
      const viewport = VIEWPORTS.find((item) => item.width === width);
      assert.ok(viewport, `missing viewport ${width}px`);
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      for (const [runtime, routePath] of RUNTIME_ROUTES) {
        await inspectPage(page, { path: routePath, kind: "child-learning", touch: true }, viewport);
        if (runtime === "coloring") {
          const nose = page.getByRole("button", { name: "Warnai hidung" });
          await nose.click();
          assert.equal(await nose.getAttribute("data-color-filled"), "true", `Coloring touch interaction did not paint the nose at ${width}px.`);
        }
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

  const warningEvidence = [...browserWarnings.values()]
    .map((item) => ({ ...item, viewports: [...item.viewports].sort((a, b) => a - b) }))
    .sort((a, b) => a.route.localeCompare(b.route) || a.message.localeCompare(b.message));
  writeFileSync(
    path.join(screenshotDir, "browser-warnings.json"),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), count: warningEvidence.length, warnings: warningEvidence }, null, 2)}\n`
  );

  console.log(`Browser warning inventory: ${warningEvidence.length} unique route/message exposure(s). Evidence: ${path.join(screenshotDir, "browser-warnings.json")}`);
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
