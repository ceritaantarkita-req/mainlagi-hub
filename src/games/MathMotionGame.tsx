import type { GameModuleProps } from "./types";
import { DigitRace } from "./DigitRace";
export function MathMotionGame(props: GameModuleProps) { return <DigitRace {...props} kind="math" />; }
