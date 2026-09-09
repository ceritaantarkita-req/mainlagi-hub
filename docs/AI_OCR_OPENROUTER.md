# Planned OCR + AI / OpenRouter Architecture

Status: **planned**. This document defines constraints before implementation.

## Goal

Add a reusable OCR/visual-understanding capability for learning activities without weakening the existing motion engine, exposing provider credentials, or silently sending child data to external AI providers.

Potential uses:

- reading handwritten or printed answers;
- worksheet/flash-card recognition;
- validating text captured from a bounded learning surface;
- assisting activity-specific recognition when deterministic/local methods are insufficient.

## Architecture principle

OCR is a separate engine boundary.

```text
Learning Activity
  -> OcrRequest
      -> local/deterministic recognizer when suitable
      -> optional AI verifier/enrichment
          -> server-side OpenRouter adapter
              -> configured multimodal/text model
```

The existing MediaPipe vision runtime remains responsible for motion/gesture/body tracking. OCR must not be embedded directly into `useVisionRuntime` just because both features consume visual data.

## Recommended request contract

A future request should be explicit and bounded, for example:

```ts
interface OcrRequest {
  activityId: string;
  inputKind: "image-crop" | "stroke-data" | "text";
  expectedKind: "digit" | "word" | "short-text" | "worksheet";
  locale: "id-ID" | "en-US" | "ar";
  expectedAnswer?: string;
  image?: Blob;
  strokes?: Array<{ x: number; y: number; t: number }>;
}
```

The exact API is not implemented yet; this illustrates the boundary.

## Local-first recognition

Prefer deterministic/local processing when it meets the learning need:

- current digit/expected-answer recognizer;
- current tracing/shape scoring;
- activity-specific glyph rules;
- future browser/local OCR if quality and device cost are acceptable.

AI should add value as verification, ambiguity resolution, or broader visual understanding rather than replacing every fast local decision.

## OpenRouter integration

Planned OpenRouter use is server-side only.

Future environment variable:

```text
OPENROUTER_API_KEY=
```

Rules:

- Never commit an API key.
- Never prefix the secret with `NEXT_PUBLIC_`.
- Never send the secret to a browser/client bundle.
- Model ID and routing policy must be configurable independently from the key.
- Do not hardcode one permanent model as part of the OCR engine contract.
- Normalize provider/network errors; do not leak provider response bodies or credentials into client errors.
- Set request timeout, input-size limit, output-size limit and concurrency/rate controls.

OpenRouter authentication uses a bearer API key, so the server adapter must own the `Authorization` header and credential lifecycle.

## Child-data privacy boundary

The application is intended for children. External inference therefore requires a stricter boundary than ordinary app telemetry.

Default policy for future OCR/AI work:

1. **Do not send continuous camera streams.**
2. **Do not automatically upload full camera frames.**
3. Prefer cropped learning surfaces, derived strokes, or text when possible.
4. Remove unrelated background/identity information before provider dispatch where practical.
5. Do not use child images/inputs for model training unless a future policy obtains the required explicit permissions and the provider terms support it.
6. Document provider retention/data-use behavior before enabling a model in production.
7. Parent-facing settings must explain when an activity uses external AI.

## Suggested server adapter responsibilities

A future adapter such as `src/lib/ai/openrouter.ts` or an equivalent server-only module should own:

- credential read;
- model configuration;
- request shaping;
- payload minimization;
- timeout/abort;
- provider HTTP call;
- response schema validation;
- usage/cost metadata bounds;
- error normalization;
- optional allowlist of approved models/providers.

Activity components should not call OpenRouter directly.

## Model selection

The engine should support capability-based selection rather than a single branded model assumption.

Example capability metadata:

```ts
type OcrCapability = {
  vision: boolean;
  languages: string[];
  structuredOutput: boolean;
  maxImageBytes: number;
};
```

The operator can later configure an OpenRouter model that meets the required capability, budget and privacy constraints.

## Reliability behavior

AI failure must be a defined product state.

Depending on the activity:

- fall back to local recognition;
- ask the child to retry;
- let the parent/teacher confirm;
- mark the answer as unverified rather than wrong;
- skip the AI-enhanced step without crashing the session.

Do not turn an upstream model outage into a broken motion-learning platform.

## Security checklist before implementation

- [ ] server-only key boundary;
- [ ] `.env.example` contains blank placeholder only when the feature is implemented;
- [ ] no secret in logs, analytics or client error messages;
- [ ] request-size caps;
- [ ] MIME/content validation for images;
- [ ] rate limiting;
- [ ] timeout and cancellation;
- [ ] provider response schema validation;
- [ ] prompt-injection considerations for OCR content;
- [ ] no arbitrary URL fetching supplied by OCR input;
- [ ] data-retention/provider-policy review;
- [ ] parent/privacy UX reviewed;
- [ ] tests for credential leakage and network failure;
- [ ] production dependency audit green.

## Non-goal

This document does not select a final OCR model, promise free inference, or claim that OpenRouter/OCR is already implemented. It establishes the architecture so a future implementation can be added without contaminating the current motion engine or exposing credentials.
