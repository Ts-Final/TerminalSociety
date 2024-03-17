import {Research} from "../GameDataBase/research.ts";
import {Effect} from "./effect.ts";
import {Numbers} from "../functions/Numbers.ts";
import {Progress} from "./progress.ts";


export function calcLevelTime(research: Research) {
  return Numbers.round(research.time *
    (research.timePow ** Progress.research(research.id).level) /
    Effect.calcResearchProgress())
}
