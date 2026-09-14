"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { completeActivity, getActivity, type LearningActivity } from "@/lib/learning/system";
import { coloringScene } from "@/lib/learning/coloringScenes";
import { drawingGuide } from "@/lib/learning/drawingGuides";
import { DrawingScaffold } from "./DrawingScaffold";
import { speakWithStatus, unlockAudio } from "@/lib/audio/feedback";
import { useLearningProgress } from "./LearningCommon";
import { ArrowCounterClockwise, ArrowUUpLeft, Check, Eye, EyeSlash } from "@phosphor-icons/react";
import { GardenActivityFrame } from "./GardenActivityFrame";
import ui from "./Playroom.module.css";
import styles from "./CreativeStudio.module.css";

const PALETTE = [
  {name:"Merah",hex:"#e46c49"},{name:"Kuning",hex:"#ffca49"},
  {name:"Hijau kebiruan",hex:"#218d86"},{name:"Biru",hex:"#7cb9dd"},
  {name:"Hijau",hex:"#92bc7e"},{name:"Ungu",hex:"#aa91ce"},
  {name:"Cokelat",hex:"#966647"},{name:"Hitam",hex:"#233831"},
  {name:"Putih",hex:"#ffffff"},{name:"Merah muda",hex:"#ef9bb4"}
];
function Palette({color,onChange}:{color:string;onChange:(color:string)=>void}) {
  return <div className={styles.palette} role="group" aria-label="Palet warna">{PALETTE.map(item=>
    <button key={item.hex} type="button" className={styles.swatch} style={{background:item.hex}}
      onClick={()=>onChange(item.hex)} aria-label={item.name} aria-pressed={color===item.hex}
      title={item.name}><span>{color===item.hex ? "✓" : ""}</span></button>
  )}</div>;
}
type Point={x:number;y:number};
type Stroke={color:string;points:Point[]};

function DrawingCanvas({activity,onDone}:{activity:LearningActivity;onDone:()=>void}) {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const active=useRef<Stroke|null>(null);
  const [strokes,setStrokes]=useState<Stroke[]>([]);
  const [color,setColor]=useState(PALETTE[0].hex);
  const [guide,setGuide]=useState(true);
  const render=()=>{
    const canvas=canvasRef.current;
    const context=canvas?.getContext("2d");
    if(!canvas || !context) return;
    context.clearRect(0,0,canvas.width,canvas.height);
    for(const stroke of [...strokes,...(active.current ? [active.current]:[])]) {
      if(!stroke.points.length) continue;
      context.beginPath();
      context.strokeStyle=stroke.color;
      context.fillStyle=stroke.color;
      context.lineWidth=9;
      context.lineCap="round";
      context.lineJoin="round";
      const first=stroke.points[0];
      context.moveTo(first.x,first.y);
      for(const point of stroke.points.slice(1)) context.lineTo(point.x,point.y);
      context.stroke();
      if(stroke.points.length===1){context.beginPath();context.arc(first.x,first.y,4.5,0,Math.PI*2);context.fill();}
    }
  };
  useEffect(render,[strokes]);
  const point=(event:ReactPointerEvent<HTMLCanvasElement>):Point=>{
    const rect=event.currentTarget.getBoundingClientRect();
    return {x:(event.clientX-rect.left)*480/rect.width,y:(event.clientY-rect.top)*480/rect.height};
  };
  const start=(event:ReactPointerEvent<HTMLCanvasElement>)=>{
    if(!event.isPrimary || event.button!==0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    active.current={color,points:[point(event)]};
    render();
  };
  const move=(event:ReactPointerEvent<HTMLCanvasElement>)=>{
    if(!active.current || !event.isPrimary) return;
    const next=point(event),last=active.current.points.at(-1)!;
    if(Math.hypot(next.x-last.x,next.y-last.y)<2) return;
    active.current.points.push(next);
    render();
  };
  const end=(event:ReactPointerEvent<HTMLCanvasElement>)=>{
    if(!active.current || !event.isPrimary) return;
    const stroke=active.current;active.current=null;
    setStrokes(previous=>[...previous,stroke]);
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
  };
  // Symbols remain visual guides; sentences are readable instructions outside
  // the canvas, never oversized text layered across the child's drawing.
  const symbolGuide=activity.drawingGuide && activity.drawingGuide.length<=16;
  const scaffold=drawingGuide(activity.id);
  const hasVisualGuide=Boolean(scaffold || symbolGuide);
  return <div className={styles.workbench}>
    <div className={styles.paper}>
      {guide && scaffold ? <DrawingScaffold guide={scaffold} className={styles.scaffold}/> : guide && symbolGuide ? <span className={styles.guide} aria-hidden>{activity.drawingGuide}</span>:null}
      <canvas ref={canvasRef} width={480} height={480} className={styles.canvas}
        onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}
        aria-label="Kanvas menggambar" />
    </div>
    <aside className={styles.tools} aria-label="Alat menggambar">
    {!hasVisualGuide && activity.drawingGuide ? <p className={styles.hint}>{activity.drawingGuide}</p>:null}
    <Palette color={color} onChange={setColor}/>
    <div className={styles.actions}>
      <button className={ui.secondary} disabled={!strokes.length} onClick={()=>setStrokes(current=>current.slice(0,-1))}><ArrowUUpLeft size={24} aria-hidden/>Urungkan</button>
      <button className={ui.secondary} disabled={!strokes.length} onClick={()=>setStrokes([])}><ArrowCounterClockwise size={24} aria-hidden/>Mulai ulang</button>
      {hasVisualGuide ? <button className={ui.secondary} aria-pressed={guide} onClick={()=>setGuide(!guide)}>{guide ? <EyeSlash size={24} aria-hidden/>:<Eye size={24} aria-hidden/>}{guide ? "Sembunyikan panduan":"Lihat panduan"}</button>:null}
      <button className={ui.primary} disabled={!strokes.length} onClick={onDone}><Check size={24} weight="bold" aria-hidden/>Selesai</button>
    </div>
    </aside>
  </div>;
}

function ColoringRegions({activity,onDone}:{activity:LearningActivity;onDone:()=>void}) {
  const regions=useMemo(()=>coloringScene(activity.id),[activity.id]);
  const svgRef=useRef<SVGSVGElement>(null);
  const pathRefs=useRef<(SVGPathElement|null)[]>([]);
  const [hitAreas,setHitAreas]=useState<{x:number;y:number;width:number;height:number}[]>([]);
  const [color,setColor]=useState(PALETTE[0].hex);
  const [history,setHistory]=useState<Record<number,string>[]>([{}]);
  const fills=history.at(-1)!;
  const paint=(index:number)=>{
    if(fills[index]===color) return;
    setHistory(previous=>[...previous,{...previous.at(-1),[index]:color}]);
  };
  useLayoutEffect(()=>{
    const svg=svgRef.current;
    if(!svg) return;
    const measure=()=>setHitAreas(pathRefs.current.map(path=>{
      if(!path) return {x:0,y:0,width:0,height:0};
      const bounds=path.getBBox();
      const matrix=path.getScreenCTM();
      const scaleX=matrix ? Math.hypot(matrix.a,matrix.b) : 1;
      const scaleY=matrix ? Math.hypot(matrix.c,matrix.d) : 1;
      const width=Math.max(bounds.width,44/Math.max(scaleX,0.001));
      const height=Math.max(bounds.height,44/Math.max(scaleY,0.001));
      return {x:bounds.x-(width-bounds.width)/2,y:bounds.y-(height-bounds.height)/2,width,height};
    }));
    measure();
    const observer=new ResizeObserver(measure);
    observer.observe(svg);
    return ()=>observer.disconnect();
  },[regions]);
  return <div className={styles.workbench}>
    <div className={styles.paper}>
      <svg ref={svgRef} viewBox="0 0 480 480" className={styles.illustration} aria-label={`Gambar untuk diwarnai: ${activity.title}`}>
        <title>{activity.title}</title>
        {regions.map((region,index)=><g key={index} transform={region.transform}
          role="button" tabIndex={0} aria-label={`Warnai ${region.name.toLowerCase()}`}
          data-color-region={index} data-color-filled={Boolean(fills[index])}
          onClick={()=>paint(index)} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();paint(index);}}}>
          {hitAreas[index]?.width ? <rect className={styles.regionHitArea} aria-hidden="true" {...hitAreas[index]}/>:null}
          <path d={region.path} fill={fills[index]??"#ffffff"} stroke="#233831" strokeWidth={4} strokeLinejoin="round" strokeLinecap="round"/>
        </g>)}
      </svg>
    </div>
    <aside className={styles.tools} aria-label="Alat mewarnai">
    <Palette color={color} onChange={setColor}/>
    <div className={styles.actions}>
      <button className={ui.secondary} disabled={history.length<2} onClick={()=>setHistory(previous=>previous.slice(0,-1))}><ArrowUUpLeft size={24} aria-hidden/>Urungkan</button>
      <button className={ui.secondary} disabled={!Object.keys(fills).length} onClick={()=>setHistory(previous=>[...previous,{}])}><ArrowCounterClockwise size={24} aria-hidden/>Mulai ulang</button>
      <button className={ui.primary} disabled={!Object.keys(fills).length} onClick={onDone}><Check size={24} weight="bold" aria-hidden/>Selesai</button>
    </div>
    </aside>
  </div>;
}

export function CreativePracticeActivity({childId,activityId}:{childId:string;activityId:string}) {
  const activity=getActivity(activityId);
  const progress=useLearningProgress(childId);
  const [completedId,setCompletedId]=useState<string|null>(null);
  const [audioError,setAudioError]=useState(false);
  if(!activity || !["drawing","coloring"].includes(activity.runtime))return <main className={ui.page}>Aktivitas kreatif tidak ditemukan.</main>;
  const prompt=activity.creativePrompt??activity.title;
  const finish=()=>{completeActivity(childId,activity.id);setCompletedId(activity.id);};
  const done=completedId===activity.id||progress.completedActivityIds.includes(activity.id);
  return <GardenActivityFrame workspace backHref={`/child/${childId}/subject/${activity.subjectId}`} title={activity.title} onHear={()=>{unlockAudio();const status=speakWithStatus(prompt);setAudioError(status!=="spoken");}}>
    {activity.runtime==="drawing" && prompt!==activity.title ? <p className={styles.prompt}>{prompt}</p>:null}
    {activity.runtime==="coloring" ? <p className={styles.hint}>Pilih warna. Sentuh gambarnya.</p>:null}
    {audioError ? <p role="status">Narasi dengan pelafalan yang sesuai belum tersedia atau suara sedang dimatikan. Petunjuk tetap bisa dibaca di atas.</p>:null}
    {activity.runtime==="drawing" ? <DrawingCanvas key={activity.id} activity={activity} onDone={finish}/>:<ColoringRegions key={activity.id} activity={activity} onDone={finish}/>}
    {done ? <div className={styles.completed} role="status"><strong>Karyamu selesai. Hebat!</strong><span>Kamu boleh terus berkarya atau memilih permainan lain.</span><Link href={`/child/${childId}/subject/${activity.subjectId}`} className={ui.secondary}>Pilih permainan lain</Link></div>:null}
  </GardenActivityFrame>;
}
