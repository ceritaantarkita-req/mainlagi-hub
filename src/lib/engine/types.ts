export type PlayerId = "A" | "B";
export type PlayerCount = 1 | 2;
export interface Point { x: number; y: number; t?: number }
export interface Stroke { id: string; points: Point[]; startedAt: number; endedAt: number }
export interface GlyphInput { strokes: Stroke[]; submittedAt: number | null }
export interface RecognitionResult<T> { value: T | null; confidence: number; accepted: boolean; reason?: string }
export type BodyAction = "left" | "right" | "jump" | "crouch" | "forward" | "back" | "center";
