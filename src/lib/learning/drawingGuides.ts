/**
 * Functional drawing scaffolds in the canvas's 480 × 480 coordinate space.
 * These are practice guides, not correctness masks or mastery measurements.
 */
export interface DrawingGuide {
  mode: "trace" | "dots" | "complete";
  paths: string[];
  dots?: Array<[number, number]>;
}

const trace = (...paths: string[]): DrawingGuide => ({ mode: "trace", paths });
const complete = (...paths: string[]): DrawingGuide => ({ mode: "complete", paths });
const dots = (points: Array<[number, number]>): DrawingGuide => ({
  mode: "dots",
  paths: [points.map(([x,y],i) => `${i ? "L" : "M"}${x} ${y}`).join(" ") + " Z"],
  dots: points
});

// Explicit lesson-to-guide mappings: no random templates or title hashing.
// A complete guide intentionally supplies only the structural starter the child
// needs; it is not a finished picture and remains separate from painted strokes.
const guides: Record<string, DrawingGuide> = {
  "drawing-line-vertical": trace("M240 85 V395"),
  "drawing-line-horizontal": trace("M85 240 H395"),
  "drawing-line-diagonal-up": trace("M95 385 L385 95"),
  "drawing-line-diagonal-down": trace("M95 95 L385 385"),
  "drawing-line-zigzag": trace("M65 300 L135 150 L205 300 L275 150 L345 300 L415 150"),
  "drawing-curve-wave": trace("M55 240 Q100 105 147 240 T240 240 T333 240 T426 240"),
  "drawing-curve-arch": trace("M80 330 C80 70 400 70 400 330"),
  "drawing-curve-bowl": trace("M80 150 C80 410 400 410 400 150"),
  "drawing-curve-spiral": trace("M380 125 C475 345 180 480 92 285 C25 95 290 12 344 187 C396 343 185 385 155 250 C138 155 276 131 294 219 C310 280 233 291 224 242"),
  "drawing-curve-loop": trace("M240 240 C115 52 5 340 135 340 C195 340 205 280 240 240 C365 52 475 340 345 340 C285 340 275 280 240 240"),
  "drawing-shape-circle": trace("M240 85 A155 155 0 1 1 239.9 85 Z"),
  "drawing-shape-square": trace("M100 100 H380 V380 H100 Z"),
  "drawing-shape-triangle": trace("M240 85 L400 375 H80 Z"),
  "drawing-shape-rectangle": trace("M65 140 H415 V340 H65 Z"),
  "drawing-shape-diamond": trace("M240 65 L385 240 L240 415 L95 240 Z"),
  "drawing-dots-star": dots([[240,60],[288,179],[415,189],[315,271],[346,397],[240,325],[134,397],[165,271],[65,189],[192,179]]),
  "drawing-dots-house": dots([[90,220],[240,85],[390,220],[355,220],[355,390],[125,390],[125,220]]),
  "drawing-dots-fish": dots([[65,240],[160,140],[295,170],[360,220],[420,160],[420,320],[360,260],[295,310],[160,340]]),
  "drawing-dots-kite": dots([[240,65],[365,205],[240,370],[115,205]]),
  "drawing-dots-flower": dots([[240,65],[285,135],[365,115],[345,205],[415,250],[345,295],[365,380],[280,355],[240,420],[195,355],[110,380],[135,290],[65,250],[135,205],[110,115],[195,135]]),
  "drawing-compose-sun-rays": complete("M240 155 A85 85 0 1 1 239.9 155 Z"),
  "drawing-compose-tree-branches": complete("M225 405 L231 165 M249 165 L255 405"),
  "drawing-compose-face-features": complete("M240 80 C410 80 410 400 240 400 C70 400 70 80 240 80 Z"),
  "drawing-compose-rain-lines": complete("M100 205 C50 190 55 125 110 125 C105 55 205 65 235 120 C285 65 370 105 360 160 C420 150 440 225 380 230 H95 Z"),
  "drawing-compose-road-path": complete("M180 130 L240 80 L300 130 V200 H180 Z", "M225 200 V160 H255 V200", "M90 415 H150 M330 415 H390"),

  // WS-07 Wave A — concrete objects from simple starter shapes.
  "drawing-object-cup": complete("M145 150 H315 V330 Q315 395 230 395 Q145 395 145 330 Z"),
  "drawing-object-boat": complete("M95 295 H385 L330 365 H150 Z", "M240 135 V295"),
  "drawing-object-house": complete("M135 220 H345 V395 H135 Z"),
  "drawing-object-car": complete("M105 255 H355 L405 315 V355 H80 V315 Z"),
  "drawing-object-icecream": complete("M170 235 L240 415 L310 235 Z"),
  "drawing-animal-cat": complete("M145 235 C145 125 335 125 335 235 C335 340 145 340 145 235 Z"),
  "drawing-animal-fish": complete("M85 245 C145 125 325 135 370 240 C325 350 145 355 85 245 Z"),
  "drawing-animal-bird": complete("M135 270 C135 155 300 145 330 255 C335 345 180 375 135 270 Z"),
  "drawing-animal-butterfly": complete("M232 125 C220 195 220 295 232 365", "M248 125 C260 195 260 295 248 365"),
  "drawing-animal-snail": complete("M300 170 C395 230 335 365 225 315 C145 280 175 180 255 190 C320 200 315 280 260 282 C225 282 218 240 245 225"),
  "drawing-nature-tree": complete("M218 405 V235 M262 405 V235", "M240 235 L165 155 M240 235 L315 155"),
  "drawing-nature-flower": complete("M240 250 V415", "M240 170 A45 45 0 1 1 239.9 170 Z"),
  "drawing-nature-leaf": complete("M240 85 V400", "M240 85 C105 155 105 335 240 400"),
  "drawing-nature-cloud-rain": complete("M95 220 C45 205 55 145 110 145 C110 75 205 65 235 120 C285 65 370 105 360 160 C420 150 440 225 380 230 H95 Z"),
  "drawing-nature-rainbow": complete("M90 350 C90 120 390 120 390 350"),
  "drawing-face-happy": complete("M240 90 C390 90 390 390 240 390 C90 390 90 90 240 90 Z"),
  "drawing-face-surprised": complete("M240 100 C385 100 395 375 240 390 C85 375 95 100 240 100 Z"),
  "drawing-face-hair": complete("M240 105 C375 105 385 370 240 385 C95 370 105 105 240 105 Z", "M105 220 Q80 245 105 270 M375 220 Q400 245 375 270"),
  "drawing-person-stick": complete("M240 105 A45 45 0 1 1 239.9 105 Z", "M240 195 V325"),
  "drawing-people-friends": complete("M165 145 A36 36 0 1 1 164.9 145 Z", "M165 215 V345", "M315 125 A46 46 0 1 1 314.9 125 Z", "M315 220 V365"),
  "drawing-scene-park": complete("M65 370 Q240 345 415 370", "M330 105 A42 42 0 1 1 329.9 105 Z"),
  "drawing-scene-beach": complete("M60 235 H420", "M60 315 Q105 285 150 315 T240 315 T330 315 T420 315"),
  "drawing-scene-road": complete("M75 420 L205 235", "M405 420 L275 235", "M205 235 H275"),
  "drawing-scene-night": complete("M65 385 Q240 355 415 385", "M315 95 A55 55 0 0 0 355 175 A72 72 0 1 1 315 95"),
  "drawing-scene-garden": complete("M60 390 Q240 350 420 390", "M215 390 Q240 285 265 390"),

  // WS-07 Wave B — structured visual skills.
  "drawing-space-near-far": complete("M70 385 H235", "M310 235 H405"),
  "drawing-space-overlap": complete("M105 315 C70 205 145 120 255 165", "M225 325 C185 220 285 125 385 215"),
  "drawing-space-horizon": complete("M55 245 H425"),
  "drawing-space-path-depth": complete("M85 425 L210 235", "M395 425 L270 235"),
  "drawing-space-window-view": complete("M85 75 H395 V405 H85 Z", "M240 75 V405", "M85 240 H395"),
  "drawing-texture-fur": complete("M95 125 Q240 75 385 125 V365 Q240 415 95 365 Z"),
  "drawing-texture-scales": complete("M95 240 C145 125 330 130 390 240 C330 350 145 355 95 240 Z"),
  "drawing-texture-brick": complete("M80 125 H400 V365 H80 Z", "M80 245 H400"),
  "drawing-texture-grass": complete("M70 350 Q240 325 410 350 V420 H70 Z"),
  "drawing-texture-water": complete("M65 170 Q110 140 155 170 T245 170 T335 170 T425 170", "M65 355 Q110 325 155 355 T245 355 T335 355 T425 355"),
  "drawing-symmetry-butterfly": complete("M240 80 V400", "M240 145 C165 85 100 155 125 240 C150 315 205 305 240 265"),
  "drawing-symmetry-mask": complete("M240 85 V405", "M240 95 C120 95 95 205 125 320 C150 405 220 405 240 385"),
  "drawing-symmetry-flower": complete("M240 85 V395", "M240 180 A45 45 0 0 0 195 225"),
  "drawing-symmetry-robot": complete("M240 70 V420", "M240 125 H145 V315 H240"),
  "drawing-symmetry-kite": complete("M240 65 V390", "M240 65 L115 215 L240 390"),
  "drawing-story-seed-sprout": complete("M55 370 H205", "M275 370 H425", "M240 80 V420"),
  "drawing-story-rain-sun": complete("M240 70 V410", "M55 365 H205", "M275 365 H425"),
  "drawing-story-ball-roll": complete("M85 330 Q185 265 285 320 T415 280"),
  "drawing-story-build-house": complete("M55 385 H155 M185 385 H295 M325 385 H425", "M240 80 V420"),
  "drawing-story-friend-wave": complete("M165 125 A38 38 0 1 1 164.9 125 Z", "M165 205 V345", "M315 125 A38 38 0 1 1 314.9 125 Z", "M315 205 V345"),
  "drawing-focus-big-small": complete("M150 140 A90 90 0 1 1 149.9 140 Z", "M350 275 A38 38 0 1 1 349.9 275 Z"),
  "drawing-focus-center-side": complete("M240 170 A70 70 0 1 1 239.9 170 Z", "M385 310 A30 30 0 1 1 384.9 310 Z"),
  "drawing-focus-frame": complete("M75 75 H405 V405 H75 Z", "M120 120 H360 V360 H120 Z"),
  "drawing-focus-path": complete("M65 415 C140 330 175 315 240 275 C305 235 345 180 410 95", "M390 75 A28 28 0 1 1 389.9 75 Z"),
  "drawing-focus-crowd": complete("M105 170 A26 26 0 1 1 104.9 170 Z", "M180 260 A24 24 0 1 1 179.9 260 Z", "M255 145 A48 48 0 1 1 254.9 145 Z", "M345 255 A25 25 0 1 1 344.9 255 Z", "M395 150 A22 22 0 1 1 394.9 150 Z"),

  // WS-07 final wave — sparse creativity-preserving anchors. These guides
  // define only workspace, construction zones, axes, or map/design containers.
  // They deliberately avoid supplying the requested invention, identity, symbol,
  // story content, or capstone answer.
  "drawing-invent-flying-car": complete("M105 205 Q240 150 375 205", "M105 305 Q240 360 375 305"),
  "drawing-invent-helper-robot": complete("M240 90 V390", "M145 210 H335"),
  "drawing-invent-fantasy-house": complete("M70 385 H410", "M155 160 H325 V350 H155 Z"),
  "drawing-invent-animal-mix": complete("M125 235 A75 55 0 1 1 124.9 235 Z", "M300 270 A110 80 0 1 1 299.9 270 Z"),
  "drawing-invent-playground": complete("M65 390 H415", "M95 150 H185 V300 H95 Z", "M215 115 H305 V300 H215 Z", "M335 175 H405 V300 H335 Z"),

  "drawing-character-hat": complete("M240 130 A85 85 0 1 1 239.9 130 Z"),
  "drawing-character-job": complete("M240 85 V395", "M160 205 H320"),
  "drawing-character-emotion": complete("M240 100 C385 100 390 380 240 390 C90 380 95 100 240 100 Z"),
  "drawing-character-pet": complete("M165 150 A55 55 0 1 1 164.9 150 Z", "M315 245 A70 55 0 1 1 314.9 245 Z"),
  "drawing-character-costume": complete("M240 80 V405", "M135 185 H345", "M165 385 H315"),

  "drawing-map-bedroom": complete("M70 70 H410 V410 H70 Z", "M120 125 A28 28 0 1 1 119.9 125 Z", "M355 145 A24 24 0 1 1 354.9 145 Z", "M285 350 A26 26 0 1 1 284.9 350 Z"),
  "drawing-map-playground": complete("M70 80 H410 V400 H70 Z", "M105 335 Q190 245 275 300 T395 170"),
  "drawing-map-treasure": complete("M90 365 C145 300 115 230 195 210 S300 245 375 120", "M90 365 A18 18 0 1 1 89.9 365 Z", "M375 120 A22 22 0 1 1 374.9 120 Z"),
  "drawing-map-island": complete("M105 295 C80 195 165 105 270 115 C385 125 415 235 350 330 C285 405 135 380 105 295 Z"),
  "drawing-map-space-base": complete("M115 150 A35 35 0 1 1 114.9 150 Z", "M345 145 A35 35 0 1 1 344.9 145 Z", "M240 340 A45 45 0 1 1 239.9 340 Z", "M145 170 L215 310 M315 170 L265 310"),

  "drawing-design-badge": complete("M240 85 A150 150 0 1 1 239.9 85 Z", "M155 365 L190 420 M325 365 L290 420"),
  "drawing-design-flag": complete("M115 75 V420", "M115 90 H390 V265 H115"),
  "drawing-design-book-cover": complete("M105 65 H375 V415 H105 Z", "M135 105 H345 V175 H135"),
  "drawing-design-sign": complete("M100 100 H380 V295 H100 Z", "M225 295 V420 M255 295 V420"),
  "drawing-design-poster": complete("M80 60 H400 V420 H80 Z", "M120 105 H360 V185 H120", "M120 225 H360 V375 H120"),

  "drawing-capstone-favorite-place": complete("M60 365 H420", "M105 285 A28 28 0 1 1 104.9 285 Z", "M365 250 A24 24 0 1 1 364.9 250 Z"),
  "drawing-capstone-new-creature": complete("M180 190 A65 55 0 1 1 179.9 190 Z", "M285 285 A105 80 0 1 1 284.9 285 Z"),
  "drawing-capstone-machine": complete("M105 140 H205 V240 H105 Z", "M275 105 H385 V215 H275 Z", "M185 305 H305 V405 H185 Z", "M205 190 L275 160 M155 240 L225 305 M330 215 L265 305"),
  "drawing-capstone-mini-story": complete("M70 390 H410", "M105 320 Q240 250 375 320"),
  "drawing-capstone-free-studio": complete("M70 115 H110 M70 115 V155", "M410 115 H370 M410 115 V155", "M70 365 H110 M70 365 V325", "M410 365 H370 M410 365 V325")
};

export const DRAWING_GUIDE_IDS = Object.keys(guides);
export function drawingGuide(activityId: string): DrawingGuide | undefined {
  return guides[activityId];
}
