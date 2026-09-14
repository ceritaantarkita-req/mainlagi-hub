/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProfileCollection } from "@/components/learning/CloudProfileScreens";
import { readActiveChild, childDestination } from "@/lib/learning/entry";
import { PlayroomShell, SubjectDirectory } from "@/components/learning/Playroom";
import styles from "@/components/learning/Playroom.module.css";

export function HomePage() {
  const collection=useProfileCollection();
  const router=useRouter();
  useEffect(()=>{
    if(collection.loading || collection.error) return;
    const id=readActiveChild();
    if(id && collection.profiles.some(profile=>profile.id===id)) router.replace(childDestination(id));
  },[collection.loading,collection.error,collection.profiles,router]);

  return <PlayroomShell><main className={styles.page}>
    <h1 className={styles.greeting}>Main, belajar,<br/>temukan hal baru.</h1>
    <p className={styles.lead}>Ruang bermain untuk rasa ingin tahu si kecil.</p>
    <section className={styles.continue}>
      <div className={styles.continueCopy}>
        <h2>Mulai dari yang kamu suka.</h2>
        <p>Siapkan profil sekali. Besok tinggal lanjut bermain.</p>
        <Link href="/child/select?continue=1" className={styles.primary}>Mulai bermain</Link>
      </div>
      <div className={styles.companions} aria-hidden><img src="/artwork/garden-gavi.webp" alt="" width={500} height={650}/><img src="/artwork/garden-paca.webp" alt="" width={500} height={650}/></div>
    </section>
    <section aria-labelledby="subjects"><h2 className={styles.sectionTitle} id="subjects">Pilih kesukaanmu</h2><SubjectDirectory/></section>
    <p className={styles.footnote}>Profil, pengaturan suara, dan area orang tua tersedia di menu Profil.</p>
  </main></PlayroomShell>;
}
