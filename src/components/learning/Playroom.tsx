/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Icon } from "@/components/Icon";
import { SUBJECTS } from "@/lib/learning/system";
import { rememberChild } from "@/lib/learning/entry";
import { coreSubjectThumbnail } from "@/lib/learning/coreThumbnailRegistry";
import { isMuted, setMuted, unlockAudio } from "@/lib/audio/feedback";
import { useLearningProfile } from "./LearningCommon";
import styles from "./Playroom.module.css";
export function SubjectDirectory({ childId }: { childId?: string }) {
  return (
    <div className={styles.subjects} data-core-thumbnail-grid="subjects">
      {SUBJECTS.map((subject) => {
        const thumbnail = coreSubjectThumbnail(subject.id);
        const title = subject.id === "english" ? "Bahasa Inggris" : subject.title;
        return (
          <Link
            key={subject.id}
            className={styles.subject}
            href={childId ? `/child/${childId}/subject/${subject.id}` : `/child/select?continue=1&subject=${subject.id}`}
            data-core-thumbnail-card="subject"
            data-core-thumbnail-id={subject.id}
          >
            {thumbnail ? (
              <Image
                className={styles.subjectThumbnail}
                src={thumbnail}
                alt=""
                width={1200}
                height={900}
                sizes="(max-width: 760px) 50vw, (max-width: 1100px) 33vw, 360px"
                draggable={false}
              />
            ) : null}
            <span className={styles.subjectName}>{title}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function PlayroomShell({childId,children}:{childId?:string;children:ReactNode}) {
  const pathname=usePathname();
  const profile=useLearningProfile(childId ?? "");
  const [muted,updateMuted]=useState(false);
  useEffect(()=>{ if(childId && profile?.id===childId) rememberChild(childId); },[childId,profile]);
  useEffect(()=>{ const frame=requestAnimationFrame(()=>updateMuted(isMuted())); return()=>cancelAnimationFrame(frame); },[]);
  const base=childId ? `/child/${childId}` : "";
  const immersive=pathname.includes("/activity/") || (pathname.includes("/world/") && pathname.includes("/stage/"));
  const items=[
    {href:base ? `${base}/home` : "/",label:"Belajar",active:pathname==="/" || pathname===`${base}/home`},
    {href:base ? `${base}/worlds` : "/worlds/money-festival",label:"World",active:pathname.includes("/world")},
    {href:base ? `${base}/games` : "/games",label:"Bermain",active:pathname.includes("/games")}
  ];
  return <div className={styles.shell}>
    {!immersive ? <header className={styles.header}>
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
