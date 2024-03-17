import {player} from "../player";
import {Effect} from "./effect.ts";
import {employeeWorkSkillToAffect} from "../GameDataBase/employee/work.ts";
import {GameDataBase} from "../GameDataBase";
import {Numbers} from "../functions/Numbers.ts";
import {EventHub, GameEvent} from "../gameUpdate/eventHub.ts";

export const Employee = {
  equip(id: number) {
    if (id > player.employee.work.length) {
      return;
    }
    if (!player.employee.work[id][0]) {
      return
    }

    const work = player.employee.work
    if (work.filter((v) => v[1]).length > 5) {
      return;
    }

    player.employee.work[id][1] = true

    Effect.registerEffect(
      employeeWorkSkillToAffect(
        this.findEmployee(id),
        player.employee.work[id][4]
      ))
    EventHub.dispatch(GameEvent.CHANGE_EMPLOYEE)
  },

  unEquip(id: number) {
    if (id > player.employee.work.length) {
      return;
    }
    if (!player.employee.work[id][1]) {
      return
    }
    player.employee.work[id][1] = false
    Effect.clearSpecEffect('employee', id)
    EventHub.dispatch(GameEvent.CHANGE_EMPLOYEE)
  },

  unlockEmployee(id: number) {
    if (id > player.employee.work.length) {
      return;
    }
    player.employee.work[id][0] = true
    player.employee.work[id][2] = Date.now()
  },

  upgradeEmployee(id: number) {
    let [, equip, , letter, level] = player.employee.work[id]
    this.unEquip(id)
    if (letter < this.upgradeRequire(level)) {
      return
    }
    player.employee.work[id][3] -= this.upgradeRequire(level)
    player.employee.work[id][4] += 1
    if (equip) {
      this.equip(id)
    }
    EventHub.dispatch(GameEvent.CHANGE_EMPLOYEE)
  },

  upgradeRequire(level: number) {
    return Numbers.round((1.5 ** level) / (level + 0.5), 0)
  },
  findEmployee(id: number) {
    let v = GameDataBase.Employees.work.find(
      (e) => e.id == id)
    if (!v) {
      throw new Error(`wtf employee id ${id}`)
    }
    return v
  },
  rarityClass(rarity:number) {
    switch (rarity) {
      case 1: return `#7cdcf4`
      case 2: return `#1c10a0`
    }
  }
}