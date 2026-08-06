import type { GameModuleProps } from "./types";
import { DigitRace } from "./DigitRace";
export function PatternRaceGame(props: GameModuleProps) { return <DigitRace {...props} kind="pattern" />; }
