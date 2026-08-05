import { writeFile, mkdir } from "node:fs/promises";
import { compileEngine } from "./compile-engine.mjs";

await compileEngine();
const { ChallengeDeck } = await import("../.qa-dist/engine/challenges.js");
const { scorePathAgainstTarget, addNoise } = await import("../.qa-dist/engine/geometry.js");
const { createRandom } = await import("../.qa-dist/engine/random.js");
const { createSession, reduceSession } = await import("../.qa-dist/engine/session.js");

function startSession(gameId, level, seed, duration = 60) {
  const rng = createRandom(seed);
  const deck = new ChallengeDeck(gameId, level, rng);
  let session = createSession(gameId, level, duration, seed);
  session = reduceSession(session, { type: "DEVICE_CHECK" });
  session = reduceSession(session, { type: "READY" });
  session = reduceSession(session, { type: "COUNTDOWN" });
  session = reduceSession(session, { type: "START", challenge: deck.next() });
  return { session, deck, rng };
}

function simulationOne() {
  let { session, deck } = startSession("math-battle", "grade-2", 101);
  for (let question = 0; question < 20; question += 1) {
    session = reduceSession(session, { type: "CORRECT", player: question % 2 === 0 ? "A" : "B", speedBonus: 25 });
    session = reduceSession(session, { type: "CORRECT", player: question % 2 === 0 ? "B" : "A", speedBonus: 0 });
    session = reduceSession(session, { type: "SET_CHALLENGE", challenge: deck.next() });
    session = reduceSession(session, { type: "TICK", seconds: 3 });
  }
  session = reduceSession(session, { type: "TIME_UP" });
  session = reduceSession(session, { type: "RESULT" });
  return {
    name: "Simulation 1 — ideal two-player math round",
    gameId: session.gameId,
    questions: 20,
    phase: session.phase,
    scoreA: session.players.A.score,
    scoreB: session.players.B.score,
    winner: session.winner,
    invariantErrors: session.remainingSeconds !== 0 || session.phase !== "result" ? 1 : 0
  };
}

function simulationTwo() {
  let { session, deck } = startSession("pattern-race", "grade-1", 202);
  let retries = 0;
  for (let question = 0; question < 18; question += 1) {
    if (question % 3 === 0) {
      session = reduceSession(session, { type: "RETRY", player: "A" });
      retries += 1;
    }
    if (question % 4 === 0) session = reduceSession(session, { type: "WRONG", player: "B" });
    session = reduceSession(session, { type: "CORRECT", player: question % 2 === 0 ? "A" : "B", speedBonus: 15 });
    session = reduceSession(session, { type: "SET_CHALLENGE", challenge: deck.next() });
    session = reduceSession(session, { type: "TICK", seconds: question % 5 === 0 ? 4 : 3 });
    if (session.phase === "time-up") break;
  }
  session = reduceSession(session, { type: "TIME_UP" });
  session = reduceSession(session, { type: "RESULT" });
  return {
    name: "Simulation 2 — noisy pattern round with retries and wrong answers",
    gameId: session.gameId,
    questions: session.challengeIndex,
    retries,
    phase: session.phase,
    scoreA: session.players.A.score,
    scoreB: session.players.B.score,
    winner: session.winner,
    invariantErrors: session.players.A.score < 0 || session.players.B.score < 0 ? 1 : 0
  };
}

function simulationThree() {
  const results = [];
  for (const [gameId, level, seed] of [["number-trace", "kindergarten", 303], ["shape-quest", "grade-1", 304]]) {
    let { session, deck, rng } = startSession(gameId, level, seed, 30);
    let accepted = 0;
    let retries = 0;
    for (let round = 0; round < 10; round += 1) {
      const challenge = session.currentChallenge;
      if (!challenge || !(challenge.kind === "trace" || challenge.kind === "shape")) throw new Error("Unexpected challenge type in guided simulation.");
      const noisy = addNoise(challenge.target, round % 4 === 0 ? 0.09 : 0.014, () => rng.next());
      const score = scorePathAgainstTarget(noisy, challenge.target);
      if (score >= 62) {
        session = reduceSession(session, { type: "CORRECT", player: "A", speedBonus: Math.round(score / 5) });
        accepted += 1;
        session = reduceSession(session, { type: "SET_CHALLENGE", challenge: deck.next() });
      } else {
        session = reduceSession(session, { type: "RETRY", player: "A" });
        retries += 1;
      }
      session = reduceSession(session, { type: "TICK", seconds: 3 });
    }
    session = reduceSession(session, { type: "TIME_UP" });
    session = reduceSession(session, { type: "RESULT" });
    results.push({ gameId, accepted, retries, score: session.players.A.score, phase: session.phase });
  }
  return {
    name: "Simulation 3 — guided tracing recovery across two games",
    games: results,
    invariantErrors: results.some((result) => result.phase !== "result" || result.score < 0) ? 1 : 0
  };
}

const report = {
  schemaVersion: 1,
  simulations: [simulationOne(), simulationTwo(), simulationThree()]
};
await mkdir("qa", { recursive: true });
await writeFile("qa/simulation-results.json", JSON.stringify(report, null, 2));
for (const simulation of report.simulations) console.log(JSON.stringify(simulation));
if (report.simulations.some((simulation) => simulation.invariantErrors !== 0)) process.exitCode = 1;
