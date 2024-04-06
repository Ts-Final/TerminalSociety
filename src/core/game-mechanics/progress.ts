import {player} from "../player";

export const Progress = {
  hasBoughtUpgrade(...req: number[]) {
    let result = true
    for (let i = 0; i < req.length; i++) {
      const id = req[i]
      result = player.market.upgrades[id - 1][1] && result
    }
    return result
  },
  hasLeveledResearch(...req: [number, number][]) {
    let result = true
    for (let i = 0; i < req.length; i++) {
      const id = req[i][0]
      const level = req[i][1]
      result = player.research[id][3] >= level && result
    }
    return result
  },
  employee(id:number) {
    let e = player.employee[id]
    return {
      unlocked: e[0],
      equipped: e[1],
      unlockTime: e[2],
      letters: e[3],
      level: e[4]
    }
  },
  task(id:number) {
    let e = player.task[id]
    return {
      unlocked: e[0],
      activated: e[1]
    }
  },
  Research(id:number) {
    return {
      levelUp() {
        player.research[id][3] += 1
      },
      change() {
        player.research[id][0] = !player.research[id][0]
      }
    }
  },
  research(id:number) {
    let e = player.research[id]
    return {
      activated:e[0],
      unlocked:e[1],
      started:e[2],
      level:e[3],
    }
  },
}