# Physical camera QA

## Setup matrix

Run each camera-required module in Chrome and Edge:

- laptop internal webcam;
- external webcam if available;
- daylight;
- indoor artificial light;
- dim light;
- plain background;
- busy background.

## Pre-flight

For one-player mode verify:

- target is 1 player;
- one hand/body can complete pre-flight;
- no center divider appears;
- skeleton follows mirrored preview;
- countdown starts only after the user presses the button.

For two-player mode verify:

- Player A remains left and B remains right;
- each hand belongs to the nearest body;
- a hand near the center does not rapidly change player;
- one missing player prevents automatic readiness but does not freeze the UI;
- mode can be changed without refreshing.

## Writing

For digits 0–9, collect at least 20 attempts per digit:

- right hand;
- left hand;
- normal and mirrored movement;
- small/large writing;
- slow/fast writing.

Verify:

- pinch begins a stroke;
- release ends only the stroke, not the whole glyph;
- second/third stroke can be added;
- open palm submits;
- fist clears;
- low confidence shows retry and does not deduct score;
- engine failure gives time grace.

## Body games

Before starting, clear the floor and maintain enough distance from furniture.

Verify:

- left/right;
- jump;
- crouch;
- forward/back calibration;
- leaving the frame;
- camera interruption;
- ten-minute session without stream or animation leak.
