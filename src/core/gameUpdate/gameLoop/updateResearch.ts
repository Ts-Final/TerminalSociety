import {GameDataBase} from "../../GameDataBase";
import {player} from "../../player";
import {canResourceChange, doResourceChange} from "../../game-mechanics/resourceChange.ts";
import {calcLevelTime} from "../../game-mechanics/research.ts";
import {notify} from "../../functions/notify.ts";
import {Effect} from "../../game-mechanics/effect.ts";
import {researchToEffect} from "../../GameDataBase/research.ts";


export function updateResearch() {
  for (let key = 0; key < GameDataBase.Researches.length; key++) {
    const research = GameDataBase.Researches[key]
    // unlock check
    if (!player.research[key][1]) {
      player.research[key][1] = research.unlock
      if (player.research[key][1]) {
        notify.success(`解锁研究：${research.name}`, 1000)
      }
    }

    // activate check
    if (!player.research[key][0]) {
      continue
    }

    // Resources
    let canProduce = true
    for (let i = 0; i < research.cost.length; i++) {
      let cost = research.cost[i]
      if (!canResourceChange(cost[0], cost[1], false)) {
        canProduce = false
      }
    }
    if (!canProduce) {
      continue
    }

    for (let i = 0; i < research.cost.length; i++) {
      let cost = research.cost[i]
      doResourceChange(cost[0], cost[1], false)
    }

    player.research[key][2] += 1 // time++
    if (player.research[key][2] >= calcLevelTime(research)) {
      player.research[key][2] = 0
      player.research[key][3] += 1 // level++
      if (player.research[key][3] >= research.maxLevel) // 满级之后
      {
        player.research[key][0] = false
        notify.success(`完成研究：${research.name}`, 2000)
      } else {
        notify.success(`研究升级：${research.name} Lv.${player.research[key][3]}`, 2000)
      }

      Effect.clearSpecEffect('research', research.id)
      Effect.registerEffect(researchToEffect(research, player.research[key][3]))
    }

  }
}