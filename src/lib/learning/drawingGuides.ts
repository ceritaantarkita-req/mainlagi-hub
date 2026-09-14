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
  "drawing-compose-rain-lines": complete("M100 205 C50 190 55 125 110 125 C105 55 205 45 235 95 C285 40 370 80 360 135 C425 125 440 200 380 210 H100 Z"),
  "drawing-compose-road-path": complete("M180 130 L240 80 L300 130 V200 H180 Z", "M225 200 V160 H255 V200", "M90 415 H150 M330 415 H390"),

  // WS-07 Wave A — concrete objects from simple starter shapes.
  "drawing-object-cup": complete("M145 150 H315 V330 Q315 395 230 395 Q145 395 145 330 Z"),
  "drawing-object-boat": complete("M95 295 H385 L330 365 H150 Z", "M240 135 V295"),
  "drawing-object-house": complete("M135 220 H345 V395 H135 Z"),
  "drawing-object-car": complete("M105 255 H355 L405 315 V355 H80 V315 Z"),
  "drawing-object-icecream": complete("M170 235 L240 415 L310 235 Z"),

  // Simple animals — one structural body cue, leaving recognizable details to the child.
  "drawing-animal-cat": complete("M145 235 C145 125 335 125 335 235 C335 340 145 340 145 235 Z"),
  "drawing-animal-fish": complete("M85 245 C145 125 325 135 370 240 C325 350 145 355 85 245 Z"),
  "drawing-animal-bird": complete("M135 270 C135 155 300 145 330 255 C335 345 180 375 135 270 Z"),
  "drawing-animal-butterfly": complete("M232 125 C220 195 220 295 232 365", "M248 125 C260 195 260 295 248 365"),
  "drawing-animal-snail": complete("M300 170 C395 230 335 365 225 315 C145 280 175 180 255 190 C320 200 315 280 260 282 C225 282 218 240 245 225"),

  // Nature — starter structure only; foliage, petals, rain, and extra bands stay child-authored.
  "drawing-nature-tree": complete("M218 405 V235 M262 405 V235", "M240 235 L165 155 M240 235 L315 155"),
  "drawing-nature-flower": complete("M240 250 V415", "M240 170 A45 45 0 1 1 239.9 170 Z"),
  "drawing-nature-leaf": complete("M240 85 V400", "M240 85 C105 155 105 335 240 400"),
  "drawing-nature-cloud-rain": complete("M95 220 C45 205 55 145 110 145 C110 75 205 65 235 120 C285 65 370 105 360 160 C420 150 440 225 380 230 H95 Z"),
  "drawing-nature-rainbow": complete("M90 350 C90 120 390 120 390 350"),

  // Faces and people — proportion anchors, not finished characters.
  "drawing-face-happy": complete("M240 90 C390 90 390 390 240 390 C90 390 90 90 240 90 Z"),
  "drawing-face-surprised": complete("M240 90 C390 90 390 390 240 390 C90 390 90 90 240 90 Z", "M185 205 A12 12 0 1 1 184.9 205 Z M295 205 A12 12 0 1 1 294.9 205 Z"),
  "drawing-face-hair": complete("M240 105 C375 105 385 370 240 385 C95 370 105 105 240 105 Z", "M145 175 Q240 85 335 175"),
  "drawing-person-stick": complete("M240 105 A45 45 0 1 1 239.9 105 Z", "M240 195 V325"),
  "drawing-people-friends": complete("M165 145 A36 36 0 1 1 164.9 145 Z", "M165 215 V345", "M315 125 A46 46 0 1 1 314.9 125 Z", "M315 220 V365"),

  // Simple scenes — composition anchors that leave the content itself open.
  "drawing-scene-park": complete("M65 370 Q240 345 415 370", "M330 105 A42 42 0 1 1 329.9 105 Z"),
  "drawing-scene-beach": complete("M60 235 H420", "M60 315 Q105 285 150 315 T240 315 T330 315 T420 315"),
  "drawing-scene-road": complete("M75 420 L205 235", "M405 420 L275 235", "M205 235 H275"),
  "drawing-scene-night": complete("M65 385 Q240 355 415 385", "M315 95 A55 55 0 0 0 355 175 A72 72 0 1 1 315 95"),
  "drawing-scene-garden": complete("M60 390 Q240 350 420 390", "M215 390 Q240 285 265 390")
};

export const DRAWING_GUIDE_IDS = Object.keys(guides);
export function drawingGuide(activityId: string): DrawingGuide | undefined {
  return guides[activityId];
}
