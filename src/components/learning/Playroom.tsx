/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { ACTIVITIES, SUBJECTS } from "@/lib/learning/system";
import { rememberChild } from "@/lib/learning/entry";
import { isMuted, setMuted, unlockAudio } from "@/lib/audio/feedback";
import { useLearningProfile } from "./LearningCommon";
import styles from "./Playroom.module.css";
import { LearningSymbol } from "./LearningSymbol";

const SUBJECT_ART: Record<string, { icon?: IconName; label?: string; color: string }> = {
  bahasa: { icon:"book", color:"#ffc6ac" }, english:{icon:"globe",color:"#dbe6c8"},
  math:{label:"123",color:"#ffdb7d"}, iqro:{label:"ا ب",color:"#dbe6c8"},
  letters:{label:"Ab",color:"#fac4c3"}, logic:{icon:"bulb",color:"#b8d8c4"},
  science:{icon:"sprout",color:"#ffdb7d"},color:{icon:"palette",color:"#d0e4ee"},
  drawing:{icon:"pencil",color:"#ffc6ac"}
};

export function SubjectDirectory({ childId }: { childId?: string }) {
  return <div className={styles.subjects}>{SUBJECTS.map(subject => {
    const art=SUBJECT_ART[subject.id];
    const count=ACTIVITIES.filter(activity=>activity.subjectId===subject.id).length;
    return <Link key={subject.id} className={styles.subject} href={childId ? `/child/${childId}/subject/${subject.id}` : `/child/select?continue=1&subject=${subject.id}`}>
      <span aria-hidden className={styles.subjectIcon} style={{"--subject-color":art?.color} as CSSProperties}>
        <LearningSymbol name={subject.id} size={36}/>
      </span>
      <span><strong>{subject.id === "english" ? "Bahasa Inggris" : subject.title}</strong><small>{count} aktivitas</small></span>
    </Link>;
  })}</div>;
}

export function PlayroomShell({childId,children}:{childId?:string;children:ReactNode}) {
  const pathname=usePathname();
  const profile=useLearningProfile(childId ?? "");
  const [muted,updateMuted]=useState(false);
  useEffect(()=>{ if(childId && profile?.id===childId) rememberChild(childId); },[childId,profile]);
  useEffect(()=>{ const frame=requestAnimationFrame(()=>updateMuted(isMuted())); return()=>cancelAnimationFrame(frame); },[]);
  const base=childId ? `/child/${childId}` : "";
  const items=[
    {href:base ? `${base}/home` : "/",label:"Beranda",active:pathname==="/" || pathname===`${base}/home`},
    {href:base ? `${base}/games` : "/games",label:"Main gerak",active:pathname.includes("/games")}
  ];
  return <div className={styles.shell}>
    {!pathname.includes("/activity/") ? <header className={styles.header}>
      <Link href={base ? `${base}/home` : "/"} className={styles.brand}><img src="/artwork/garden-wordmark.webp" alt="Mainlagi" width={600} height={220}/></Link>
      <nav className={styles.nav} aria-label="Navigasi anak">{items.map(item=><Link key={item.label} href={item.href} aria-current={item.active ? "page":undefined}>{item.label}</Link>)}</nav>
      <details className={styles.profile}>
        <summary aria-label="Pengaturan profil"><span className={styles.profileIcon}><Icon name="account" size={22}/></span>{profile?.name ?? "Profil"}</summary>
        <div className={styles.menu}>
          <Link href="/child/select">Ganti profil anak</Link>
          {childId ? <Link href={`${base}/rewards`}>Koleksi bintang</Link> : null}
          <button onClick={()=>{unlockAudio();setMuted(!muted);updateMuted(!muted);}} aria-pressed={muted}>{muted ? "Nyalakan suara" : "Matikan suara"}</button>
          <Link href="/parent">Pengaturan orang tua</Link>
          <Link href="/account">Akun keluarga</Link>
        </div>
      </details>
    </header> : null}
    {children}
  </div>;
}
