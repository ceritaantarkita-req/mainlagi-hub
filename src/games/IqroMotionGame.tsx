"use client";

import { useMemo, useState } from "react";
import { MotionPad } from "@/components/MotionPad";
import { evaluateHijaiyah, HIJAIYAH_TEMPLATES } from "@/lib/engine/hijaiyah";
import type { Stroke } from "@/lib/engine/types";
import type { GameModuleProps } from "./types";
import { CameraBackdrop, FeedbackToast, GameHud, RoundEndOverlay, useRoundTimer } from "./shared";
import { useProgressSync } from "@/lib/auth/progress";

export function IqroMotionGame(props: GameModuleProps) {
  const [index,setIndex]=useState(0); const [score,setScore]=useState({A:0,B:0}); const [message,setMessage]=useState("Tulis badan huruf, lepaskan pinch, lalu tambahkan titik sebagai stroke baru."); const [tone,setTone]=useState<"neutral"|"good"|"bad">("neutral"); const timer=useRoundTimer(90); const template=HIJAIYAH_TEMPLATES[index]!; const hand=useMemo(()=>props.snapshot.hands.find((item)=>item.player==="A"),[props.snapshot.hands]);
  const submit=(strokes:Stroke[])=>{const result=evaluateHijaiyah(strokes,template); if(result.accepted){setScore((current)=>({...current,A:current.A+result.score}));setTone("good");setMessage(`${template.latin} (${template.letter}) cocok ${result.score}%.`);window.setTimeout(()=>setIndex((value)=>(value+1)%HIJAIYAH_TEMPLATES.length),800);}else{setTone("bad");setMessage(result.reason??"Coba lagi.");timer.addSeconds(2);}};
  const speak=()=>{if(typeof window==="undefined"||!("speechSynthesis" in window))return; const utterance=new SpeechSynthesisUtterance(template.letter);utterance.lang="ar-SA";utterance.rate=.75;window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);};
  useProgressSync(props.game.slug, Math.max(score.A, score.B));
  return <CameraBackdrop inputMode={props.inputMode} bindVideo={props.bindVideo} snapshot={props.snapshot}>
    <GameHud title="Iqro Motion" remaining={timer.remaining} score={score} playerCount={1} paused={timer.paused} onTogglePause={timer.toggle} />
    <div className="iqro-layout"><aside className="iqro-library"><small>14 HURUF MVP</small><div>{HIJAIYAH_TEMPLATES.map((item,itemIndex)=><button key={item.letter} className={itemIndex===index?"is-active":""} onClick={()=>setIndex(itemIndex)}><span>{item.letter}</span><small>{item.latin}</small></button>)}</div><p>Materi ini alat latihan interaktif, bukan pengganti guru mengaji. Bentuk dan audio perlu review pengajar.</p></aside><section className="iqro-practice"><div className="iqro-target"><div><span>{template.letter}</span><small>{template.latin} · {template.dots} titik {template.dotZone==="above"?"di atas":template.dotZone==="below"?"di bawah":""}</small></div><button onClick={speak}>Dengar audio</button></div><div className="iqro-pad-wrap"><div className="iqro-watermark">{template.letter}</div><MotionPad player="A" playerCount={1} hand={hand} enabled={timer.running} target={template.body} label={`Latihan ${template.latin}`} hint="Pinch = stroke · lepas pinch = pen up · telapak terbuka/Kirim = nilai semua stroke" onSubmit={submit}/></div></section></div>
    <FeedbackToast message={message} tone={tone}/>
    {timer.ended ? <RoundEndOverlay score={score} playerCount={1} onReplay={props.onReplay} onCalibration={props.onExit} /> : null}
  </CameraBackdrop>;
}
