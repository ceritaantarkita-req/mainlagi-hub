import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const COLORS = {
  navy: "#193b55",
  green: "#287158",
  sage: "#dbe6c8",
  sky: "#d5eef6",
  coral: "#e46c49",
  yellow: "#ffdb7d",
  softCoral: "#ffc6ac",
  white: "#fffef8",
  brown: "#68482f",
  blue: "#72b7d3",
  teal: "#5ca79a"
};

const CANDIDATES = [
  ["body.head", "body-head-v1-candidate.webp", bodyHeadSvg],
  ["action.jump", "action-jump-v1-candidate.webp", actionJumpSvg],
  ["feature.gills", "feature-gills-v1-candidate.webp", featureGillsSvg],
  ["feature.beak", "feature-beak-v1-candidate.webp", featureBeakSvg],
  ["feature.cactus-thick-stem", "feature-cactus-thick-stem-v1-candidate.webp", cactusStemSvg],
  ["object.towel", "object-towel-v1-candidate.webp", towelSvg],
  ["object.raincoat", "object-raincoat-v1-candidate.webp", raincoatSvg],
  ["object.toy-block", "object-toy-block-v1-candidate.webp", toyBlockSvg],
  ["object.ball", "object-ball-v1-candidate.webp", ballSvg]
];

function svg(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <g stroke="${COLORS.navy}" stroke-linecap="round" stroke-linejoin="round">${body}</g>
</svg>`;
}

function bodyHeadSvg() {
  return svg(`
    <circle cx="256" cy="226" r="132" fill="${COLORS.softCoral}" stroke-width="15"/>
    <circle cx="127" cy="240" r="30" fill="${COLORS.softCoral}" stroke-width="13"/>
    <circle cx="385" cy="240" r="30" fill="${COLORS.softCoral}" stroke-width="13"/>
    <path d="M126 188 Q150 74 256 70 Q362 74 386 188 Q330 150 256 153 Q182 150 126 188Z" fill="${COLORS.brown}" stroke-width="15"/>
    <circle cx="207" cy="231" r="10" fill="${COLORS.navy}" stroke="none"/>
    <circle cx="305" cy="231" r="10" fill="${COLORS.navy}" stroke="none"/>
    <path d="M256 251 L249 282 L267 285" fill="none" stroke-width="8"/>
    <path d="M218 295 Q256 330 294 295" fill="none" stroke-width="8"/>
    <rect x="221" y="346" width="70" height="78" rx="20" fill="${COLORS.softCoral}" stroke-width="13"/>
    <path d="M118 494 Q136 390 256 390 Q376 390 394 494Z" fill="${COLORS.sky}" stroke-width="15"/>
  `);
}

function actionJumpSvg() {
  return svg(`
    <circle cx="256" cy="90" r="38" fill="${COLORS.softCoral}" stroke-width="13"/>
    <rect x="205" y="128" width="102" height="142" rx="34" fill="${COLORS.green}" stroke-width="15"/>
    <path d="M216 158 L160 112 L126 148" fill="none" stroke-width="18"/>
    <path d="M296 158 L352 112 L386 148" fill="none" stroke-width="18"/>
    <circle cx="119" cy="154" r="17" fill="${COLORS.softCoral}" stroke-width="9"/>
    <circle cx="393" cy="154" r="17" fill="${COLORS.softCoral}" stroke-width="9"/>
    <path d="M230 266 L183 327 L137 300" fill="none" stroke-width="20"/>
    <path d="M282 266 L329 327 L375 300" fill="none" stroke-width="20"/>
    <rect x="105" y="286" width="64" height="34" rx="16" fill="${COLORS.yellow}" stroke-width="9"/>
    <rect x="343" y="286" width="64" height="34" rx="16" fill="${COLORS.yellow}" stroke-width="9"/>
    <path d="M256 450 V352 M218 397 L256 345 L294 397" fill="none" stroke="${COLORS.coral}" stroke-width="18"/>
    <path d="M151 446 Q256 473 361 446" fill="none" stroke="${COLORS.sage}" stroke-width="16"/>
  `);
}

function featureGillsSvg() {
  return svg(`
    <path d="M76 256 Q109 121 274 121 Q371 121 450 207 L474 256 L450 305 Q371 391 274 391 Q109 391 76 256Z" fill="${COLORS.blue}" stroke-width="15"/>
    <circle cx="378" cy="213" r="17" fill="${COLORS.white}" stroke-width="9"/>
    <circle cx="382" cy="213" r="5" fill="${COLORS.navy}" stroke="none"/>
    <path d="M440 258 L478 246" fill="none" stroke-width="10"/>
    <path d="M308 164 Q265 256 308 348" fill="none" stroke-width="14"/>
    <path d="M278 188 Q236 256 278 324" fill="none" stroke="${COLORS.coral}" stroke-width="13"/>
    <path d="M305 188 Q263 256 305 324" fill="none" stroke="${COLORS.coral}" stroke-width="13"/>
    <path d="M332 188 Q290 256 332 324" fill="none" stroke="${COLORS.coral}" stroke-width="13"/>
    <rect x="220" y="157" width="145" height="198" rx="55" fill="none" stroke="${COLORS.coral}" stroke-width="7"/>
  `);
}

function featureBeakSvg() {
  return svg(`
    <circle cx="211" cy="256" r="137" fill="${COLORS.sky}" stroke-width="15"/>
    <path d="M82 208 Q107 91 215 95 Q318 98 340 202 Q270 171 211 175 Q149 171 82 208Z" fill="${COLORS.blue}" stroke-width="15"/>
    <circle cx="278" cy="216" r="19" fill="${COLORS.white}" stroke-width="9"/>
    <circle cx="282" cy="216" r="6" fill="${COLORS.navy}" stroke="none"/>
    <path d="M326 244 L481 279 L326 300Z" fill="${COLORS.yellow}" stroke-width="14"/>
    <path d="M328 279 H470" fill="none" stroke-width="9"/>
  `);
}

function cactusStemSvg() {
  return svg(`
    <rect x="180" y="56" width="152" height="398" rx="68" fill="${COLORS.green}" stroke-width="15"/>
    <rect x="112" y="190" width="92" height="118" rx="40" fill="${COLORS.green}" stroke-width="14"/>
    <rect x="308" y="164" width="92" height="132" rx="40" fill="${COLORS.green}" stroke-width="14"/>
    <path d="M222 139 H290 V350 Q290 378 256 390 Q222 378 222 350Z" fill="${COLORS.sky}" stroke="${COLORS.teal}" stroke-width="10"/>
    <path d="M256 190 Q219 240 256 294 Q293 240 256 190Z" fill="#8fd1e5" stroke="none"/>
    <path d="M161 319 H104 M128 295 L103 319 L128 343" fill="none" stroke="${COLORS.coral}" stroke-width="11"/>
    <path d="M351 319 H408 M384 295 L409 319 L384 343" fill="none" stroke="${COLORS.coral}" stroke-width="11"/>
    <circle cx="214" cy="115" r="5" fill="${COLORS.yellow}" stroke="none"/>
    <circle cx="302" cy="132" r="5" fill="${COLORS.yellow}" stroke="none"/>
  `);
}

function towelSvg() {
  return svg(`
    <path d="M112 120 H400" fill="none" stroke-width="18"/>
    <circle cx="112" cy="120" r="16" fill="${COLORS.sage}" stroke-width="9"/>
    <circle cx="400" cy="120" r="16" fill="${COLORS.sage}" stroke-width="9"/>
    <path d="M162 132 H350 V390 Q350 422 318 422 H194 Q162 422 162 390Z" fill="${COLORS.sky}" stroke-width="15"/>
    <path d="M190 132 V368 Q190 385 207 385 H305 Q322 385 322 368 V132" fill="${COLORS.white}" stroke-width="11"/>
    <path d="M211 198 Q256 211 301 198 M211 232 Q256 245 301 232" fill="none" stroke="#9abfd0" stroke-width="5"/>
    <rect x="195" y="286" width="122" height="28" rx="10" fill="${COLORS.coral}" stroke="none"/>
    <rect x="195" y="326" width="122" height="24" rx="10" fill="${COLORS.sage}" stroke="none"/>
    <path d="M190 385 V438 M214 385 V438 M238 385 V438 M262 385 V438 M286 385 V438 M310 385 V438 M334 385 V438" fill="none" stroke-width="7"/>
    <path d="M104 304 Q88 330 104 346 Q120 330 104 304Z M408 316 Q392 342 408 358 Q424 342 408 316Z" fill="${COLORS.blue}" stroke-width="5"/>
  `);
}

function raincoatSvg() {
  return svg(`
    <path d="M170 158 Q177 71 256 71 Q335 71 342 158Z" fill="${COLORS.yellow}" stroke-width="15"/>
    <path d="M176 145 L336 145 L404 414 H108Z" fill="${COLORS.yellow}" stroke-width="15"/>
    <path d="M151 179 L73 276 L114 323 L191 249Z" fill="${COLORS.yellow}" stroke-width="14"/>
    <path d="M361 179 L439 276 L398 323 L321 249Z" fill="${COLORS.yellow}" stroke-width="14"/>
    <path d="M256 159 V410" fill="none" stroke-width="11"/>
    <rect x="152" y="287" width="73" height="66" rx="15" fill="${COLORS.white}" stroke-width="9"/>
    <rect x="287" y="287" width="73" height="66" rx="15" fill="${COLORS.white}" stroke-width="9"/>
    <path d="M63 112 Q48 136 63 151 Q78 136 63 112Z M433 114 Q418 138 433 153 Q448 138 433 114Z M59 362 Q44 386 59 401 Q74 386 59 362Z M454 351 Q439 375 454 390 Q469 375 454 351Z" fill="${COLORS.blue}" stroke-width="5"/>
  `);
}

function toyBlockSvg() {
  return svg(`
    <path d="M256 75 L405 159 L256 239 L107 159Z" fill="${COLORS.yellow}" stroke-width="15"/>
    <path d="M107 159 L256 239 V414 L107 330Z" fill="${COLORS.softCoral}" stroke-width="15"/>
    <path d="M256 239 L405 159 V330 L256 414Z" fill="${COLORS.sky}" stroke-width="15"/>
    <path d="M329 264 L345 296 L380 301 L355 326 L361 361 L329 344 L297 361 L303 326 L278 301 L313 296Z" fill="${COLORS.white}" stroke-width="6"/>
  `);
}

function ballSvg() {
  return svg(`
    <circle cx="256" cy="256" r="170" fill="${COLORS.white}" stroke-width="16"/>
    <path d="M256 189 L302 222 L284 276 H228 L210 222Z" fill="${COLORS.navy}" stroke-width="4"/>
    <path d="M256 92 L283 111 L273 143 H239 L229 111Z M399 196 L426 215 L416 247 H382 L372 215Z M345 359 L372 378 L362 410 H328 L318 378Z M167 359 L194 378 L184 410 H150 L140 378Z M113 196 L140 215 L130 247 H96 L86 215Z" fill="${COLORS.navy}" stroke-width="4"/>
    <path d="M256 189 L256 143 M302 222 L382 215 M284 276 L345 359 M228 276 L167 359 M210 222 L130 215" fill="none" stroke-width="11"/>
    <path d="M115 350 A170 170 0 0 0 397 350" fill="none" stroke="${COLORS.blue}" stroke-width="8"/>
    <path d="M115 162 A170 170 0 0 1 397 162" fill="none" stroke="${COLORS.coral}" stroke-width="8"/>
  `);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const generate = args.includes("--generate");
  const force = args.includes("--force");
  const outputIndex = args.indexOf("--output");
  const output = outputIndex >= 0 ? args[outputIndex + 1] : "internal/learning-illustration-candidates/p0-v1";
  if (outputIndex >= 0 && !output) throw new Error("--output requires a path");
  return { generate, force, output };
}

function assertSafeOutput(output) {
  const resolved = path.resolve(output);
  const publicRoot = path.resolve("public");
  if (resolved === publicRoot || resolved.startsWith(publicRoot + path.sep)) {
    throw new Error("candidate generator refuses to write under public/");
  }
  return resolved;
}

async function renderCandidate(outputDir, semanticKey, filename, factory) {
  const target = path.join(outputDir, filename);
  const buffer = await sharp(Buffer.from(factory()))
    .resize(512, 512, { fit: "contain" })
    .webp({ lossless: true, quality: 100 })
    .toBuffer();
  writeFileSync(target, buffer);
  const metadata = await sharp(buffer).metadata();
  return {
    semanticKey,
    filename,
    width: metadata.width,
    height: metadata.height,
    hasAlpha: metadata.hasAlpha,
    bytes: buffer.length,
    sha256: createHash("sha256").update(buffer).digest("hex"),
    production: false,
    runtimeActive: false,
    humanReviewRequired: true
  };
}

async function main() {
  const { generate, force, output } = parseArgs();
  const outputDir = assertSafeOutput(output);

  if (!generate) {
    console.log("Learning semantic P0 candidate generator: DRY RUN");
    console.log(`Would generate ${CANDIDATES.length} review-only candidates into ${outputDir}`);
    for (const [key, filename] of CANDIDATES) console.log(`- ${key} -> ${filename}`);
    console.log("No files written. Use --generate to render local candidates.");
    return;
  }

  if (existsSync(outputDir)) {
    if (!force) throw new Error(`output already exists: ${outputDir}; use --force to replace`);
    rmSync(outputDir, { recursive: true, force: true });
  }
  mkdirSync(outputDir, { recursive: true });

  const items = [];
  for (const candidate of CANDIDATES) items.push(await renderCandidate(outputDir, ...candidate));

  const manifest = {
    version: 1,
    scope: "learning-semantic-p0-candidates",
    lifecycle: "review-only",
    generatedAt: new Date().toISOString(),
    outputDirectory: path.relative(process.cwd(), outputDir).split(path.sep).join("/"),
    production: false,
    runtimeActive: false,
    humanReviewRequired: true,
    items
  };
  writeFileSync(path.join(outputDir, "candidate-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Generated ${items.length} review-only semantic candidates at ${outputDir}`);
  console.log("No registry lifecycle, public production path, or runtime mapping was changed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
