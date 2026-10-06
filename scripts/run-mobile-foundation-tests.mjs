import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const read = (file) => readFileSync(path.join(root, file), "utf8");

try {
  const css = read("src/components/learning/mobile/MobileFoundation.module.css");
  const primitives = read("src/components/learning/mobile/MobilePrimitives.tsx");
  const orientationFoundation = read("src/components/learning/mobile/ViewportOrientationFoundation.tsx");
  const childLayout = read("src/app/child/[childId]/layout.tsx");
  const childSelect = read("src/app/child/select/page.tsx");
  const parentLayout = read("src/app/parent/layout.tsx");
  const gamesLayout = read("src/app/games/layout.tsx");
  const playLayout = read("src/app/play/layout.tsx");
  const routeMatrix = read("docs/MOBILE_ROUTE_MATRIX.md");

  assert.match(css, /--ml-page-gutter:/, "mobile foundation needs one canonical page gutter token");
  assert.match(css, /--ml-touch-min:\s*44px/, "child controls need a 44px minimum touch token");
  assert.match(css, /safe-area-inset-top/, "top safe-area token is required");
  assert.match(css, /safe-area-inset-right/, "right safe-area token is required");
  assert.match(css, /safe-area-inset-bottom/, "bottom safe-area token is required");
  assert.match(css, /safe-area-inset-left/, "left safe-area token is required");
  assert.match(css, /--ml-viewport-height:\s*100dvh/, "mobile foundation needs a dynamic viewport-height fallback");
  assert.match(css, /data-mainlagi-orientation="landscape"/, "short landscape devices need an explicit orientation composition contract");
  assert.match(css, /@media \(orientation:\s*landscape\) and \(max-height:\s*600px\)/, "phone landscape must use a bounded short-viewport rule");
  assert.match(css, /repeat\(auto-fit,\s*minmax\(min\(100%,\s*240px\),\s*1fr\)\)/, "standard grid must collapse safely rather than force two columns");
  assert.match(css, /@media \(max-width:\s*359px\)/, "320px-class phones need an explicit narrow rule");
  assert.match(css, /@media \(min-width:\s*520px\)/, "larger-phone/tablet transition is required");
  assert.match(css, /@media \(min-width:\s*760px\)/, "tablet transition is required");
  assert.doesNotMatch(css, /overflow-x:\s*(hidden|clip)/, "mobile foundation must not hide horizontal-overflow bugs");
  assert.match(css, /\.routeBoundary\s*\{[\s\S]*max-width:\s*100%/, "route boundary must be width-safe");
  assert.match(css, /data-mainlagi-route-boundary="parent"[\s\S]*:has\(> aside\)/, "parent mobile route must collapse the desktop sidebar layout");
  assert.match(css, /data-mainlagi-route-boundary="parent"\]\s+aside\[data-mainlagi-parent-sidebar\]\s*\{[\s\S]*?display:\s*none\s*!important/, "parent mobile foundation must hide only the dedicated desktop parent sidebar below the tablet breakpoint");
  assert.doesNotMatch(css, /data-mainlagi-route-boundary="parent"\]\s+aside\s*\{[\s\S]*?display:\s*none\s*!important/, "parent mobile foundation must never hide every aside because the global menu drawer is also an aside");
  assert.match(css, /routeBoundary[\s\S]*min-height:\s*var\(--ml-touch-min\)/, "mobile route controls must inherit the minimum touch height");

  assert.match(primitives, /ViewportOrientationFoundation/, "MobileFoundation must own the shared orientation signal");
  assert.match(orientationFoundation, /window\.visualViewport/, "orientation foundation must prefer the visual viewport when available");
  assert.match(orientationFoundation, /window\.addEventListener\("resize"/, "orientation foundation must react to viewport resize");
  assert.match(orientationFoundation, /window\.addEventListener\("orientationchange"/, "orientation foundation must react to device rotation");
  assert.match(orientationFoundation, /requestAnimationFrame/, "orientation updates must be frame-coalesced");
  assert.match(orientationFoundation, /data-mainlagi-orientation="pending"/, "orientation boundary needs hydration-stable initial markup");
  assert.match(orientationFoundation, /dataset\.mainlagiOrientation\s*=\s*orientation/, "orientation must be exposed as a DOM composition signal");
  assert.match(orientationFoundation, /--ml-viewport-width/, "orientation foundation must expose measured viewport width");
  assert.match(orientationFoundation, /--ml-viewport-height/, "orientation foundation must expose measured viewport height");
  assert.doesNotMatch(orientationFoundation, /\buseState\b/, "orientation must not become React application state");
  assert.doesNotMatch(orientationFoundation, /key\s*=\s*\{[^}]*orientation/i, "orientation foundation must never key/remount its subtree by orientation");

  for (const exported of [
    "MobileFoundation",
    "MobileRouteBoundary",
    "MobilePage",
    "MobileGrid",
    "MobileActionRow",
    "MobileScrollRow",
    "MobileTouchButton",
    "MobileTouchLink",
    "MobileStickyHeader",
    "MobileBottomDock",
    "MobileActivityViewport",
    "MobileDialogSurface"
  ]) {
    assert.match(primitives, new RegExp(`export function ${exported}\\b`), `${exported} primitive is required`);
  }

  assert.match(childLayout, /<MobileFoundation data-mainlagi-mobile-root="child">/, "authenticated/guest child routes must inherit the mobile foundation");
  assert.match(childLayout, /<MobileRouteBoundary routeKind="child-learning">/, "all child learning routes need the canonical route boundary");
  assert.match(childSelect, /<MobileFoundation data-mainlagi-mobile-root="child-select">/, "child profile selection must inherit the mobile foundation");
  assert.match(childSelect, /<MobileRouteBoundary routeKind="child-select">/, "child profile selection needs the canonical route boundary");
  assert.match(parentLayout, /<MobileFoundation data-mainlagi-mobile-root="parent">/, "parent routes must inherit the mobile foundation");
  assert.match(parentLayout, /<MobileRouteBoundary routeKind="parent">/, "parent routes need the canonical route boundary");
  assert.match(gamesLayout, /data-mainlagi-mobile-root="games"/, "global game catalog routes must inherit the mobile foundation");
  assert.match(gamesLayout, /routeKind="game-catalog"/, "global game catalog routes need the canonical route boundary");
  assert.match(playLayout, /data-mainlagi-mobile-root="play"/, "play routes must inherit the mobile foundation");
  assert.match(playLayout, /routeKind="game-play"/, "play routes need the canonical route boundary");

  for (const width of ["320 px", "360 px", "375 px", "390 px", "430 px", "768 px", "1024+ px"]) {
    assert.ok(routeMatrix.includes(width), `mobile acceptance matrix is missing ${width}`);
  }
  assert.match(routeMatrix, /no unexplained document-level horizontal overflow/i, "route matrix must explicitly prohibit accidental horizontal overflow");
  assert.match(routeMatrix, /44×44 CSS px/i, "route matrix must preserve touch-target acceptance criteria");

  console.log("Mainlagi mobile foundation and route migration contracts passed.");
} catch (error) {
  console.error(error);
  process.exit(1);
}
