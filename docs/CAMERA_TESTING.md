# Real Camera Testing Checklist

Automated tests cannot prove webcam accuracy on every laptop. Run this checklist before public deployment.

## Environment matrix

Test at minimum:

- Chrome and Edge current stable.
- Internal webcam and one external webcam.
- 720p and 1080p devices.
- Bright daylight, normal indoor light, and moderately dim light.
- Plain and visually busy backgrounds.
- Right-handed and left-handed writers.
- Child and adult hand sizes.

## Setup checks

- Camera permission prompt appears once.
- Permission denial shows an actionable error.
- Camera tracks stop after leaving/reloading the game.
- Preview moves like a mirror.
- Fingertip trail follows the visible finger, not the opposite direction.
- Player A remains left and Player B remains right.
- Hands in the middle dead zone are ignored.

## Gesture checks

For digits 0–9, collect at least 20 attempts per digit from multiple users.

Record:

- accepted correct;
- accepted wrong;
- rejected/retry;
- lighting and distance;
- writing direction/style.

A wrong accepted digit is more severe than a retry. Do not lower confidence thresholds only to reduce retries.

## Game loop checks

- Ready screen blocks input.
- Countdown blocks early answers.
- Timer starts exactly after countdown.
- Pause freezes timer and scoring.
- Last incomplete digit is ignored at time-up.
- Result cannot change after time-up.
- Main Lagi resets the entire round without requesting camera permission again.

## Recommended physical setup

- Laptop approximately 1–2 metres from two players.
- Camera near eye/chest level.
- Both upper bodies and writing hands visible.
- Light source in front of players, not directly behind them.
