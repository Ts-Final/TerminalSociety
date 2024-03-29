import {GameStorage} from "./game-mechanics/GameStorage.ts";
import {initListener} from "./functions/eventListener.ts";
import {GameDataBase} from "./GameDataBase";
import {player} from "./player";
import {Effect} from "./game-mechanics/effect.ts";
import {researchToEffect} from "./GameDataBase/research.ts";
import {employeeWorkSkillToAffect} from "./GameDataBase/employee/work.ts";
import {Progress} from "./game-mechanics/progress.ts";
import {Base64} from "./functions/base64.ts";
import {gameIntervals} from "./game-mechanics/gameIntervals.ts";


export function isLocal() {
  const href = window.location.href
  return href.includes("127.0.0.1") || href.includes("localhost")
}

export function init() {
  GameStorage.load(isLocal())
  gameIntervals.start()
  initListener()
  initEffects()
}

function initEffects() {
  for (const research of GameDataBase.Researches) {
    if (Progress.research(research.id).level >= research.maxLevel) {
      Effect.registerEffect(
        researchToEffect(research, Progress.research(research.id).level))
    }
  }
  for (const ew of GameDataBase.Employees.work) {
    if (player.employee.work[ew.id][1]) {
      Effect.registerEffect(
        employeeWorkSkillToAffect(ew, Progress.employee(ew.id).level)
      )
    }
  }
}

window.dev.base64 = Base64