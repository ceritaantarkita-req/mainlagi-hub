"use client";

import { useEffect, useRef } from "react";
import type { VisionSnapshot } from "@/lib/vision/types";

const HAND_CONNECTIONS: Array<[number, number]> = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];
const POSE_CONNECTIONS: Array<[number, number]> = [[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[23,25],[25,27],[24,26],[26,28]];

export function VisionOverlay({ snapshot, showSkeleton = true }: { snapshot: VisionSnapshot; showSkeleton?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return; const rect = canvas.getBoundingClientRect(); const dpr = Math.min(2, window.devicePixelRatio || 1); canvas.width = Math.max(1, Math.round(rect.width * dpr)); canvas.height = Math.max(1, Math.round(rect.height * dpr)); const context = canvas.getContext("2d"); if (!context) return; context.scale(dpr, dpr); context.clearRect(0, 0, rect.width, rect.height); if (!showSkeleton) return;
    const draw = (landmarks: readonly { x: number; y: number }[], connections: Array<[number, number]>, color: string) => { context.strokeStyle = color; context.lineWidth = 3; context.lineCap = "round"; for (const [a,b] of connections) { const first = landmarks[a]; const second = landmarks[b]; if (!first || !second) continue; context.beginPath(); context.moveTo((1-first.x)*rect.width, first.y*rect.height); context.lineTo((1-second.x)*rect.width, second.y*rect.height); context.stroke(); } context.fillStyle = color; for (const point of landmarks) { context.beginPath(); context.arc((1-point.x)*rect.width, point.y*rect.height, 3, 0, Math.PI*2); context.fill(); } };
    for (const body of snapshot.bodies) draw(body.landmarks, POSE_CONNECTIONS, body.player === "A" ? "#5CA8FF" : "#FF73B6");
    for (const hand of snapshot.hands) draw(hand.landmarks, HAND_CONNECTIONS, hand.player === "A" ? "#73D6FF" : "#FF9ACB");
  }, [showSkeleton, snapshot]);
  return <canvas className="vision-overlay" ref={canvasRef} aria-hidden />;
}
