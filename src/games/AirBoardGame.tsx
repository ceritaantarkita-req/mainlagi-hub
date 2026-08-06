/* eslint-disable @next/next/no-img-element, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Point } from "@/lib/engine/types";
import type { GameModuleProps } from "./types";
import { VisionOverlay } from "@/components/VisionOverlay";

interface BoardStroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
  opacity: number;
  tool: "pen" | "highlighter";
}

type Tool = "pointer" | "pen" | "highlighter" | "eraser";

const DEMO_SLIDES = [
  {
    title: "Selamat datang di AirBoard",
    body: "Gunakan pinch untuk menulis dan tombol toolbar untuk berpindah alat."
  },
  {
    title: "Belajar tanpa menyentuh layar",
    body: "Pointer, pena, highlighter, penghapus, undo, dan ekspor berada di satu workspace."
  },
  {
    title: "Mainlagi TV",
    body: "Satu Motion Learning Hub untuk kelas, rumah, dan aktivitas keluarga."
  }
];

function path(points: readonly Point[]) {
  return points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x * 1000} ${point.y * 650}`
    )
    .join(" ");
}

export function AirBoardGame({ bindVideo, snapshot }: GameModuleProps) {
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#2676ff");
  const [strokes, setStrokes] = useState<BoardStroke[]>([]);
  const [, setRedo] = useState<BoardStroke[]>([]);
  const [active, setActive] = useState<BoardStroke | null>(null);
  const [slide, setSlide] = useState(0);
  const [asset, setAsset] = useState<{ url: string; type: string } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pointerRef = useRef<number | null>(null);
  const cameraDrawingRef = useRef(false);
  const hand = useMemo(
    () => snapshot.hands.find((item) => item.player === "A"),
    [snapshot.hands]
  );

  useEffect(
    () => () => {
      if (asset) URL.revokeObjectURL(asset.url);
    },
    [asset]
  );

  const pointFromClient = (x: number, y: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: Math.max(0, Math.min(1, (x - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (y - rect.top) / rect.height)),
      t: performance.now()
    };
  };

  const startStroke = (point: Point) => {
    if (tool === "pointer") return;
    if (tool === "eraser") {
      setStrokes((current) =>
        current.filter(
          (stroke) =>
            !stroke.points.some(
              (item) => Math.hypot(item.x - point.x, item.y - point.y) < 0.06
            )
        )
      );
      return;
    }
    setActive({
      id: `air-${Date.now()}`,
      points: [point],
      color,
      width: tool === "highlighter" ? 28 : 8,
      opacity: tool === "highlighter" ? 0.28 : 1,
      tool
    });
  };

  const append = (point: Point) =>
    setActive((current) =>
      current
        ? { ...current, points: [...current.points.slice(-599), point] }
        : current
    );

  const finish = () =>
    setActive((current) => {
      if (current && current.points.length > 1) {
        setStrokes((items) => [...items, current]);
        setRedo([]);
      }
      return null;
    });

  useEffect(() => {
    if (!hand) return;
    const point = { x: hand.point.x, y: hand.point.y, t: performance.now() };

    if (hand.gesture === "fist") {
      setTool("eraser");
      cameraDrawingRef.current = false;
      return;
    }

    if (hand.gesture === "pinch") {
      if (!cameraDrawingRef.current) {
        cameraDrawingRef.current = true;
        startStroke(point);
      } else {
        append(point);
      }
    } else if (cameraDrawingRef.current) {
      cameraDrawingRef.current = false;
      finish();
    }
  }, [hand, tool, color]);

  const undo = () =>
    setStrokes((current) => {
      const last = current[current.length - 1];
      if (last) setRedo((items) => [last, ...items]);
      return current.slice(0, -1);
    });

  const redoAction = () =>
    setRedo((current) => {
      const first = current[0];
      if (first) setStrokes((items) => [...items, first]);
      return current.slice(1);
    });

  const exportJson = () => {
    const blob = new Blob(
      [JSON.stringify({ version: 1, slide, strokes }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "airboard-annotations.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const onFile = (file?: File) => {
    if (!file) return;
    if (asset) URL.revokeObjectURL(asset.url);
    setAsset({ url: URL.createObjectURL(file), type: file.type });
    setStrokes([]);
  };

  const selectSlide = (index: number) => {
    if (asset) URL.revokeObjectURL(asset.url);
    setAsset(null);
    setSlide(index);
    setStrokes([]);
  };

  return (
    <main className="airboard-page">
      <header className="airboard-toolbar">
        <div className="airboard-title">
          <span>AIRBOARD</span>
          <small>Presenter workspace</small>
        </div>
        <div className="tool-group">
          {(["pointer", "pen", "highlighter", "eraser"] as Tool[]).map(
            (item) => (
              <button
                key={item}
                className={tool === item ? "is-active" : ""}
                onClick={() => setTool(item)}
              >
                {item}
              </button>
            )
          )}
        </div>
        <div className="tool-group colors">
          {["#2676ff", "#f04f72", "#18a56e", "#101b34"].map((item) => (
            <button
              key={item}
              className={color === item ? "is-active" : ""}
              style={{ background: item }}
              onClick={() => setColor(item)}
              aria-label={`Warna ${item}`}
            />
          ))}
        </div>
        <div className="tool-group">
          <button onClick={undo}>Undo</button>
          <button onClick={redoAction}>Redo</button>
          <button onClick={() => setStrokes([])}>Clear</button>
          <button onClick={exportJson}>Export</button>
          <label className="file-button">
            Buka file
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(event) => onFile(event.target.files?.[0])}
            />
          </label>
        </div>
      </header>

      <section className="airboard-workspace">
        <aside className="slide-rail">
          <strong>SLIDE</strong>
          {DEMO_SLIDES.map((item, index) => (
            <button
              key={item.title}
              className={slide === index && !asset ? "is-active" : ""}
              onClick={() => selectSlide(index)}
            >
              <b>{index + 1}</b>
              <span>{item.title}</span>
            </button>
          ))}
        </aside>

        <div className="board-stage">
          <div className="board-document">
            {asset ? (
              asset.type === "application/pdf" ? (
                <object
                  data={asset.url}
                  type="application/pdf"
                  aria-label="PDF presentasi"
                />
              ) : (
                <img src={asset.url} alt="File presentasi" />
              )
            ) : (
              <div className="demo-slide">
                <span>MAINLAGI TV</span>
                <h1>{DEMO_SLIDES[slide]?.title}</h1>
                <p>{DEMO_SLIDES[slide]?.body}</p>
                <small>
                  {slide + 1} / {DEMO_SLIDES.length}
                </small>
              </div>
            )}
            <svg
              ref={svgRef}
              viewBox="0 0 1000 650"
              preserveAspectRatio="none"
              className={`airboard-canvas tool-${tool}`}
              onPointerDown={(event) => {
                const point = pointFromClient(event.clientX, event.clientY);
                if (!point) return;
                event.currentTarget.setPointerCapture(event.pointerId);
                pointerRef.current = event.pointerId;
                startStroke(point);
              }}
              onPointerMove={(event) => {
                if (pointerRef.current !== event.pointerId) return;
                const point = pointFromClient(event.clientX, event.clientY);
                if (point) append(point);
              }}
              onPointerUp={(event) => {
                if (pointerRef.current !== event.pointerId) return;
                pointerRef.current = null;
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }
                finish();
              }}
            >
              {strokes.map((stroke) => (
                <path
                  key={stroke.id}
                  d={path(stroke.points)}
                  fill="none"
                  stroke={stroke.color}
                  strokeWidth={stroke.width}
                  opacity={stroke.opacity}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {active ? (
                <path
                  d={path(active.points)}
                  fill="none"
                  stroke={active.color}
                  strokeWidth={active.width}
                  opacity={active.opacity}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              ) : null}
              {tool === "pointer" && hand ? (
                <circle
                  cx={hand.point.x * 1000}
                  cy={hand.point.y * 650}
                  r="18"
                  fill="#ff496f"
                  opacity=".8"
                />
              ) : null}
            </svg>
          </div>
          <div className="board-status">
            <span>{tool}</span>
            <span>{strokes.length} stroke</span>
            <span>
              {hand
                ? `${hand.gesture} · ${Math.round(hand.confidence * 100)}%`
                : "mouse/touch"}
            </span>
          </div>
        </div>

        <aside className="camera-mini">
          <video ref={bindVideo} muted playsInline autoPlay />
          <VisionOverlay snapshot={snapshot} />
          <span>Gesture camera</span>
        </aside>
      </section>
    </main>
  );
}
