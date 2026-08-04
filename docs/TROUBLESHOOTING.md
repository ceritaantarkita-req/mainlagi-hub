# Troubleshooting

## `npm install` fails

- Verify Node.js is at least 20.9.
- Run `npm config get registry`.
- For a normal public setup, use `https://registry.npmjs.org/`.
- Delete `node_modules` and lockfile only after making a backup, then reinstall.

## Camera permission denied

Chrome/Edge: click the lock/camera icon near the address bar, allow camera, reload the page. Ensure the site uses HTTPS outside localhost.

## Camera is black

Close other apps using the webcam. Check OS privacy settings and browser camera selection.

## Hand tracker model fails

Run:

```bash
node scripts/setup-mediapipe-assets.mjs
```

Confirm these paths exist after successful setup:

```text
public/models/hand_landmarker.task
public/mediapipe/wasm/
```

Runtime may still use official remote fallback if local assets are absent.

## Trail moves opposite the finger

Check both sides of the mirror contract:

- video element must use `transform: scaleX(-1)`;
- fingertip X must be converted with `1 - x` exactly once.

Never mirror only the video or mirror coordinates twice.

## Too many retries

- Improve front lighting.
- Move the hand farther from the camera.
- Write larger and slower.
- Keep only the index finger extended.
- Do not immediately lower the confidence threshold; evaluate false accepts first.

## Production build error

Run these in order and repair the first failure:

```bash
npm run typecheck
npm run lint
npm run test:engine
npm run simulate
npm run build
```
