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
  { name: "activity-english-blue", path: "/child/demo-gian/activity/english-find-blue", expectedPath: "/child/demo-gian/activity/english-find-blue", kind: "child-learning", touch: true },
  { name: "stage-drawing", path: "/child/demo-gian/stage/drawing-lines-shapes-basics", expectedPath: "/child/demo-gian/stage/drawing-lines-shapes-basics", kind: "child-learning", touch: true },
  { name: "activity-matching", path: "/child/demo-gian/activity/bahasa-pasang-awal", expectedPath: "/child/demo-gian/activity/bahasa-pasang-awal", kind: "child-learning", touch: true },
  { name: "rewards", path: "/child/demo-gian/rewards", expectedPath: "/child/demo-gian/rewards", kind: "child-learning", touch: true },
  { name: "parent-report", path: "/parent/children/demo-gian/reports", expectedPath: "/parent/children/demo-gian/reports", kind: "parent" },
  { name: "account", path: "/account", expectedPath: "/account" },
  { name: "account-profile", path: "/account/profile", expectedPath: "/account/profile" },
  { name: "account-players", path: "/account/players", expectedPath: "/parent/children" },
  { name: "account-preferences", path: "/account/preferences", expectedPath: "/parent/settings" },
  { name: "account-security", path: "/account/security", expectedPath: "/account/security" },
  { name: "account-delete", path: "/account/delete", expectedPath: "/account/delete" },
  { name: "account-about", path: "/account/about", expectedPath: "/about" },
  { name: "about", path: "/about", expectedPath: "/about" },
  { name: "faq", path: "/faq", expectedPath: "/faq" },
  { name: "login", path: "/login", expectedPath: "/login" },
  { name: "signup", path: "/signup", expectedPath: "/signup" },
  { name: "forgot-password", path: "/forgot-password", expectedPath: "/forgot-password" },
  { name: "reset-password", path: "/reset-password", expectedPath: "/reset-password" },
  { name: "auth-error", path: "/auth/callback?error_code=otp_expired", expectedPath: "/auth/callback" },
  { name: "not-found", path: "/__visual-baseline-not-found__", expectedPath: "/__visual-baseline-not-found__", expectedStatus: 404 }
];

const INTENTIONAL_NOT_FOUND_CONSOLE = "Failed to load resource: the server responded with a status of 404 (Not Found)";
const PARENT_PRIMARY_JARGON = /\battempts?\b|\bassessed\b|\bpractice\b|qualifying evidence|mastery canonical|\bretry\b/i;
const GLOBAL_MENU_LABELS = [
  "Beranda",
  "Belajar",
  "Bermain",
  "World",
  "Shop",
  "Bacaan & ide",
  "Area orang tua",
  "Tentang Mainlagi"
];

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

async function assertChildHomeVisualFirst(page, viewport) {
  const home = page.locator('[data-child-home-visual="wave1"]');
  assert.equal(await home.count(), 1, `visual-first child home marker missing at ${viewport.width}px`);
  assert.equal(await home.locator("[data-mainlagi-home-hero] img").count(), 1, `canonical character hero missing at ${viewport.width}px`);
  assert.equal(await home.getByRole("heading", { name: /^Hai, Gian!/ }).count(), 1, `short child greeting missing at ${viewport.width}px`);
  assert.equal(await home.getByRole("link", { name: /Lanjut main/ }).count(), 1, `child resume action missing at ${viewport.width}px`);
  const choices = home.locator("[data-mainlagi-domain-card]");
  assert.equal(await choices.count(), 3, `child home must preserve three subject/domain entry choices at ${viewport.width}px`);
  const widths = await choices.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().width));
  assert.ok(widths.every((width) => width >= 70), `child experience cards too narrow at ${viewport.width}px: ${JSON.stringify(widths)}`);
}

async function assertSubjectJourneyLayout(page, viewport) {
  const journey = page.locator('[data-belajar-journey-map="v1"][data-journey-subject="math"]');
  assert.equal(await journey.count(), 1, `Math Journey Map missing at ${viewport.width}px`);
  assert.equal(await journey.locator("[data-journey-stage]").count(), 6, `Math Journey Map stage count drifted at ${viewport.width}px`);
  assert.equal(await journey.locator("[data-journey-browse-all] li").count(), 100, `Math Journey Map activity membership drifted at ${viewport.width}px`);

  const geometry = await journey.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth
  }));
  assert.ok(
    geometry.scrollWidth <= geometry.clientWidth + 1,
    `Math Journey Map overflows horizontally at ${viewport.width}px: ${JSON.stringify(geometry)}`
  );
  const locked = journey.locator('[data-journey-stage][data-state="locked"]');
  assert.ok(await locked.count() > 0, `Math locked stages unexpectedly absent at ${viewport.width}px`);
  assert.equal(await locked.first().isDisabled(), true, `Math locked stage can be clicked at ${viewport.width}px`);
  const visibleOpacity = await locked.first().evaluate((element) => Number(getComputedStyle(element).opacity));
  assert.ok(visibleOpacity >= .85, `Math locked stages are visually washed out at ${viewport.width}px: ${visibleOpacity}`);
  await journey.locator("[data-journey-stage]").first().click();
  const detail = page.locator("[data-stage-detail-open]");
  await detail.waitFor({ state: "visible" });
  assert.ok(await detail.getByText(/langkah utama/).count() > 0, `Stage Detail lost required-step progress at ${viewport.width}px`);
  assert.equal(await detail.locator("[data-stage-text-activity-list] details").count(), 1, `Stage Detail lacks activity disclosure at ${viewport.width}px`);
  assert.equal(await detail.locator("[data-stage-continue]").count(), 1, `Stage Detail continue missing at ${viewport.width}px`);
  assert.equal(await detail.locator("[data-stage-continue]").count(), 1, `Exactly one primary stage link at ${viewport.width}px`);
  await page.screenshot({ path: path.join(outputDir, `stage-detail-open-${viewport.width}x${viewport.height}.png`), fullPage: false });
  await page.keyboard.press("Escape");
  await detail.waitFor({ state: "hidden" });
}

async function assertMatchingFocusVisual(page, viewport) {
  const frame = page.locator('[data-activity-frame="garden"]');
  assert.equal(await frame.getAttribute("data-activity-presentation"), "matching-focus-v2", `matching Garden focus missing at ${viewport.width}px`);
  const game = page.locator('[data-match-experience="visual-first-v2"]');
  assert.equal(await game.count(), 1, `matching visual-first surface missing at ${viewport.width}px`);
  const cards = game.locator("[data-match-card]");
  assert.equal(await cards.count(), 4, `matching card count drifted at ${viewport.width}px`);
  const progress = game.locator("[data-match-progress]");
  assert.equal(await progress.getAttribute("data-match-progress"), "0", `matching initial local progress drifted at ${viewport.width}px`);
  assert.equal(await game.getByText("Sentuh dua kartu!", { exact: true }).count(), 1,
    `Indonesian matching feedback must remain localized at ${viewport.width}px`);
  const instructions = game.locator("[data-match-instructions]");
  assert.equal(await instructions.count(), 1, `Matching fallback instructions missing at ${viewport.width}px`);
  assert.equal(await instructions.locator("summary").textContent(), "Baca petunjuk",
    `Indonesian matching instruction label changed at ${viewport.width}px`);
  assert.equal(await instructions.locator("[data-match-canonical-prompt]").textContent(),
    await game.getAttribute("aria-label"), `Matching accessible full prompt drifted at ${viewport.width}px`);
  const geometry = await cards.evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }));
  assert.ok(geometry.every((rect) => rect.width >= 90 && rect.height >= 82),
    `matching touch targets collapsed at ${viewport.width}px: ${JSON.stringify(geometry)}`);
  assert.equal(await game.locator("[data-match-column]").count(), 2, `matching two-column semantics changed at ${viewport.width}px`);
  assert.equal(await frame.locator("[data-character-layer]").count(), 1, `matching lost canonical character layer at ${viewport.width}px`);
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

async function assertCanonicalGlobalMenu(page, viewport, routeName) {
  const header = page.locator("[data-mainlagi-global-header]").first();
  assert.equal(await header.count(), 1, `${routeName} global Mainlagi header missing at ${viewport.width}px`);
  const trigger = header.locator("[data-mainlagi-left-menu-trigger]");
  assert.equal(await trigger.count(), 1, `${routeName} left global menu trigger missing at ${viewport.width}px`);
  await trigger.click();
  const drawer = page.locator("[data-mainlagi-left-menu-drawer]");
  await drawer.waitFor({ state: "visible", timeout: 3_000 });
  const labels = (await drawer.locator("nav strong").allTextContents()).map((item) => item.trim());
  assert.deepEqual(labels, GLOBAL_MENU_LABELS, `${routeName} global menu labels/order drifted at ${viewport.width}px`);
  const rect = await drawer.boundingBox();
  assert.ok(rect && rect.x <= 1, `${routeName} global drawer must open from the left at ${viewport.width}px`);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("[data-mainlagi-left-menu-drawer]").count(), 0, `${routeName} global drawer must close with Escape at ${viewport.width}px`);
}

async function assertChildSelectAccountFirst(page, viewport) {
  assert.equal(await page.locator("[data-mainlagi-account-first-gate]").count(), 1, `child-select signed-out account gate missing at ${viewport.width}px`);
  assert.equal(await page.locator("[data-mainlagi-cloud-profile-form]").count(), 0, `child-select must not expose production profile form while signed out at ${viewport.width}px`);
  const copy = (await page.locator("main").innerText()).replace(/\s+/g, " ");
  assert.match(copy, /Gian\s+—\s+Demo/i, `child-select must preserve Gian Demo at ${viewport.width}px`);
  assert.match(copy, /Daftar dengan email/i, `child-select account-first signup CTA missing at ${viewport.width}px`);
}

async function assertAboutCurrent(page, viewport) {
  const copy = (await page.locator("main").innerText()).replace(/\s+/g, " ");
  assert.match(copy, /anak usia 3[–-]7 tahun/i, `About age positioning drifted at ${viewport.width}px`);
  assert.match(copy, /Belajar/i, `About must describe Belajar at ${viewport.width}px`);
  assert.match(copy, /World/i, `About must describe World at ${viewport.width}px`);
  assert.match(copy, /Gian Demo/i, `About must describe the demo/account boundary at ${viewport.width}px`);
  assert.doesNotMatch(copy, /10 permainan edukasi/i, `About restored stale motion-only positioning at ${viewport.width}px`);
  assert.doesNotMatch(copy, /Guru\s*&\s*presenter/i, `About restored stale primary audience at ${viewport.width}px`);
}

async function assertFaqCurrent(page, viewport) {
  const copy = (await page.locator("main").innerText()).replace(/\s+/g, " ");
  assert.match(copy, /anak usia 3[–-]7 tahun/i, `FAQ age positioning drifted at ${viewport.width}px`);
  assert.match(copy, /Gian Demo/i, `FAQ must preserve the explicit no-account demo boundary at ${viewport.width}px`);
  assert.doesNotMatch(copy, /semua game tanpa akun|10 permainan|TK[–-]SD|leaderboard mingguan|Guru\s*&\s*presenter/i, `FAQ restored stale product/account positioning at ${viewport.width}px`);
}

async function assertPublicFamilyEntry(page, viewport) {
  assert.equal(await page.locator("[data-mainlagi-public-family-entry]").count(), 1, `public family entry missing at ${viewport.width}px`);
  assert.equal(await page.locator("[data-mainlagi-public-child-cta]").count(), 1, `public child CTA missing at ${viewport.width}px`);
  assert.equal(await page.locator("[data-mainlagi-public-parent-cta]").count(), 1, `public parent CTA missing at ${viewport.width}px`);
  assert.equal(await page.locator("[data-mainlagi-public-home-hero]").count(), 1, `public child-style hero missing at ${viewport.width}px`);
  assert.equal(await page.locator(".bottom-nav").count(), 0, `public root must not render legacy bottom navigation at ${viewport.width}px`);

  const header = page.locator('[data-mainlagi-public-header="v3"]');
  assert.equal(await header.count(), 1, `public converged header missing at ${viewport.width}px`);
  const menuTrigger = header.locator("[data-mainlagi-left-menu-trigger]");
  assert.equal(await menuTrigger.count(), 1, `public left menu trigger missing at ${viewport.width}px`);

  const headerGeometry = await header.evaluate((node) => {
    const trigger = node.querySelector("[data-mainlagi-left-menu-trigger]");
    const brand = node.querySelector(".top-nav__brand");
    const account = node.querySelector(".top-nav__account");
    if (!(trigger instanceof HTMLElement) || !(brand instanceof HTMLElement) || !(account instanceof HTMLElement)) return null;
    const triggerRect = trigger.getBoundingClientRect();
    const brandRect = brand.getBoundingClientRect();
    const accountRect = account.getBoundingClientRect();
    return {
      triggerX: triggerRect.x,
      triggerWidth: triggerRect.width,
      brandCenter: brandRect.x + brandRect.width / 2,
      accountX: accountRect.x,
      viewportCenter: document.documentElement.clientWidth / 2
    };
  });
  assert.ok(headerGeometry, `public header geometry unavailable at ${viewport.width}px`);
  assert.ok(headerGeometry.triggerX < headerGeometry.brandCenter, `public menu must stay left of the Mainlagi logo at ${viewport.width}px`);
  assert.ok(headerGeometry.accountX > headerGeometry.brandCenter, `public account control must stay right of the Mainlagi logo at ${viewport.width}px`);
  assert.ok(Math.abs(headerGeometry.brandCenter - headerGeometry.viewportCenter) <= 3, `public Mainlagi logo must remain centered at ${viewport.width}px`);

  await menuTrigger.click();
  const drawer = page.locator("[data-mainlagi-left-menu-drawer]");
  await drawer.waitFor({ state: "visible", timeout: 3_000 });
  const drawerRect = await drawer.boundingBox();
  assert.ok(drawerRect && drawerRect.x <= 1, `public menu must open from the left edge at ${viewport.width}px`);
  for (const href of ["/", "/child/select?continue=1", "/games", "/shop/parent-entry", "/discover", "/parent", "/about"]) {
    assert.ok(await drawer.locator(`a[href="${href}"]`).count() >= 1, `public drawer missing ${href} at ${viewport.width}px`);
  }
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("[data-mainlagi-left-menu-drawer]").count(), 0, `public drawer must close with Escape at ${viewport.width}px`);

  const copy = (await page.locator("[data-mainlagi-public-family-entry]").innerText()).replace(/\s+/g, " ");
  assert.match(copy, /kamera\s+(bersifat\s+)?opsional/i, `public entry must explain optional camera use at ${viewport.width}px`);
  assert.match(copy, /Belajar,\s*berpetualang,\s*lalu main lagi\./i, `public headline must converge with Child Home at ${viewport.width}px`);

  const ctaGeometry = await page.locator("[data-mainlagi-public-child-cta], [data-mainlagi-public-parent-cta]").evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { width: Math.round(rect.width * 10) / 10, height: Math.round(rect.height * 10) / 10 };
    })
  );
  assert.ok(ctaGeometry.every((item) => item.height >= 44), `public family CTAs fell below touch target at ${viewport.width}px: ${JSON.stringify(ctaGeometry)}`);
}

async function assertAuthFamilySurface(page, route, viewport) {
  await assertCanonicalGlobalMenu(page, viewport, route.name);
  assert.equal(await page.locator("[data-mainlagi-auth-family-shell]").count(), 1, `${route.name} family shell missing at ${viewport.width}px`);
  assert.equal(await page.locator("[data-mainlagi-auth-context]").count(), 1, `${route.name} family context missing at ${viewport.width}px`);
  assert.equal(await page.locator("[data-mainlagi-auth-panel]").count(), 1, `${route.name} auth panel missing at ${viewport.width}px`);

  if (route.name === "auth-error") {
    assert.equal(await page.locator("[data-mainlagi-auth-status]").count(), 1, `auth callback status missing at ${viewport.width}px`);
  } else {
    const expectedMode = route.name === "forgot-password"
      ? "forgot"
      : route.name === "reset-password"
        ? "reset"
        : route.name;
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

async function assertAccountSectionSurface(page, route, viewport) {
  const section = page.locator("[data-mainlagi-account-section]");
  const panel = page.locator("[data-mainlagi-account-section-panel]");
  assert.equal(await section.count(), 1, `${route.name} account section shell missing at ${viewport.width}px`);
  assert.equal(await panel.count(), 1, `${route.name} account section panel missing at ${viewport.width}px`);

  if (viewport.width >= 700) {
    const width = await panel.evaluate((element) => Math.round(element.getBoundingClientRect().width * 10) / 10);
    assert.ok(width >= 560, `${route.name} account section collapsed at ${viewport.width}px: ${width}`);
  }

  if (route.name === "account-preferences") {
    const controls = await panel.locator("button").evaluateAll((elements) => elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { width: Math.round(rect.width * 10) / 10, height: Math.round(rect.height * 10) / 10 };
    }));
    assert.ok(controls.length >= 3, `account preferences controls unexpectedly sparse at ${viewport.width}px`);
    assert.ok(controls.every((item) => item.height >= 44), `account preferences controls fell below target at ${viewport.width}px: ${JSON.stringify(controls)}`);
  }
}

async function assertSystemState(page, viewport) {
  const state = page.locator('[data-mainlagi-system-state="not-found"]');
  assert.equal(await state.count(), 1, `not-found system state marker missing at ${viewport.width}px`);
  const cta = page.locator("[data-mainlagi-system-state-cta]");
  assert.equal(await cta.count(), 1, `not-found canonical CTA missing at ${viewport.width}px`);
  const geometry = await cta.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { width: Math.round(rect.width * 10) / 10, height: Math.round(rect.height * 10) / 10 };
  });
  assert.ok(geometry.height >= 44, `not-found CTA fell below target height at ${viewport.width}px: ${JSON.stringify(geometry)}`);
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

    if (route.name === "public-root") {
      await assertPublicFamilyEntry(page, viewport);
      await assertCanonicalGlobalMenu(page, viewport, route.name);
    }
    if (route.name === "child-select") {
      await assertCanonicalGlobalMenu(page, viewport, route.name);
      await assertChildSelectAccountFirst(page, viewport);
    }
    if (["child-home", "subject-math", "stage-math-angka", "rewards"].includes(route.name)) await assertCanonicalGlobalMenu(page, viewport, route.name);
    if (route.name === "parent-report") {
      await assertCanonicalGlobalMenu(page, viewport, route.name);
      await assertParentReportPrimaryCopy(page, viewport);
    }
    if (route.name === "child-home") await assertChildHomeVisualFirst(page, viewport);
    if (route.name === "subject-math") await assertSubjectJourneyLayout(page, viewport);
    if (route.name === "stage-math-angka") await assertStageHierarchy(page, viewport);
    if (route.name === "activity-matching") await assertMatchingFocusVisual(page, viewport);
    if (route.name === "activity-english-blue") {
      assert.equal(await page.getByText("Tap your answer!", { exact: true }).count(), 1,
        `English Choice child hint must be localized at ${viewport.width}px`);
    }
    if (route.name === "stage-drawing") {
      const screen = await page.locator("main").first().innerText();
      assert.doesNotMatch(screen, /Creative practice|mastery|completion saja|Lesson/i,
        `Drawing must not expose internal adult learning terminology at ${viewport.width}px`);
    }
    if (route.name === "activity-math-count") {
      const frame = page.locator('[data-activity-frame="garden"]');
      assert.equal(await frame.getAttribute("data-activity-presentation"), null,
        `choice Garden inherited Matching-only visual treatment at ${viewport.width}px`);
    }
    if (route.name === "account") {
      await assertCanonicalGlobalMenu(page, viewport, route.name);
      await assertAccountFamilySurface(page, viewport);
    }
    if (["account-profile", "account-security", "account-delete"].includes(route.name)) {
      await assertCanonicalGlobalMenu(page, viewport, route.name);
      await assertAccountSectionSurface(page, route, viewport);
    }
    if (["account-players", "account-preferences"].includes(route.name)) await assertCanonicalGlobalMenu(page, viewport, route.name);
    if (["account-about", "about"].includes(route.name)) {
      await assertCanonicalGlobalMenu(page, viewport, route.name);
      await assertAboutCurrent(page, viewport);
    }
    if (route.name === "faq") {
      await assertCanonicalGlobalMenu(page, viewport, route.name);
      await assertFaqCurrent(page, viewport);
    }
    if (["login", "signup", "forgot-password", "reset-password", "auth-error"].includes(route.name)) await assertAuthFamilySurface(page, route, viewport);
    if (route.name === "not-found") await assertSystemState(page, viewport);

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