# Visual Fidelity Ledger

## Reference and render inventory

- Approved hub concept: `public/concepts/hub-home.png`
- Approved Math Battle concept: `public/concepts/math-battle.png`
- Approved Number Trace concept: `public/concepts/number-trace.png`
- Approved Shape Quest concept: `public/concepts/shape-quest.png`
- Approved Pattern Race concept: `public/concepts/pattern-race.png`
- Desktop hub render: `docs/implementation-hub.png`
- Desktop game render: `docs/implementation-game.png`
- Mobile hub render: `docs/implementation-mobile.png`

## Comparison ledger

| Comparison point | Concept evidence | Implementation evidence | Result / action |
|---|---|---|---|
| Child-friendly visual identity | Bright green, blue, orange, purple game worlds with playful imagery | The four catalog cards preserve the same color identities and large readable game titles | Matched at system level |
| Hub hierarchy | Brand/header, large learning message, camera explanation, then four games | Header, large hero statement, privacy message, primary actions, then four large game cards | Matched; layout adapted into a real responsive website |
| Math duel identity | Blue Player A, pink Player B, center timer/question, two large writing zones | Blue/pink split arena, prominent timer/question, equal large canvases, answer slots and score panels | Matched |
| Faces remain visible during play | Child and mother are visible behind transparent trails | Live `<video>` is rendered behind transparent SVG motion canvases; static no-camera screenshot shows the fallback surfaces | Functional match; requires webcam verification |
| One digit at a time | Two answer slots with current digit feedback | Answer slots are code-native and advance one recognized digit at a time | Matched |
| Motion trail color | Blue trail for A and pink trail for B | Code-native SVG trails use the corresponding player accents | Matched |
| Timer and question prominence | Large center timer and central question panel | Both are centered and remain above player canvases | Matched |
| Main replay loop | Concept includes “Main Lagi” | Result overlay includes play again, change level/game, and return actions | Matched and expanded |
| Responsive use | Concept is laptop-first | Desktop and 390px mobile hub render were checked; game remains desktop/laptop-first by product decision | Intentional product adaptation |
| Code-native interaction | Concepts are raster mockups | Navigation, labels, buttons, slots, score, timer, canvas, state and controls are React/CSS/SVG—not embedded screenshots | Production-appropriate implementation |

## Above-the-fold copy review

The implementation retains the approved product story—learning through movement, four motion games, and camera-based interaction—while removing profile/login language that conflicts with the explicit no-login requirement.

No unsupported achievement/account claims were added.

## Intentional deviations

1. **No account/profile/achievement system.** Some generated concepts visually contained profile or achievement UI. These were deliberately excluded because the agreed scope says no login or account system.
2. **Live people are supplied by the webcam, not stock imagery.** The actual game shows the child and parent captured by the user's camera. The code does not fake or record faces.
3. **The hub uses an open responsive website composition.** It does not reproduce the laptop bezel from the concept as interface chrome.
4. **Game UI is simplified around the core action.** Decorative mascots are reduced so camera inference, timer, question and writing canvases remain readable and performant.
5. **Static implementation screenshots use no-camera fallback surfaces.** Camera-enabled runtime is the required final visual acceptance check.

## Verification conclusion

The implementation faithfully carries over the approved information hierarchy, color-coded game identity, split-player arena, timer/question prominence, air-writing canvases, and child-friendly tone. No material visual mismatch remains that can be resolved without running the real webcam application. The remaining acceptance item is physical camera rendering and performance on the target laptop.
