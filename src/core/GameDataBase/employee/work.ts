import {Effect, effect, effectData, effectShort} from "../../game-mechanics/effect.ts";
import {Numbers} from "../.././utils/Numbers.ts";
import {GameDataClass} from "../baseData.ts";
import {player} from "../../player.ts";
import {ref, Ref} from "vue";
import {notify} from "../.././utils/notify.ts";
import {noEmpty} from "../.././utils/noEmpty.ts";
import {ui} from "../../game-mechanics/ui.ts";

export interface employeeWork {
  id: number
  name: string
  name2?: string
  des: string
  maxLevel: number
  rarity: number
  gain: 'limited' | 'normal' | 'special'

  skill(lv: number): effectData[]
}


export const __EmployeeWork: EmployeeWorkData[] = [
  {
    id: 0,
    name: "牢大",
    name2: `Kobe Bryant`,
    des: "孩子们，我回来了",
    maxLevel: 5,
    gain: 'normal',
    rarity: 1,
    skill: (lv: number) => [
      ["research", 0.01 * lv],
      ['energy', "pro", 0.02 / 5 * lv],
    ],
  },
  {
    id: 1,
    name: `<span class="rainbow-text-color">星</span>`,
    des: '你明白，这世上唯一还能一起玩耍的人，也就只有这位了。或者，更应该向那些人致以再见，送去离别的挥手。',
    rarity: 5,
    maxLevel: 5,
    gain: 'special',
    skill: (lv: number) => [
      ['energy', 'pro', 0.01 * lv],
      ['energy', 'maxAdd', 100 * lv]
    ],
  }
]

interface EmployeeWorkData {
  id: number
  name: string
  name2?: string
  des: string
  maxLevel: number
  /* 1-5 */
  rarity: number
  gain: 'limited' | 'normal' | 'special'

  skill(lv: number): effectData[]
}

export class EmployeeWorkClass extends GameDataClass implements EmployeeWorkData {
  static all: EmployeeWorkClass[]
  static equipCount = 0
  static refs = {
    onUpdate: ref(true)
  }
  name2?: string
  des: string
  maxLevel: number
  /* 1-5 */
  rarity: number
  gain: 'limited' | 'normal' | 'special'
  skill: (lv: number) => effectData[]
  refs: {
    unlocked: Ref<boolean>,
    level: Ref<number>,
    equipped: Ref<boolean>,
    exp: Ref<number>,
    joinTime: Ref<number>,
    req: Ref<number>,
    eff: Ref<effect>
  }

  constructor(data: EmployeeWorkData) {
    super({
      id: data.id,
      name: data.name,
      // As we needed, they are all Employed manually, so we never let it unlock
      unlock: () => false
    });
    this.des = data.des
    this.maxLevel = data.maxLevel
    this.rarity = data.rarity
    this.gain = data.gain
    this.skill = data.skill

    if (!player.employee[this.id]) {
      player.employee.push([
        false, false, 1, 0, 0
      ])
    }

    this.refs = {
      unlocked: ref(false),
      level: ref(0),
      equipped: ref(false),
      exp: ref(0),
      joinTime: ref(0),
      req: ref(0),
      eff: ref(this.toEffect()),
    }

    ui.init.wait(this.register.bind(this))
  }

  static get allEquipped() {
    return this.all.filter(e => e.equipped)
  }

  static get allUnequipped() {
    return this.all.filter(e => !e.equipped)
  }

  static get equippedCount() {
    return this.allEquipped.length
  }

  static get maxEquipCount(): number {
    return 5
  }

  static get allUnlocked() {
    return this.all.filter(e => e.unlocked)
  }

  get unlocked() {
    return player.employee[this.id][0]
  }

  set unlocked(value: boolean) {
    player.employee[this.id][0] = value
    this.refs.unlocked.value = value
  }

  get equipped() {
    return player.employee[this.id][1]
  }

  set equipped(value) {
    player.employee[this.id][1] = value
    this.refs.equipped.value = value
  }

  get level() {
    return player.employee[this.id][2]
  }

  set level(value) {
    player.employee[this.id][2] = value
    this.refs.level.value = value
  }

  get exp() {
    return player.employee[this.id][3]
  }

  set exp(value: number) {
    player.employee[this.id][3] = value
    this.refs.exp.value = value
  }

  get joinTime() {
    return player.employee[this.id][4]
  }

  set joinTime(value: number) {
    player.employee[this.id][4] = value
    this.refs.joinTime.value = value
  }

  get upgradeRequire() {
    return Numbers.round((1.5 ** this.level) / (this.level + 0.5), 0)
  }

  get dateString() {
    let date = new Date(this.joinTime)
    return date.getFullYear() + "年"
      + date.getMonth() + "月"
      + date.getDate() + "日"
  }

  get joinDays() {
    return Numbers.round(
      (Date.now() - this.joinTime) / (1000 * 60 * 60 * 24)
    )
  }

  static unlockAll() {
    this.all.forEach(x => x.join())
  }

  static createAccessor(...data: EmployeeWorkData[]): {
    (id: number): EmployeeWorkClass,
    all: EmployeeWorkClass[],
    class: typeof EmployeeWorkClass
  } {
    this.all = data.map(e => new this(e))
    const accessor = (id: number) => noEmpty(this.all.find(e => e.id == id))
    accessor.all = this.all
    accessor.class = this

    this.equipCount = this.all.filter(e => e.equipped).length
    return accessor
  }

  static refreshTab() {
    this.refs.onUpdate.value = !this.refs.onUpdate.value
    setTimeout(() => this.refs.onUpdate.value = !this.refs.onUpdate.value, 20)
  }

  equip() {
    if (EmployeeWorkClass.equippedCount >= EmployeeWorkClass.maxEquipCount) return
    if (!this.unlocked) return
    if (this.equipped) return

    this.equipped = true
    Effect.registerEffect(this.toEffect())
    EmployeeWorkClass.refreshTab()
  }

  unEquip() {
    if (!this.equipped) return
    this.equipped = false
    Effect.deleteEffect('employee', this.id)
    EmployeeWorkClass.refreshTab()
  }

  upgrade() {
    if (this.exp < this.upgradeRequire) {
      return
    }
    this.exp -= this.upgradeRequire
    this.level += 1
    if (this.equipped) {
      this.register()
    }
    this.refs.eff.value = this.toEffect()
  }

  updateRef() {
    this.refs.exp.value = this.exp
    this.refs.equipped.value ||= this.equipped
    this.refs.unlocked.value ||= this.unlocked
    this.refs.level.value = this.level
    this.refs.joinTime.value = this.joinTime
    this.refs.req.value = this.upgradeRequire
  }

  toEffect(): effect {
    let smalls: effectShort[] = []
    for (const eff of this.skill(this.level)) {
      if (eff.length == 2) {
        smalls.push({
          target: eff[0],
          factor: Numbers.round(eff[1], 2)
        })
      } else if (eff.length == 3) {
        smalls.push({target: eff[0], type: eff[1], factor: eff[2]})
      }
    }
    return {
      source: "employee",
      id: this.id,
      effects: smalls
    }
  }

  register() {
    Effect.deleteEffect('employee', this.id)

    if (this.equipped) {
      Effect.registerEffect(this.toEffect())
    }
  }

  join() {
    if (!this.unlocked) {
      notify.success("新员工加入：" + this.name, 1000)
    }
    this.unlocked = true
    this.joinTime = Date.now()
  }
}

export const Employee = EmployeeWorkClass.createAccessor(...__EmployeeWork)
window.dev.employee = {Employee, EmployeeWorkClass}