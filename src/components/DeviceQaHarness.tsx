"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "@/app/qa/device/device-qa.module.css";

type QaStatus = "PENDING" | "PASS" | "FAIL" | "BLOCKED";

type QaTest = {
  id: string;
  area: string;
  title: string;
  instructions: string;
  route?: string;
  routeLabel?: string;
};

type QaResult = {
  status: QaStatus;
  notes: string;
};

type DeviceSession = {
  deviceModel: string;
  osVersion: string;
  browserVersion: string;
};

type DeviceSnapshot = {
  capturedAt: string;
  userAgent: string;
  platform: string;
  language: string;
  viewport: string;
  screen: string;
  devicePixelRatio: number;
  touchPoints: number;
  orientation: string;
  online: boolean;
  standalone: boolean;
  reducedMotion: boolean;
  secureContext: boolean;
  cameraApi: boolean;
  speechSynthesis: boolean;
};

const STORAGE_KEY = "mainlagi:physical-device-qa:v1";

const TESTS: QaTest[] = [
  {
    id: "core-mobile",
    area: "Core mobile",
    title: "Child route usability",
    instructions: "Open child home, learn, stage, activity, and rewards. Verify primary controls are not clipped or hidden at normal browser zoom.",
    route: "/child/demo-gian/home",
    routeLabel: "Open child home"
  },
  {
    id: "parent-mobile",
    area: "Parent mobile",
    title: "Parent route usability",
    instructions: "Open overview, child progress, reports, certificates, privacy/settings. Verify navigation and long content stay usable.",
    route: "/parent/children/demo-gian/reports",
    routeLabel: "Open parent report"
  },
  {
    id: "safe-areas",
    area: "Safe areas",
    title: "Notch and browser chrome",
    instructions: "Verify top/bottom controls do not collide with the notch, home indicator, or browser chrome."
  },
  {
    id: "orientation",
    area: "Orientation",
    title: "Portrait-landscape recovery",
    instructions: "Rotate portrait → landscape → portrait on a child activity and math-choice. Layout and state must remain recoverable.",
    route: "/play/math-choice",
    routeLabel: "Open math-choice"
  },
  {
    id: "virtual-keyboard",
    area: "Virtual keyboard",
    title: "Keyboard resize and focus",
    instructions: "Focus/edit profile or settings inputs. The virtual keyboard must not trap controls or break scroll/focus recovery.",
    route: "/account/profile",
    routeLabel: "Open profile"
  },
  {
    id: "trace-touch",
    area: "Trace/touch",
    title: "Real-finger trace accuracy",
    instructions: "Complete a representative guided trace with a real finger. Coordinate mapping must remain accurate and visible.",
    route: "/child/demo-gian/activity/math-trace-5-touch",
    routeLabel: "Open guided trace"
  },
  {
    id: "trace-orientation",
    area: "Trace orientation",
    title: "Trace across rotation",
    instructions: "Start a trace, rotate the device, then continue. The surface must not retain stale coordinate geometry.",
    route: "/child/demo-gian/activity/math-trace-5-touch",
    routeLabel: "Open guided trace"
  },
  {
    id: "drawing",
    area: "Drawing",
    title: "Real-finger drawing",
    instructions: "Draw with a real finger. Strokes must follow touch without material offset, clipping, or scroll conflict.",
    route: "/child/demo-gian/activity/drawing-line-vertical",
    routeLabel: "Open drawing activity"
  },
  {
    id: "coloring",
    area: "Coloring",
    title: "Real-finger coloring",
    instructions: "Color with a real finger. Intended regions must remain reachable and responsive.",
    route: "/child/demo-gian/activity/color-gavi",
    routeLabel: "Open coloring activity"
  },
  {
    id: "audio-unlock",
    area: "Audio unlock",
    title: "First-gesture audio start",
    instructions: "On the first eligible user gesture, trigger TTS/audio. Confirm there is no silent dead state or repeated permission-like friction.",
    route: "/child/demo-gian/activity/english-find-blue-audio",
    routeLabel: "Open audio activity"
  },
  {
    id: "audio-replay",
    area: "Audio replay",
    title: "Replay and route cleanup",
    instructions: "Replay TTS several times and navigate away mid-speech. Old speech must stop and must not overlap later playback.",
    route: "/child/demo-gian/activity/english-find-blue-audio",
    routeLabel: "Open audio activity"
  },
  {
    id: "audio-fallback",
    area: "Audio fallback",
    title: "Usable browser/local fallback",
    instructions: "Exercise a supported locale and verify intelligible browser/local fallback when remote TTS is unavailable.",
    route: "/child/demo-gian/activity/english-find-blue-audio",
    routeLabel: "Open audio activity"
  },
  {
    id: "camera-allow",
    area: "Camera allow",
    title: "Grant camera permission",
    instructions: "Open math-choice, grant camera permission, and verify the live camera/motion path initializes.",
    route: "/play/math-choice",
    routeLabel: "Open camera game"
  },
  {
    id: "camera-deny",
    area: "Camera deny",
    title: "Deny camera permission",
    instructions: "Deny camera permission. UI must fail gracefully and remain navigable/recoverable.",
    route: "/play/math-choice",
    routeLabel: "Open camera game"
  },
  {
    id: "camera-recovery",
    area: "Camera recovery",
    title: "Background/foreground recovery",
    instructions: "Background/foreground the browser or navigate away/back. Camera must not remain stuck or multiply streams.",
    route: "/play/math-choice",
    routeLabel: "Open camera game"
  },
  {
    id: "camera-orientation",
    area: "Camera orientation",
    title: "Overlay alignment after rotation",
    instructions: "With camera active, rotate the device and verify overlay/interaction coordinates remain aligned.",
    route: "/play/math-choice",
    routeLabel: "Open camera game"
  },
  {
    id: "reduced-motion",
    area: "Reduced motion",
    title: "OS reduced-motion behavior",
    instructions: "Enable the OS reduced-motion preference and verify representative child/parent routes suppress non-essential long motion."
  },
  {
    id: "assistive-tech",
    area: "Assistive tech",
    title: "VoiceOver / TalkBack navigation",
    instructions: "Navigate key child/parent controls with VoiceOver or TalkBack. Primary controls must have understandable names and order."
  },
  {
    id: "zoom-text-size",
    area: "Zoom/text size",
    title: "Large text resilience",
    instructions: "Increase browser/OS text size where supported. Critical navigation and actions must remain reachable without destructive clipping."
  },
  {
    id: "offline-attempt",
    area: "Offline attempt",
    title: "Network interruption during attempt",
    instructions: "After app state is loaded, interrupt network during an eligible attempt. The app must not fabricate server mastery.",
    route: "/child/demo-gian/activity/math-count-3",
    routeLabel: "Open assessed activity"
  },
  {
    id: "reconnect-outbox",
    area: "Reconnect/outbox",
    title: "Queued-attempt recovery",
    instructions: "Restore network and verify queued attempt behavior is account-bound, non-duplicating, and recoverable."
  },
  {
    id: "session-isolation",
    area: "Session isolation",
    title: "Cross-account outbox isolation",
    instructions: "Switch/logout account after an offline failure. Queued data must not replay into another account."
  }
];

function defaultResults(): Record<string, QaResult> {
  return Object.fromEntries(TESTS.map((test) => [test.id, { status: "PENDING", notes: "" }])) as Record<string, QaResult>;
}

function captureSnapshot(): DeviceSnapshot {
  const nav = navigator as Navigator & { standalone?: boolean };
  return {
    capturedAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
    platform: navigator.platform || "unknown",
    language: navigator.language || "unknown",
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    screen: `${window.screen.width}x${window.screen.height}`,
    devicePixelRatio: window.devicePixelRatio,
    touchPoints: navigator.maxTouchPoints,
    orientation: window.screen.orientation?.type || (window.innerWidth > window.innerHeight ? "landscape" : "portrait"),
    online: navigator.onLine,
    standalone: Boolean(nav.standalone || window.matchMedia("(display-mode: standalone)").matches),
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    secureContext: window.isSecureContext,
    cameraApi: Boolean(navigator.mediaDevices?.getUserMedia),
    speechSynthesis: "speechSynthesis" in window
  };
}

function normalizeSavedResults(value: unknown): Record<string, QaResult> {
  const defaults = defaultResults();
  if (!value || typeof value !== "object") return defaults;
  const saved = value as Record<string, unknown>;
  for (const test of TESTS) {
    const row = saved[test.id];
    if (!row || typeof row !== "object") continue;
    const candidate = row as Partial<QaResult>;
    if (["PENDING", "PASS", "FAIL", "BLOCKED"].includes(candidate.status ?? "")) {
      defaults[test.id].status = candidate.status as QaStatus;
    }
    if (typeof candidate.notes === "string") defaults[test.id].notes = candidate.notes.slice(0, 4000);
  }
  return defaults;
}

export function DeviceQaHarness() {
  const [session, setSession] = useState<DeviceSession>({ deviceModel: "", osVersion: "", browserVersion: "" });
  const [results, setResults] = useState<Record<string, QaResult>>(defaultResults);
  const [snapshot, setSnapshot] = useState<DeviceSnapshot | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { session?: Partial<DeviceSession>; results?: unknown };
        if (parsed.session) {
          setSession({
            deviceModel: typeof parsed.session.deviceModel === "string" ? parsed.session.deviceModel : "",
            osVersion: typeof parsed.session.osVersion === "string" ? parsed.session.osVersion : "",
            browserVersion: typeof parsed.session.browserVersion === "string" ? parsed.session.browserVersion : ""
          });
        }
        setResults(normalizeSavedResults(parsed.results));
      }
    } catch {
      setMessage("Saved QA state could not be restored; a fresh local session was started.");
    }
    setSnapshot(captureSnapshot());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ session, results }));
  }, [hydrated, session, results]);

  useEffect(() => {
    const refresh = () => setSnapshot(captureSnapshot());
    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    return () => {
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
    };
  }, []);

  const counts = useMemo(() => {
    return TESTS.reduce(
      (acc, test) => {
        acc[results[test.id]?.status ?? "PENDING"] += 1;
        return acc;
      },
      { PENDING: 0, PASS: 0, FAIL: 0, BLOCKED: 0 } as Record<QaStatus, number>
    );
  }, [results]);

  const evidencePayload = () => ({
    schema: "mainlagi-physical-device-qa-v1",
    exportedAt: new Date().toISOString(),
    productionUrl: window.location.origin,
    session,
    snapshot: captureSnapshot(),
    results: TESTS.map((test) => ({
      id: test.id,
      area: test.area,
      title: test.title,
      status: results[test.id]?.status ?? "PENDING",
      notes: results[test.id]?.notes ?? ""
    }))
  });

  const updateResult = (id: string, patch: Partial<QaResult>) => {
    setResults((current) => ({
      ...current,
      [id]: {
        ...current[id],
        ...patch
      }
    }));
  };

  const reset = () => {
    setResults(defaultResults());
    setMessage("All test results were reset to PENDING on this device.");
  };

  const copySummary = async () => {
    const payload = evidencePayload();
    const summary = [
      `Mainlagi physical-device QA — ${payload.exportedAt}`,
      `Device: ${session.deviceModel || "not recorded"}`,
      `OS: ${session.osVersion || "not recorded"}`,
      `Browser: ${session.browserVersion || "not recorded"}`,
      `Viewport: ${payload.snapshot.viewport}; DPR ${payload.snapshot.devicePixelRatio}; touch points ${payload.snapshot.touchPoints}`,
      `PASS ${counts.PASS} / FAIL ${counts.FAIL} / BLOCKED ${counts.BLOCKED} / PENDING ${counts.PENDING}`,
      "",
      ...payload.results.map((row) => `${row.status} | ${row.area} | ${row.notes || "-"}`)
    ].join("\n");
    try {
      await navigator.clipboard.writeText(summary);
      setMessage("Evidence summary copied to clipboard.");
    } catch {
      setMessage("Clipboard access was unavailable. Use Export JSON instead.");
    }
  };

  const exportJson = () => {
    const payload = evidencePayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const deviceSlug = (session.deviceModel || "device").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    anchor.href = url;
    anchor.download = `mainlagi-physical-qa-${deviceSlug || "device"}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Evidence JSON prepared locally. No QA data was uploaded by this harness.");
  };

  return (
    <main className={styles.page} data-mainlagi-route-boundary="device-qa">
      <section className={styles.shell}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>Mainlagi release acceptance</p>
          <h1>Physical Device QA</h1>
          <p>
            Jalankan checklist ini langsung di iPhone/Safari dan Android/Chrome. Hasil disimpan hanya di localStorage perangkat ini sampai kamu reset browser data atau menekan reset.
          </p>
          <div className={styles.notice} role="note">
            Harness ini tidak meng-upload evidence, tidak membaca token, dan tidak meminta kamera/mikrofon otomatis. PASS tetap harus berdasarkan pengujian fisik yang benar-benar dilakukan.
          </div>
        </header>

        <section className={styles.card} aria-labelledby="device-info-title">
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>Step 1</p>
              <h2 id="device-info-title">Identitas perangkat</h2>
            </div>
            <button className={styles.secondaryButton} type="button" onClick={() => setSnapshot(captureSnapshot())}>
              Refresh snapshot
            </button>
          </div>

          <div className={styles.fields}>
            <label>
              <span>Device model</span>
              <input value={session.deviceModel} onChange={(event) => setSession((current) => ({ ...current, deviceModel: event.target.value }))} placeholder="Contoh: iPhone 15 / Samsung A55" />
            </label>
            <label>
              <span>OS version</span>
              <input value={session.osVersion} onChange={(event) => setSession((current) => ({ ...current, osVersion: event.target.value }))} placeholder="Contoh: iOS 20 / Android 17" />
            </label>
            <label>
              <span>Browser + version</span>
              <input value={session.browserVersion} onChange={(event) => setSession((current) => ({ ...current, browserVersion: event.target.value }))} placeholder="Contoh: Safari 20 / Chrome 152" />
            </label>
          </div>

          {snapshot && (
            <dl className={styles.snapshot}>
              <div><dt>Viewport</dt><dd>{snapshot.viewport}</dd></div>
              <div><dt>Screen</dt><dd>{snapshot.screen}</dd></div>
              <div><dt>DPR</dt><dd>{snapshot.devicePixelRatio}</dd></div>
              <div><dt>Touch points</dt><dd>{snapshot.touchPoints}</dd></div>
              <div><dt>Orientation</dt><dd>{snapshot.orientation}</dd></div>
              <div><dt>Online</dt><dd>{snapshot.online ? "yes" : "no"}</dd></div>
              <div><dt>Reduced motion</dt><dd>{snapshot.reducedMotion ? "yes" : "no"}</dd></div>
              <div><dt>Secure context</dt><dd>{snapshot.secureContext ? "yes" : "no"}</dd></div>
              <div><dt>Camera API</dt><dd>{snapshot.cameraApi ? "available" : "unavailable"}</dd></div>
              <div><dt>Speech synthesis</dt><dd>{snapshot.speechSynthesis ? "available" : "unavailable"}</dd></div>
              <div className={styles.wide}><dt>User agent</dt><dd>{snapshot.userAgent}</dd></div>
            </dl>
          )}
        </section>

        <section className={styles.card} aria-labelledby="matrix-title">
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>Step 2</p>
              <h2 id="matrix-title">22 physical tests</h2>
            </div>
            <div className={styles.counts} aria-label="QA result summary">
              <span>PASS {counts.PASS}</span>
              <span>FAIL {counts.FAIL}</span>
              <span>BLOCKED {counts.BLOCKED}</span>
              <span>PENDING {counts.PENDING}</span>
            </div>
          </div>

          <div className={styles.tests}>
            {TESTS.map((test, index) => {
              const result = results[test.id] ?? { status: "PENDING" as const, notes: "" };
              return (
                <article className={styles.testCard} key={test.id}>
                  <div className={styles.testTop}>
                    <div>
                      <p className={styles.testNumber}>Test {index + 1} · {test.area}</p>
                      <h3>{test.title}</h3>
                    </div>
                    <label className={styles.statusField}>
                      <span className={styles.srOnly}>Status {test.area}</span>
                      <select value={result.status} onChange={(event) => updateResult(test.id, { status: event.target.value as QaStatus })}>
                        <option value="PENDING">PENDING</option>
                        <option value="PASS">PASS</option>
                        <option value="FAIL">FAIL</option>
                        <option value="BLOCKED">BLOCKED</option>
                      </select>
                    </label>
                  </div>
                  <p className={styles.instructions}>{test.instructions}</p>
                  {test.route && (
                    <Link className={styles.routeButton} href={test.route} target="_blank" rel="noreferrer">
                      {test.routeLabel ?? "Open test route"}
                    </Link>
                  )}
                  <label className={styles.notesField}>
                    <span>Evidence / notes</span>
                    <textarea
                      rows={3}
                      value={result.notes}
                      onChange={(event) => updateResult(test.id, { notes: event.target.value })}
                      placeholder="Catat hasil, bug, screenshot/video/issue reference, orientation, atau alasan BLOCKED."
                    />
                  </label>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.card} aria-labelledby="export-title">
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.kicker}>Step 3</p>
              <h2 id="export-title">Export evidence</h2>
            </div>
          </div>
          <p className={styles.exportCopy}>
            Setelah selesai di satu perangkat, export JSON atau copy summary. Evidence tersebut dapat dipakai untuk mengisi <code>docs/BATCH16_PHYSICAL_DEVICE_QA.md</code> dan issue #83 tanpa menyimpan child media atau credential.
          </p>
          <div className={styles.actions}>
            <button className={styles.primaryButton} type="button" onClick={exportJson}>Export JSON</button>
            <button className={styles.secondaryButton} type="button" onClick={() => void copySummary()}>Copy summary</button>
            <button className={styles.dangerButton} type="button" onClick={reset}>Reset results</button>
          </div>
          {message && <p className={styles.message} role="status">{message}</p>}
        </section>
      </section>
    </main>
  );
}
