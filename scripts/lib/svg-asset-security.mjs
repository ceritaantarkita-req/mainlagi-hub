import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const NAME_RE = /^[A-Za-z_][A-Za-z0-9_.:-]*/;
const BLOCKED_ELEMENTS = new Set([
  "script",
  "foreignobject",
  "iframe",
  "object",
  "embed",
  "audio",
  "video",
  "canvas",
  "animate",
  "animatemotion",
  "animatetransform",
  "set",
  "a"
]);
const URL_ATTRS = new Set(["href", "xlink:href", "src"]);

export class SvgAssetValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "SvgAssetValidationError";
  }
}

function fail(message) {
  throw new SvgAssetValidationError(message);
}

function toBuffer(input) {
  if (Buffer.isBuffer(input)) return input;
  if (typeof input === "string") return Buffer.from(input, "utf8");
  if (input instanceof Uint8Array) return Buffer.from(input);
  fail("SVG input must be a string, Buffer, or Uint8Array");
}

function decodeUtf8(buffer) {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    fail("SVG is not valid UTF-8 text");
  }
}

function stripSimpleDoctype(text) {
  let output = text;
  let count = 0;
  while (true) {
    const match = /<!DOCTYPE\b/i.exec(output);
    if (!match) break;
    count += 1;
    if (count > 1) fail("SVG contains multiple DOCTYPE declarations");
    const start = match.index;
    let quote = null;
    let end = -1;
    for (let i = start; i < output.length; i += 1) {
      const ch = output[i];
      if (quote) {
        if (ch === quote) quote = null;
        continue;
      }
      if (ch === '"' || ch === "'") {
        quote = ch;
        continue;
      }
      if (ch === "[") fail("SVG DOCTYPE internal subsets are forbidden");
      if (ch === ">") {
        end = i;
        break;
      }
    }
    if (end < 0) fail("SVG contains an unterminated DOCTYPE declaration");
    output = `${output.slice(0, start)}${output.slice(end + 1)}`;
  }
  return { text: output, removedDoctype: count === 1 };
}

function findTagEnd(text, start) {
  let quote = null;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === ">") return i;
  }
  return -1;
}

function parseAttributes(raw, tagName) {
  const attrs = new Map();
  let i = 0;
  while (i < raw.length) {
    while (/\s/.test(raw[i] ?? "")) i += 1;
    if (i >= raw.length) break;

    const nameMatch = raw.slice(i).match(NAME_RE);
    if (!nameMatch) fail(`<${tagName}> contains malformed attribute syntax`);
    const name = nameMatch[0];
    const lowerName = name.toLowerCase();
    i += name.length;
    while (/\s/.test(raw[i] ?? "")) i += 1;
    if (raw[i] !== "=") fail(`<${tagName}> attribute ${name} must use quoted XML syntax`);
    i += 1;
    while (/\s/.test(raw[i] ?? "")) i += 1;
    const quote = raw[i];
    if (quote !== '"' && quote !== "'") fail(`<${tagName}> attribute ${name} must be quoted`);
    i += 1;
    const end = raw.indexOf(quote, i);
    if (end < 0) fail(`<${tagName}> attribute ${name} has an unterminated value`);
    const value = raw.slice(i, end);
    i = end + 1;
    if (attrs.has(lowerName)) fail(`<${tagName}> repeats attribute ${name}`);
    attrs.set(lowerName, { name, value });
  }
  return attrs;
}

function assertSafeUrlToken(value, context) {
  const trimmed = value.trim().replace(/^['"]|['"]$/g, "").trim();
  if (!trimmed.startsWith("#") || trimmed.length < 2) {
    fail(`${context} must use a local fragment reference`);
  }
  if (/\s/.test(trimmed)) fail(`${context} contains invalid whitespace`);
}

function inspectCss(css, context) {
  const lowered = css.toLowerCase();
  if (lowered.includes("@import")) fail(`${context} contains @import`);
  if (lowered.includes("expression(")) fail(`${context} contains CSS expression()`);
  if (lowered.includes("javascript:")) fail(`${context} contains javascript: URL`);
  if (lowered.includes("-moz-binding")) fail(`${context} contains unsafe binding`);
  if (lowered.includes("behavior:")) fail(`${context} contains unsafe behavior`);

  const urlRe = /url\(\s*([^)]*?)\s*\)/gi;
  let match;
  while ((match = urlRe.exec(css))) assertSafeUrlToken(match[1], `${context} url()`);
}

function inspectAttributes(attrs, tagName) {
  for (const [lowerName, { name, value }] of attrs) {
    if (/^on[a-z]/i.test(lowerName)) fail(`<${tagName}> contains inline event handler ${name}`);
    if (/javascript\s*:/i.test(value)) fail(`<${tagName}> attribute ${name} contains javascript: URL`);

    if (URL_ATTRS.has(lowerName)) assertSafeUrlToken(value, `<${tagName}> ${name}`);
    if (lowerName === "style") inspectCss(value, `<${tagName}> style`);
    if (["fill", "stroke", "filter", "clip-path", "mask", "marker-start", "marker-mid", "marker-end", "cursor"].includes(lowerName)) {
      inspectCss(value, `<${tagName}> ${name}`);
    }
  }
}

function parseViewBox(value) {
  const parts = value.trim().split(/[\s,]+/).filter(Boolean);
  if (parts.length !== 4) fail("SVG viewBox must contain exactly four numbers");
  const values = parts.map((part) => Number(part));
  if (!values.every(Number.isFinite)) fail("SVG viewBox contains a non-finite number");
  if (values[2] <= 0 || values[3] <= 0) fail("SVG viewBox width and height must be positive");
  return values;
}

export function sanitizeAndValidateSvg(input, options = {}) {
  const maxBytes = options.maxBytes ?? 1_000_000;
  if (!Number.isInteger(maxBytes) || maxBytes <= 0) fail("maxBytes must be a positive integer");

  const buffer = toBuffer(input);
  if (buffer.length === 0) fail("SVG file is empty");
  if (buffer.length > maxBytes) fail(`SVG exceeds maxBytes (${buffer.length} > ${maxBytes})`);

  let text = decodeUtf8(buffer);
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  if (text.includes("\u0000")) fail("SVG contains a NUL byte");
  const doctypeResult = stripSimpleDoctype(text);
  text = doctypeResult.text;

  const stack = [];
  let rootSeen = false;
  let rootClosed = false;
  let rootAttrs = null;
  let elementCount = 0;
  let styleElementCount = 0;
  let cursor = 0;

  while (cursor < text.length) {
    const lt = text.indexOf("<", cursor);
    const chunk = lt < 0 ? text.slice(cursor) : text.slice(cursor, lt);
    if (!rootSeen || rootClosed) {
      if (chunk.trim()) fail("SVG contains text outside the root element");
    }
    if (lt < 0) break;

    if (text.startsWith("<!--", lt)) {
      const end = text.indexOf("-->", lt + 4);
      if (end < 0) fail("SVG contains an unterminated XML comment");
      cursor = end + 3;
      continue;
    }

    if (text.startsWith("<?", lt)) {
      const end = text.indexOf("?>", lt + 2);
      if (end < 0) fail("SVG contains an unterminated processing instruction");
      const body = text.slice(lt + 2, end).trim();
      if (!/^xml(?:\s|$)/i.test(body) || rootSeen) fail("SVG contains an unsupported processing instruction");
      cursor = end + 2;
      continue;
    }

    if (text.startsWith("<!", lt)) {
      fail("SVG contains forbidden declaration/ENTITY/CDATA content");
    }

    const gt = findTagEnd(text, lt + 1);
    if (gt < 0) fail("SVG contains an unterminated element tag");
    let inside = text.slice(lt + 1, gt).trim();
    if (!inside) fail("SVG contains an empty element tag");

    if (inside.startsWith("/")) {
      inside = inside.slice(1).trim();
      const closeMatch = inside.match(/^([A-Za-z_][A-Za-z0-9_.:-]*)\s*$/);
      if (!closeMatch) fail("SVG contains malformed closing-tag syntax");
      const name = closeMatch[1];
      const expected = stack.pop();
      if (!expected || expected !== name) fail(`SVG closing tag </${name}> does not match <${expected ?? "none"}>`);
      if (stack.length === 0) rootClosed = true;
      cursor = gt + 1;
      continue;
    }

    const selfClosing = /\/\s*$/.test(inside);
    if (selfClosing) inside = inside.replace(/\/\s*$/, "").trim();
    const nameMatch = inside.match(NAME_RE);
    if (!nameMatch) fail("SVG contains malformed element syntax");
    const name = nameMatch[0];
    const lowerName = name.toLowerCase();
    const attrsRaw = inside.slice(name.length);
    const attrs = parseAttributes(attrsRaw, name);

    if (rootClosed) fail("SVG contains more than one root element");
    if (!rootSeen) {
      if (lowerName !== "svg") fail("SVG root element must be <svg>");
      rootSeen = true;
      rootAttrs = attrs;
    }

    if (BLOCKED_ELEMENTS.has(lowerName)) fail(`<${name}> is forbidden active/unsafe SVG content`);
    inspectAttributes(attrs, name);
    elementCount += 1;

    if (lowerName === "style") {
      styleElementCount += 1;
      const closeNeedle = `</${name}>`;
      const closeAt = text.indexOf(closeNeedle, gt + 1);
      if (closeAt < 0) fail(`<${name}> is missing its closing tag`);
      const css = text.slice(gt + 1, closeAt);
      inspectCss(css, `<${name}>`);
      cursor = closeAt + closeNeedle.length;
      if (!rootSeen || stack.length === 0) fail(`<${name}> must be nested inside <svg>`);
      continue;
    }

    if (!selfClosing) stack.push(name);
    else if (stack.length === 0 && lowerName === "svg") rootClosed = true;

    cursor = gt + 1;
  }

  if (!rootSeen) fail("SVG root element is missing");
  if (stack.length) fail(`SVG has unclosed element <${stack[stack.length - 1]}>`);
  if (!rootClosed) fail("SVG root element is not closed");

  const viewBoxAttr = rootAttrs?.get("viewbox");
  if (!viewBoxAttr) fail("SVG root requires viewBox");
  const viewBox = parseViewBox(viewBoxAttr.value);

  return {
    sanitizedText: text,
    metadata: {
      byteLength: buffer.length,
      viewBox,
      elementCount,
      styleElementCount,
      removedDoctype: doctypeResult.removedDoctype
    }
  };
}

export function validateSvgProductionPathRecords(records, options = {}) {
  const productionDirectory = options.productionDirectory;
  if (typeof productionDirectory !== "string" || !productionDirectory.startsWith("/artwork/")) {
    fail("productionDirectory must be an /artwork/... public path");
  }

  const seen = new Map();
  for (const record of records) {
    const id = record?.id ?? "unknown";
    const productionPath = record?.productionPath;
    if (typeof productionPath !== "string" || !productionPath.endsWith(".svg")) {
      fail(`${id}: productionPath must be an .svg path`);
    }

    const normalized = path.posix.normalize(productionPath);
    if (normalized !== productionPath || normalized.includes("..") || productionPath.includes("\\")) {
      fail(`${id}: unsafe productionPath`);
    }
    if (!productionPath.startsWith(`${productionDirectory}/`)) {
      fail(`${id}: productionPath must stay under ${productionDirectory}`);
    }
    if (seen.has(productionPath)) fail(`${id}: productionPath already assigned to ${seen.get(productionPath)}`);
    seen.set(productionPath, id);
  }

  return seen;
}

function walkSvgFiles(directory) {
  if (!existsSync(directory)) return [];
  const results = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) fail(`${absolute}: symbolic links are forbidden in SVG production directories`);
    if (entry.isDirectory()) {
      results.push(...walkSvgFiles(absolute));
      continue;
    }
    if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".svg") results.push(absolute);
  }

  return results;
}

export function validateSvgProductionDirectory({
  root,
  productionDirectory,
  approvedPaths,
  maxBytes = 1_000_000
}) {
  if (typeof root !== "string" || !root) fail("root is required");

  const approved = new Set(approvedPaths ?? []);
  const relativeDir = productionDirectory.replace(/^\/+/, "");
  const absoluteDir = path.join(root, "public", relativeDir);
  const found = walkSvgFiles(absoluteDir);
  const foundPublic = [];

  for (const absolute of found) {
    const publicPath = `/${path.relative(path.join(root, "public"), absolute).split(path.sep).join("/")}`;
    foundPublic.push(publicPath);
    if (!approved.has(publicPath)) fail(`${publicPath}: unexpected/stray SVG file in production directory`);

    const buffer = readFileSync(absolute);
    if (statSync(absolute).size > maxBytes) fail(`${publicPath}: SVG exceeds maxBytes`);
    sanitizeAndValidateSvg(buffer, { maxBytes });
  }

  for (const approvedPath of approved) {
    if (!foundPublic.includes(approvedPath)) fail(`${approvedPath}: approved SVG file is missing from production directory`);
  }

  return foundPublic.sort();
}
