import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const outDir = path.resolve("visual-qa");
await fs.mkdir(outDir, { recursive: true });

const routes = [
  ["child-select", "/child/select"],
  ["child-home", "/child/demo-gian/home"],
  ["child-learn", "/child/demo-gian/learn"],
  ["child-math", "/child/demo-gian/subject/math"],
  ["child-math-stage", "/child/demo-gian/stage/math-angka"],
  ["child-touch-activity", "/child/demo-gian/activity/math-count-3"],
  ["child-games", "/child/demo-gian/games"],
  ["child-rewards", "/child/demo-gian/rewards"],
  ["parent-overview", "/parent"],
  ["parent-progress", "/parent/children/demo-gian/progress"],
  ["parent-privacy", "/parent/privacy"]
];

const viewports = [
  ["mobile", { width: 390, height: 844 }],
  ["desktop", { width: 1280, height: 900 }]
];

const browser = await chromium.launch({ headless: true });
const failures = [];

try {
  for (const [viewportName, viewport] of viewports) {
    const context = await browser.newContext({ viewport });
    for (const [name, route] of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
      });

      const response = await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle", timeout: 30000 });
      if (!response || !response.ok()) {
        failures.push(`${viewportName} ${route}: HTTP ${response?.status() ?? "no response"}`);
      }

      const bodyText = (await page.locator("body").innerText()).trim();
      if (!bodyText) failures.push(`${viewportName} ${route}: empty body`);

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      }));
      if (overflow.scrollWidth > overflow.clientWidth + 2) {
        failures.push(`${viewportName} ${route}: root horizontal overflow ${overflow.scrollWidth} > ${overflow.clientWidth}`);
      }

      if (errors.length) failures.push(`${viewportName} ${route}: ${errors.join(" | ")}`);

      await page.screenshot({
        path: path.join(outDir, `${viewportName}-${name}.png`),
        fullPage: true
      });
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
}

await fs.writeFile(
  path.join(outDir, "summary.json"),
  JSON.stringify({ baseURL, routes: routes.length, viewports: viewports.length, failures }, null, 2)
);

if (failures.length) {
  console.error("Visual QA failures:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Visual QA passed: ${routes.length} routes × ${viewports.length} viewports.`);
