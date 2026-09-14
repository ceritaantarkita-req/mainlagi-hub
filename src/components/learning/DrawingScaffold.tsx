import type { DrawingGuide } from "@/lib/learning/drawingGuides";

/** Non-interactive guidance below the drawing canvas, never a painted stroke. */
export function DrawingScaffold({ guide, className }: { guide: DrawingGuide; className?: string }) {
  return <svg viewBox="0 0 480 480" className={className} aria-hidden="true" data-drawing-guide={guide.mode}>
    {guide.paths.map((d,i)=><path key={i} d={d} fill="none"
      stroke={guide.mode==="complete" ? "#769b96" : "#bbcfc9"}
      strokeWidth={guide.mode==="dots" ? 3 : 7}
      strokeDasharray={guide.mode==="dots" ? "5 12" : guide.mode==="trace" ? "10 13" : undefined}
      strokeLinecap="round" strokeLinejoin="round"/>)}
    {guide.dots?.map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={i===0 ? 10 : 7} fill={i===0 ? "#df704f" : "#438781"} stroke="#fff" strokeWidth={3}/>)}
  </svg>;
}
