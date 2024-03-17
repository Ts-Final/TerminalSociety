import {load, save} from "./game-mechanics/save.ts";
import {initListener} from "./functions/eventListener.ts";
import {EventHub} from "./gameUpdate/eventHub.ts";
import {GameEvent} from "./gameUpdate/gameEvent.ts";
import {GameDataBase} from "./GameDataBase";
import {player} from "./player";
import {Effect} from "./game-mechanics/effect.ts";
import {researchToEffect} from "./GameDataBase/research.ts";
import {employeeWorkSkillToAffect} from "./GameDataBase/employee/work.ts";
import {Progress} from "./game-mechanics/progress.ts";


function initIntervals() {
  setInterval(() => EventHub.dispatch(GameEvent.UPDATE), 1000)
  setInterval(() => EventHub.update(), 33)
  setInterval(save, 10e3)
}

export function isLocal() {
  const href = window.location.href
  return href.includes("127.0.0.1") || href.includes("localhost")
}

export function init() {
  load(isLocal())
  initIntervals()
  initListener()
  initEffects()
}

function initEffects() {
  for (const research of GameDataBase.Researches) {
    if (player.research[research.id][3] >= research.maxLevel) {
      Effect.registerEffect(
        researchToEffect(research, player.research[research.id][3]))
    }
  }
  for (const ew of GameDataBase.Employees.work) {
    if (player.employee.work[ew.id][1]) {
      Effect.registerEffect(
        employeeWorkSkillToAffect(ew,Progress.employee(ew.id).level)
      )
    }
  }
}