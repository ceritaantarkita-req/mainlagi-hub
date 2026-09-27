import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const has = (source, literal, message) => assert(source.includes(literal), message);
const lacks = (source, literal, message) => assert(!source.includes(literal), message);

const canonicalShare = read("src/components/CanonicalShare.tsx");
const canonicalShareCss = read("src/components/CanonicalShare.module.css");
const resolver = read("src/lib/share/canonicalShare.ts");
const belajar = read("src/components/learning/ActivityCompletion.tsx");
const completion = read("src/components/CanonicalCompletion.tsx");
const world = read("src/components/learning/world-v2/MoneyWorldExperience.tsx");
const gameShell = read("src/components/GameShell.tsx");
const gameplayShare = read("src/components/ShareButton.tsx");

has(canonicalShare, 'data-canonical-share="v1"', "canonical Share exposes stable QA marker");
has(canonicalShare, "data-share-context={payload.context}", "canonical Share exposes context");
has(canonicalShare, "data-share-public-path={payload.publicPath}", "canonical Share exposes only its resolved public path");
has(canonicalShare, "data-share-gate={gate}", "canonical Share exposes parent-gate state");
has(canonicalShare, 'fetch("/api/parent/share-gate"', "canonical Share owns the server parent gate");
has(canonicalShare, "navigator.clipboard.writeText(shareUrl)", "canonical Share owns Copy link");
has(canonicalShare, "navigator.share", "canonical Share owns Share device");
has(canonicalShare, 'data-share-provider="copy"', "canonical Share owns Copy link action");
has(canonicalShare, 'data-share-provider="device"', "canonical Share owns Share device action");
for (const provider of ["whatsapp", "telegram", "x", "facebook", "threads"]) {
  has(canonicalShare, `data-share-provider="${provider}"`, `canonical Share exposes ${provider} provider`);
}
has(canonicalShare, 'href="/parent"', "denied parent gate routes to Area Orang Tua");
has(canonicalShare, "requestAnimationFrame(() => headingRef.current?.focus())", "canonical Share focuses the modal heading");
lacks(canonicalShare, "window.location.href", "canonical Share must never share the current child/game route");

has(resolver, 'export type CanonicalShareContext = "belajar" | "world" | "bermain"', "resolver covers the three Shared Interaction domains");
has(resolver, 'context: "belajar"', "resolver has a Belajar contract");
has(resolver, 'context: "world"', "resolver has a World adapter contract");
has(resolver, 'context: "bermain"', "resolver has a Bermain adapter contract");
has(resolver, 'publicPath: "/"', "Belajar resolves to public site origin path");
has(resolver, '/worlds/${safeSegment(input.worldId)}', "World resolves to a public World landing");
has(resolver, '/play/${safeSegment(input.gameSlug)}', "Bermain resolves to a public game route");
has(resolver, "encodeURIComponent(value.trim())", "dynamic public path segments are encoded");
has(resolver, 'parsed.protocol !== "http:" && parsed.protocol !== "https:"', "absolute resolver only accepts http(s) origins");
has(resolver, "https://wa.me/?text=", "provider resolver centralizes WhatsApp");
has(resolver, "https://t.me/share/url?url=", "provider resolver centralizes Telegram");
has(resolver, "https://twitter.com/intent/tweet?text=", "provider resolver centralizes X");
has(resolver, "https://www.facebook.com/sharer/sharer.php?u=", "provider resolver centralizes Facebook");
has(resolver, "https://www.threads.net/intent/post?text=", "provider resolver centralizes Threads");
for (const forbidden of ["childId", "accountId", "mastery", "progressId"]) {
  lacks(resolver, forbidden, `canonical Share resolver must not accept private child field ${forbidden}`);
}

has(canonicalShareCss, "max-height: calc(var(--ml-viewport-height, 100dvh) - 28px)", "Share modal is bounded by SI-01 visual viewport");
has(canonicalShareCss, "@media(orientation:landscape) and (max-height:560px)", "Share modal has short-landscape layout");
has(canonicalShareCss, "grid-template-columns: repeat(4, minmax(0, 1fr))", "short landscape uses compact provider grid");
has(canonicalShareCss, "@media(prefers-reduced-motion:reduce)", "Share backdrop respects reduced motion");

has(belajar, 'import { CanonicalShareDialog } from "@/components/CanonicalShare"', "Belajar proof adapter uses canonical Share");
has(belajar, "const [shareOpen, setShareOpen] = useState(false)", "Belajar adapter owns only modal open state");
has(belajar, "onShare={() => setShareOpen(true)}", "canonical Completion opens canonical Share");
has(belajar, "<CanonicalShareDialog", "Belajar renders canonical Share as a sibling of canonical Completion");
has(belajar, 'input={{ context: "belajar" }}', "Belajar cannot pass child identifiers into Share resolver");
for (const legacy of [
  "/api/parent/share-gate",
  "navigator.clipboard",
  "navigator.share",
  "wa.me",
  "t.me/share",
  "twitter.com",
  "facebook.com",
  "threads.net"
]) {
  lacks(belajar, legacy, `ActivityCompletion no longer owns Share implementation: ${legacy}`);
}

has(completion, 'data-completion-action="share"', "canonical Completion retains the approved Share trigger position");
lacks(completion, "/api/parent/share-gate", "Completion visual shell stays independent from Share gate");

lacks(world, 'from "@/components/CanonicalShare"', "SI-04 must not migrate World before SI-10");
lacks(gameShell, 'from "./CanonicalShare"', "SI-04 must not silently replace gameplay-header Share");
has(gameShell, 'import { ShareButton } from "./ShareButton"', "gameplay-header Share remains an explicit unresolved migration decision");
has(gameplayShare, "window.location.href", "existing gameplay-header Share remains identifiable until its later retirement/retention decision");

console.log("SI-04 canonical Share static contract PASS.");
