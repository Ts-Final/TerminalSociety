import {GameDataBase} from "../GameDataBase";
import {player} from "../player";
import {notify} from "../functions/notify.ts";
import {canResourceChange, doResourceChange, resetResourceChange} from "../game-mechanics/resourceChange.ts";
import {calcLevelTime} from "../game-mechanics/research.ts";
import {Effect} from "../game-mechanics/effect.ts";
import {researchToEffect} from "../GameDataBase/research.ts";
import {ResourceTypes} from "../GameDataBase/resource.ts";
import {Numbers} from "../functions/Numbers.ts";
import {deepClone} from "../functions/deepClone.ts";
import {GameStats} from "../game-mechanics/gameStats.ts";
import {different} from "../functions/different.ts";
import {EventHub, GameEvent} from "./eventHub.ts";

import {displayEnum} from "../GameDataBase/display.ts";
import {getAllowProxy} from "../functions/getAllowProxy.ts";
import {generateMarket} from "../market.ts";

export const gameLoop = {
  fullUpdate() {
    // resetResourceChange()

    // this.updateFreshTime()
    // this.updateTasks()
    // this.updateResearch()
    // this.updateMarketUpgrade()
    // this.updateH2p()
    //
    // this.updateResource()
  },
  updateMarketUpgrade() {
    for (let i = 0; i < GameDataBase.Market.Upgrade.length; i++) {
      let upgrade = GameDataBase.Market.Upgrade[i]
      player.market.upgrades[i][0] = upgrade.unlock

    }
  },
  updateResearch() {
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
  },
  updateResource() {
    for (let key of Object.keys(player.resource)) {
      // These code seemed ugly, but Volar is a fuck that it will cause TYPE ERROR if i dont do that
      let key1 = key as ResourceTypes
      let key2 = key as keyof typeof player.resource
      player.resource[key2].affects.maxAdd = Effect.calcResource(key1, 'maxAdd').names
      player.resource[key2].affects.pro = Effect.calcResource(key1, "pro").names
      player.resource[key2].affects.consume = Effect.calcResource(key1, "consume").names
      player.resource[key2].affects.maxMult = Effect.calcResource(key1, 'maxMult').names
      player.resource[key2].maximum = Effect.calcResourceMax(key1)
      player.resource[key2].max_record =
        Math.max(player.resource[key2].max_record, player.resource[key2].amount)

      player.resource[key2].max_record = Numbers.round(player.resource[key2].max_record)
      player.resource[key2].amount = Numbers.round(player.resource[key2].amount)
    }
  },
  updateFreshTime() {
    let date = new Date()
    date.setDate(date.getDate() + 1)
    player.dailyFreshTime = date.setHours(0, 0, 0, 0)
  },
  updateH2p() {
    let v = deepClone(GameStats.h2pUnlocks)
    for (const h2p of GameDataBase.How2Play) {
      if (h2p.id in GameStats.h2pUnlocks) {
        // first unlock: h2p.unlock ->true, unlocks[i] -> false
        if (h2p.unlocked && !GameStats.h2pUnlocks[h2p.id]) {
          notify.success(`新指引：${h2p.title}`, 1000)
          GameStats.h2pUnlocks[h2p.id] = true
        }
      } else {
        GameStats.h2pUnlocks[h2p.id] = h2p.unlocked
      }
    }
    if (different(v, GameStats.h2pUnlocks)) {
      EventHub.dispatch(GameEvent.UPDATE)
    }
  },
  updateTasks() {
    for (let key = 0; key < GameDataBase.Tasks.length; key++) {

      const task = GameDataBase.Tasks[key]
      // unlock check
      if (!player.task[key][1]) {
        player.task[key][1] = task.unlock
        if (player.task[key][1]) {
          notify.success(`解锁生产：${task.name}`, 1000)
        }
      }
      // activate check
      if (!player.task[key][0]) {
        continue
      }

      // About Resources
      // these code seems absolutely ugly
      let canProduce = true
      for (let i = 0; i < task.produce.length; i++) {
        let [resKey, value] = task.produce[i]
        if (!canResourceChange(resKey, value, true)) {
          canProduce = false
        }
      }
      if (!canProduce) {
        continue
      }
      for (let i = 0; i < task.cost.length; i++) {
        let [resKey, value] = task.cost[i]
        if (!canResourceChange(resKey, value, false)) {
          canProduce = false
        }
      }
      if (!canProduce) {
        continue
      }

      for (let i = 0; i < task.produce.length; i++) {
        let [resKey, value] = task.produce[i]
        doResourceChange(resKey, value, true)
      }
      for (let i = 0; i < task.cost.length; i++) {
        let [resKey, value] = task.cost[i]
        doResourceChange(resKey, value, false)
      }

    }
  },
  updateDisplay() {
    for (let i = 0; i < gameLoop.displayHandlers[player.display].length; i++) {
      gameLoop.displayHandlers[player.display][i]()
    }
    gameLoop.displayHandlers[displayEnum.baseLayouts].forEach((v) => v())
  },
  displayHandlers: getAllowProxy<{ [x: number]: Function[] }>({})
}

EventHub.logic.on(GameEvent.UPDATE, gameLoop.fullUpdate.bind(gameLoop))
EventHub.ui.on(GameEvent.UPDATE,gameLoop.updateDisplay.bind(gameLoop))
EventHub.logic.on(GameEvent.MARKET_UPDATE,generateMarket)
