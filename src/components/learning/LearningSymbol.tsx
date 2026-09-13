"use client";
import { BookOpen, GlobeHemisphereWest, Calculator, MoonStars, PencilLine, PuzzlePiece, Plant, Palette, PaintBrush, HandTap, SpeakerHigh, Cards, Path, PersonSimpleRun, LockKey } from "@phosphor-icons/react";

const symbols = { bahasa:BookOpen, english:GlobeHemisphereWest, math:Calculator, iqro:MoonStars, letters:PencilLine, logic:PuzzlePiece, science:Plant, color:Palette, drawing:PaintBrush, tap_choice:HandTap, listen_and_choose:SpeakerHigh, matching:Cards, trace:Path, coloring:Palette, story:BookOpen, motion_game:PersonSimpleRun, locked:LockKey };
export function LearningSymbol({name,size=36}:{name:string;size?:number}) {
  const Symbol=symbols[name as keyof typeof symbols] ?? BookOpen;
  return <Symbol size={size} weight="duotone" aria-hidden/>;
}
