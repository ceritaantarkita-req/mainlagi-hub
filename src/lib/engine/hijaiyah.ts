import { bounds, scorePath } from "./geometry";
import type { Point, Stroke } from "./types";

export interface HijaiyahTemplate { letter: string; latin: string; body: Point[]; dots: number; dotZone: "above" | "below" | "none" }
const p = (values: Array<[number,number]>): Point[] => values.map(([x,y])=>({x,y}));
const ALIF = p([[.55,.12],[.52,.88]]);
const BOWL = p([[.88,.45],[.78,.7],[.55,.8],[.3,.78],[.14,.62],[.2,.5]]);
const CURVE = p([[.82,.28],[.62,.2],[.4,.28],[.55,.44],[.72,.55],[.6,.76],[.35,.83],[.18,.7]]);
const DAL = p([[.72,.3],[.55,.26],[.43,.39],[.52,.54],[.72,.58]]);
const RA = p([[.68,.32],[.62,.55],[.45,.72],[.26,.78]]);
const SIN = p([[.9,.56],[.78,.42],[.67,.57],[.55,.42],[.44,.6],[.25,.67],[.12,.55]]);
export const HIJAIYAH_TEMPLATES: HijaiyahTemplate[] = [
  {letter:"ا",latin:"Alif",body:ALIF,dots:0,dotZone:"none"},
  {letter:"ب",latin:"Ba",body:BOWL,dots:1,dotZone:"below"},
  {letter:"ت",latin:"Ta",body:BOWL,dots:2,dotZone:"above"},
  {letter:"ث",latin:"Tsa",body:BOWL,dots:3,dotZone:"above"},
  {letter:"ن",latin:"Nun",body:BOWL,dots:1,dotZone:"above"},
  {letter:"ج",latin:"Jim",body:CURVE,dots:1,dotZone:"below"},
  {letter:"ح",latin:"Ha",body:CURVE,dots:0,dotZone:"none"},
  {letter:"خ",latin:"Kha",body:CURVE,dots:1,dotZone:"above"},
  {letter:"د",latin:"Dal",body:DAL,dots:0,dotZone:"none"},
  {letter:"ذ",latin:"Dzal",body:DAL,dots:1,dotZone:"above"},
  {letter:"ر",latin:"Ra",body:RA,dots:0,dotZone:"none"},
  {letter:"ز",latin:"Zai",body:RA,dots:1,dotZone:"above"},
  {letter:"س",latin:"Sin",body:SIN,dots:0,dotZone:"none"},
  {letter:"ش",latin:"Syin",body:SIN,dots:3,dotZone:"above"}
];
export function evaluateHijaiyah(strokes: readonly Stroke[], template: HijaiyahTemplate) {
  const sorted = [...strokes].sort((a,b)=>b.points.length-a.points.length); const bodyStroke = sorted[0]; if (!bodyStroke) return {score:0,bodyScore:0,dots:0,dotZone:"none" as const,accepted:false,reason:"Belum ada stroke."}; const dotStrokes = sorted.slice(1).filter((stroke)=>stroke.points.length <= 18 || bounds(stroke.points).width + bounds(stroke.points).height < .18); const bodyScore = scorePath(bodyStroke.points,template.body); let dotZone: "above"|"below"|"none" = "none"; if (dotStrokes.length) { const bodyBox = bounds(bodyStroke.points); const dotY = dotStrokes.flatMap((stroke)=>stroke.points).reduce((sum,point)=>sum+point.y,0)/Math.max(1,dotStrokes.flatMap((stroke)=>stroke.points).length); dotZone = dotY < bodyBox.minY + bodyBox.height*.4 ? "above" : "below"; }
  const dotCountScore = template.dots === dotStrokes.length ? 100 : Math.max(0,100-Math.abs(template.dots-dotStrokes.length)*35); const zoneScore = template.dotZone === "none" ? 100 : dotZone === template.dotZone ? 100 : 25; const score = Math.round(bodyScore*.62+dotCountScore*.25+zoneScore*.13); return {score,bodyScore,dots:dotStrokes.length,dotZone,accepted:score>=62,reason:score>=62?undefined:`Bentuk ${bodyScore}%, titik ${dotStrokes.length}/${template.dots}, posisi ${dotZone}.`};
}
