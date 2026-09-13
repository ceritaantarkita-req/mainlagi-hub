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
  "drawing-compose-road-path": complete("M180 130 L240 80 L300 130 V200 H180 Z", "M225 200 V160 H255 V200", "M90 415 H150 M330 415 H390")
};

export const DRAWING_GUIDE_IDS = Object.keys(guides);
export function drawingGuide(activityId: string): DrawingGuide | undefined {
  return guides[activityId];
}
