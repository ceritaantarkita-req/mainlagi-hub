/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { ArrowLeft, Check, Headphones, LockKey, Play, PencilLine, Cards, BookOpen, PersonSimpleRun } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { speakWithStatus, unlockAudio } from "@/lib/audio/feedback";
import type { LearningActivity, LearningProgress, LearningSubject } from "@/lib/learning/system";
import styles from "./ActivityGallery.module.css";
import { drawingGuide } from "@/lib/learning/drawingGuides";

function ActivityPreview({activity}:{activity:LearningActivity}) {
  if(activity.runtime==="coloring" || drawingGuide(activity.id)) return <img src={`/artwork/activity-previews/${activity.id}.webp`} width={480} height={360} alt="" loading="lazy"/>;
  const values = activity.runtime==="matching" ? (activity.matchItems??[]).slice(0,4).map(item=>item.label) : activity.choices?.slice(0,3) ?? [];
  const shortValues=values.every(value=>value.length<=12);
  if(values.length && shortValues) return <div className={styles.taskPreview} data-kind={activity.runtime} aria-hidden>{values.map((value,i)=><span key={i}>{value}</span>)}</div>;
  if(activity.traceGlyph) return <div className={styles.tracePreview} aria-hidden>{activity.traceGlyph}</div>;
  const PreviewIcon=activity.runtime==="drawing" ? PencilLine : activity.runtime==="story" ? BookOpen : activity.runtime==="motion_game" ? PersonSimpleRun : activity.runtime==="matching" ? Cards : activity.runtime==="listen_and_choose" ? Headphones : Play;
  return <div className={styles.picturePreview} aria-hidden><img src={`/artwork/${activity.subjectId==="math" ? "garden-apple" : activity.runtime==="story" ? "garden-gavi" : "garden-paca"}.webp`} width={180} height={180} alt="" loading="lazy"/><PreviewIcon size={42} weight="duotone"/></div>;
}

export function ActivityGallery({childId,subject,activities,progress,openStageIds,age}:{childId:string;subject:LearningSubject;activities:LearningActivity[];progress:LearningProgress;openStageIds:Set<string>;age:number}) {
  const [notice,setNotice]=useState<string|null>(null);
  const noticeRef=useRef<HTMLDialogElement>(null);
  useEffect(()=>{if(notice && !noticeRef.current?.open)noticeRef.current?.showModal();},[notice]);
  return <main className={styles.page}>
    <Link className={styles.back} href={`/child/${childId}/home#choose-subject`}><ArrowLeft size={24} weight="bold" aria-hidden/>Beranda</Link>
    <header className={styles.heading}><div><h1>{subject.id==="english" ? "Bahasa Inggris" : subject.title}</h1><p>Pilih gambar, ayo main!</p></div><span aria-label={`${activities.length} aktivitas`}>{activities.length} permainan</span></header>
    <dialog ref={noticeRef} className={styles.notice} aria-labelledby="activity-availability-title" onClose={()=>setNotice(null)}>
      <h2 id="activity-availability-title">Pilih gambar bertanda main</h2>
      <p>{notice}</p>
      <button type="button" onClick={()=>noticeRef.current?.close()}>Oke, pilih lagi</button>
    </dialog>
    <div className={styles.grid} aria-label={`Semua aktivitas ${subject.title}`} data-activity-gallery>
      {activities.map((activity,index)=>{
        const unlocked=openStageIds.has(activity.stageId);
        const eligible=age>=activity.ageMin && age<=activity.ageMax;
        const playable=unlocked&&eligible;
        const done=progress.completedActivityIds.includes(activity.id);
        const content=<><div className={styles.thumbnail} data-tone={index%5}><ActivityPreview activity={activity}/><span className={styles.playBadge}>{!playable ? <LockKey size={19} weight="fill"/> : done ? <Check size={20} weight="bold"/> : <Play size={18} weight="fill"/>}</span></div><h2>{activity.title}</h2></>;
        return <article className={styles.item} key={activity.id} data-activity-id={activity.id}>
          {playable ? <Link className={styles.card} href={`/child/${childId}/activity/${activity.id}`} aria-label={`${activity.title}${done ? ", sudah dimainkan":""}`}>{content}</Link> : <button type="button" className={styles.card} aria-label={`${activity.title}, ${unlocked ? "untuk usia lain":"belum terbuka"}`} onClick={()=>{const text=unlocked ? `Permainan ini disiapkan untuk usia ${activity.ageMin}–${activity.ageMax} tahun.` : "Permainan ini belum terbuka. Kamu bisa memilih gambar bertanda main.";setNotice(text);unlockAudio();speakWithStatus(text);}}>{content}</button>}
        </article>;
      })}
    </div>
  </main>;
}
