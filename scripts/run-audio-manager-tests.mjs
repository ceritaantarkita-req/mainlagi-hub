import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outDir = path.join(root, ".audio-test-dist");
rmSync(outDir, { recursive: true, force: true });

const tscBin = path.join(root, "node_modules", "typescript", "bin", "tsc");
const compile = spawnSync(process.execPath, [
  tscBin,
  "src/lib/audio/AudioManager.ts",
  "--target", "ES2022",
  "--module", "commonjs",
  "--moduleResolution", "node",
  "--lib", "ES2022,DOM",
  "--skipLibCheck",
  "--esModuleInterop",
  "--outDir", outDir
], {
  cwd: root,
  stdio: "inherit"
});
if (compile.status !== 0) process.exit(compile.status ?? 1);

const require = createRequire(import.meta.url);
const {
  AudioManager,
  DEFAULT_PROMPT_RATE,
  DEFAULT_FEEDBACK_RATE,
  SPEECH_LATENCY_EVENT
} = require(path.join(outDir, "AudioManager.js"));

class FakeUtterance {
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

class FakeSynth {
  constructor(voices = []) {
    this.voices = voices;
    this.spoken = [];
    this.current = null;
    this.speaking = false;
    this.pending = false;
    this.cancelCount = 0;
    this.listeners = new Map();
  }

  getVoices() {
    return [...this.voices];
  }

  addEventListener(type, listener) {
    this.listeners.set(type, listener);
  }

  triggerVoicesChanged() {
    this.listeners.get("voiceschanged")?.();
  }

  speak(utterance) {
    this.spoken.push(utterance);
    this.current = utterance;
    this.speaking = true;
  }

  cancel() {
    this.cancelCount += 1;
    this.current = null;
    this.speaking = false;
    this.pending = false;
  }

  startCurrent() {
    this.current?.emit("start");
  }

  endCurrent() {
    const current = this.current;
    this.current = null;
    this.speaking = false;
    current?.emit("end");
  }
}

function voice({ name, lang, localService = true, isDefault = false }) {
  return {
    default: isDefault,
    lang,
    localService,
    name,
    voiceURI: `${name}-${lang}`
  };
}

function harness(voices = []) {
  let now = 1000;
  let nextTimer = 1;
  const timers = new Map();
  const latency = [];
  const synth = new FakeSynth(voices);
  const manager = new AudioManager({
    now: () => now,
    getSpeechSynthesis: () => synth,
    createUtterance: (text) => new FakeUtterance(text),
    createAudioContext: () => null,
    emitLatency: (sample) => latency.push(sample),
    setTimer: (callback, delayMs) => {
      const id = nextTimer++;
      timers.set(id, { callback, delayMs });
      return id;
    },
    clearTimer: (id) => timers.delete(id)
  });
  return {
    manager,
    synth,
    latency,
    timers,
    setNow(value) { now = value; },
    advance(delta) { now += delta; },
    runTimers() {
      const queued = [...timers.entries()];
      timers.clear();
      for (const [, timer] of queued) timer.callback();
    }
  };
}

function walkFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    const full = path.join(directory, entry);
    if (statSync(full).isDirectory()) files.push(...walkFiles(full));
    else files.push(full);
  }
  return files;
}

try {
  assert.equal(SPEECH_LATENCY_EVENT, "mainlagi-speech-latency");
  assert.ok(DEFAULT_PROMPT_RATE > 0.9 && DEFAULT_PROMPT_RATE <= 1, "default prompt rate should be close to natural speed");
  assert.ok(DEFAULT_FEEDBACK_RATE >= 1, "feedback should not inherit an unexplained slow global rate");

  const voices = [
    voice({ name: "English local", lang: "en-US" }),
    voice({ name: "Indonesia remote", lang: "id-ID", localService: false, isDefault: true }),
    voice({ name: "Indonesia local", lang: "id-ID", localService: true })
  ];
  const selection = harness(voices);
  assert.equal(selection.manager.selectVoice("id-ID")?.name, "Indonesia local", "exact local locale should win voice selection");
  assert.equal(selection.manager.selectVoice("en-GB")?.name, "English local", "same-language fallback should be available");

  const queue = harness(voices);
  assert.equal(queue.manager.speakPrompt("Satu", { lang: "id-ID" }), "spoken");
  assert.equal(queue.synth.spoken.length, 1, "first prompt should start immediately");
  assert.equal(queue.synth.cancelCount, 0, "normal prompt start must not cancel speech synthesis");
  queue.advance(1000);
  assert.equal(queue.manager.speakPrompt("Dua", { lang: "id-ID" }), "spoken");
  assert.equal(queue.synth.spoken.length, 1, "second prompt should stay in manager queue while first is active");
  assert.equal(queue.manager.status().queueDepth, 1);
  assert.equal(queue.synth.cancelCount, 0, "queueing a prompt must not use cancel-before-speak");
  queue.synth.startCurrent();
  queue.advance(120);
  queue.synth.endCurrent();
  assert.equal(queue.synth.spoken.length, 2, "queued prompt should start after prior prompt ends");
  assert.equal(queue.synth.spoken[1].text, "Dua");

  const dedupe = harness(voices);
  dedupe.manager.speakPrompt("Pilih warna biru", { key: "blue-prompt" });
  dedupe.advance(30);
  dedupe.manager.speakPrompt("Pilih warna biru", { key: "blue-prompt" });
  assert.equal(dedupe.manager.status().queueDepth, 0, "rapid duplicate prompt must not accumulate in queue");
  assert.equal(dedupe.synth.spoken.length, 1, "rapid duplicate prompt must be dropped");
  assert.ok(dedupe.latency.some((sample) => sample.phase === "deduped"), "dedupe should be visible in local latency events");

  const feedback = harness(voices);
  feedback.manager.speakPrompt("Coba hitung dulu");
  feedback.advance(40);
  feedback.manager.speakFeedback("Benar!", { key: "correct" });
  assert.equal(feedback.synth.cancelCount, 1, "immediate feedback may intentionally interrupt stale prompt speech");
  assert.equal(feedback.synth.spoken.at(-1)?.text, "Benar!");
  assert.equal(feedback.manager.status().queueDepth, 0);

  const warm = harness(voices);
  warm.manager.unlock("id-ID");
  assert.equal(warm.timers.size, 1, "user gesture should schedule speech warmup");
  warm.manager.speakPrompt("Halo", { lang: "id-ID" });
  assert.equal(warm.timers.size, 0, "real prompt on the same gesture should cancel pending silent warmup");
  assert.equal(warm.synth.cancelCount, 0, "canceling a not-yet-started warmup must not touch native speech queue");
  assert.equal(warm.synth.spoken[0]?.text, "Halo");

  const silentWarm = harness(voices);
  silentWarm.manager.unlock("id-ID");
  silentWarm.runTimers();
  assert.equal(silentWarm.synth.spoken.length, 1, "idle user gesture should prime speech synthesis");
  assert.equal(silentWarm.synth.spoken[0].volume, 0, "speech warmup must be silent");
  assert.equal(silentWarm.synth.spoken[0].voice?.name, "Indonesia local");
  silentWarm.synth.endCurrent();
  assert.equal(silentWarm.manager.status().warmedSpeech, true);

  const changed = harness([voice({ name: "Indonesia remote", lang: "id-ID", localService: false })]);
  changed.manager.speakPrompt("Tes suara", { lang: "id-ID" });
  changed.synth.voices = [voice({ name: "Indonesia new local", lang: "id-ID", localService: true })];
  changed.synth.triggerVoicesChanged();
  assert.equal(changed.manager.selectVoice("id-ID")?.name, "Indonesia new local", "voiceschanged must invalidate locale cache");

  const routeStop = harness(voices);
  routeStop.manager.speakPrompt("Instruksi lama");
  routeStop.advance(1000);
  routeStop.manager.speakPrompt("Instruksi antre");
  assert.equal(routeStop.manager.status().queueDepth, 1);
  routeStop.manager.stop();
  assert.equal(routeStop.manager.status().queueDepth, 0, "route stop must clear pending speech");
  assert.equal(routeStop.manager.status().speaking, false, "route stop must clear active speech");
  assert.equal(routeStop.synth.cancelCount, 1);

  const privacy = harness(voices);
  privacy.manager.speakPrompt("Teks anak tidak boleh ikut telemetry", { lang: "id-ID" });
  privacy.advance(87);
  privacy.synth.startCurrent();
  const started = privacy.latency.find((sample) => sample.phase === "started");
  assert.ok(started, "speech start should emit measurable latency sample");
  assert.equal(started.startLatencyMs, 87);
  assert.equal(started.textLength, "Teks anak tidak boleh ikut telemetry".length);
  assert.equal("text" in started, false, "latency sample must not contain spoken text");
  assert.equal("childId" in started, false, "latency sample must not contain child identity");

  const srcFiles = walkFiles(path.join(root, "src"))
    .filter((file) => /\.(ts|tsx)$/.test(file));
  const directSpeech = [];
  for (const file of srcFiles) {
    if (file.endsWith(path.join("lib", "audio", "AudioManager.ts"))) continue;
    const source = readFileSync(file, "utf8");
    if (/SpeechSynthesisUtterance|window\.speechSynthesis|speechSynthesis\.speak|speechSynthesis\.cancel/.test(source)) {
      directSpeech.push(path.relative(root, file));
    }
  }
  assert.deepEqual(directSpeech, [], `all product speech synthesis must route through AudioManager: ${directSpeech.join(", ")}`);

  const feedbackSource = readFileSync(path.join(root, "src", "lib", "audio", "feedback.ts"), "utf8");
  assert.match(feedbackSource, /audioManager\.speakPrompt/, "compatibility speech facade must delegate to AudioManager");
  assert.doesNotMatch(feedbackSource, /SpeechSynthesisUtterance|speechSynthesis\.cancel/);

  const routeBridge = readFileSync(path.join(root, "src", "components", "audio", "AudioRouteBridge.tsx"), "utf8");
  assert.match(routeBridge, /usePathname/, "audio route bridge must observe navigation");
  assert.match(routeBridge, /stopSpeech\(\)/, "navigation must stop stale speech");
  assert.match(routeBridge, /pointerdown/, "first user gesture should unlock/warm audio");

  const legacyLearning = readFileSync(path.join(root, "src", "components", "learning", "ChildLearningPlatform.tsx"), "utf8");
  assert.doesNotMatch(legacyLearning, /SpeechSynthesisUtterance|utterance\.rate\s*=\s*0\.85|speechSynthesis\.cancel/);
  assert.match(legacyLearning, /speakManagedPrompt/, "legacy learning audio must delegate to managed prompt speech");

  const audioChoice = readFileSync(path.join(root, "src", "components", "learning", "AudioChoiceLearningActivity.tsx"), "utf8");
  assert.doesNotMatch(audioChoice, /speakWithStatus\(prompt, lang, 0\.88\)/, "audio choice must use centralized default prompt rate");

  console.log("Mainlagi AudioManager behavior, privacy, queue, warmup, route-stop, and architecture contracts passed.");
} catch (error) {
  console.error(error);
  process.exit(1);
} finally {
  rmSync(outDir, { recursive: true, force: true });
}
