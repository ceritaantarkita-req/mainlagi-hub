import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const outDir = path.resolve("visual-qa-world");
await fs.mkdir(outDir, { recursive: true });

const checkpoints = [
  [76, 17], [61, 17], [46, 17], [32, 19], [31, 33], [31, 47], [44, 45],
  [59, 46], [69, 54], [71, 66], [65, 77], [53, 83], [39, 82], [29, 75]
];

const browser = await chromium.launch({ headless: true });
const failures = [];
const captures = [];

async function assertHealthy(page, label) {
  const bodyText = (await page.locator("body").innerText()).trim();
  if (!bodyText) failures.push(`${label}: empty body`);
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  if (overflow.scrollWidth > overflow.clientWidth + 2) failures.push(`${label}: root horizontal overflow ${overflow.scrollWidth} > ${overflow.clientWidth}`);
}

async function shot(page, name) {
  await assertHealthy(page, name);
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  captures.push(name);
}

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "no-preference" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (msg) => { if (msg.type() === "error") errors.push(`console: ${msg.text()}`); });

  async function go(route, label) {
    const response = await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle", timeout: 30000 });
    if (!response || !response.ok()) failures.push(`${label}: HTTP ${response?.status() ?? "no response"}`);
  }

  await go("/child/demo-gian/home", "home");
  await page.waitForTimeout(350);
  await shot(page, "mobile-01-home");

  await go("/child/demo-gian/learn", "learn");
  await shot(page, "mobile-02-learn-worlds");

  await go("/child/demo-gian/subject/math", "math-world");
  await shot(page, "mobile-03-math-world");

  await go("/child/demo-gian/stage/math-angka", "math-stage");
  await shot(page, "mobile-04-math-stage-fresh");

  await go("/child/demo-gian/activity/math-count-3", "count");
  await shot(page, "mobile-05-count-fresh");
  await page.getByRole("button", { name: "2", exact: true }).click();
  await page.waitForTimeout(250);
  await shot(page, "mobile-06-count-wrong");
  await page.getByRole("button", { name: "3", exact: true }).click();
  await page.getByRole("dialog", { name: "Aktivitas selesai" }).waitFor({ state: "visible" });
  await shot(page, "mobile-07-count-celebration");

  await go("/child/demo-gian/stage/math-angka", "stage-after-count");
  const traceLink = page.getByRole("link", { name: /Telusuri angka 5/ });
  if (!(await traceLink.isVisible())) failures.push("stage-after-count: trace challenge did not unlock");
  await shot(page, "mobile-08-stage-after-count");

  await go("/child/demo-gian/activity/math-trace-5-touch", "trace");
  await shot(page, "mobile-09-trace-fresh");
  const board = page.getByLabel("Area untuk menelusuri angka lima");
  const box = await board.boundingBox();
  if (!box) {
    failures.push("trace: missing trace board bounding box");
  } else {
    const toScreen = ([x, y]) => ({ x: box.x + box.width * x / 100, y: box.y + box.height * y / 100 });
    const first = toScreen(checkpoints[0]);
    await page.mouse.move(first.x, first.y);
    await page.mouse.down();
    for (const checkpoint of checkpoints.slice(1)) {
      const point = toScreen(checkpoint);
      await page.mouse.move(point.x, point.y, { steps: 5 });
      await page.waitForTimeout(25);
    }
    await page.mouse.up();
    await page.getByRole("dialog", { name: "Trace selesai" }).waitFor({ state: "visible", timeout: 5000 });
    await shot(page, "mobile-10-trace-celebration");
  }

  await go("/child/demo-gian/subject/math", "math-after-stage1");
  const lockCopy = page.getByText("Selesaikan petualangan sebelumnya", { exact: true });
  if (await lockCopy.count()) failures.push("math-after-stage1: next Math stage still locked");
  await shot(page, "mobile-11-math-stage1-complete");

  await go("/child/demo-gian/rewards", "rewards");
  await shot(page, "mobile-12-rewards-five-stars");

  if (errors.length) failures.push(...errors.map((error) => `browser: ${error}`));
  await context.close();

  const narrow = await browser.newContext({ viewport: { width: 360, height: 800 }, reducedMotion: "no-preference" });
  const narrowPage = await narrow.newPage();
  const narrowErrors = [];
  narrowPage.on("pageerror", (error) => narrowErrors.push(`pageerror: ${error.message}`));
  narrowPage.on("console", (msg) => { if (msg.type() === "error") narrowErrors.push(`console: ${msg.text()}`); });
  await narrowPage.goto(`${baseURL}/child/demo-gian/home`, { waitUntil: "networkidle", timeout: 30000 });
  await shot(narrowPage, "narrow-01-home-360");
  await narrowPage.goto(`${baseURL}/child/demo-gian/activity/math-trace-5-touch`, { waitUntil: "networkidle", timeout: 30000 });
  await shot(narrowPage, "narrow-02-trace-360");
  if (narrowErrors.length) failures.push(...narrowErrors.map((error) => `narrow browser: ${error}`));
  await narrow.close();

  const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "no-preference" });
  const desktopPage = await desktop.newPage();
  const desktopErrors = [];
  desktopPage.on("pageerror", (error) => desktopErrors.push(`pageerror: ${error.message}`));
  desktopPage.on("console", (msg) => { if (msg.type() === "error") desktopErrors.push(`console: ${msg.text()}`); });
  await desktopPage.goto(`${baseURL}/child/demo-gian/home`, { waitUntil: "networkidle", timeout: 30000 });
  await shot(desktopPage, "desktop-01-home");
  await desktopPage.goto(`${baseURL}/child/demo-gian/subject/math`, { waitUntil: "networkidle", timeout: 30000 });
  await shot(desktopPage, "desktop-02-math-world");
  if (desktopErrors.length) failures.push(...desktopErrors.map((error) => `desktop browser: ${error}`));
  await desktop.close();
} finally {
  await browser.close();
}

await fs.writeFile(path.join(outDir, "summary.json"), JSON.stringify({ baseURL, captures, failures }, null, 2));
if (failures.length) {
  console.error("World visual QA failures:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log(`World visual QA passed with ${captures.length} screenshots.`);
