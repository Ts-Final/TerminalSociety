import {Effect, effectData, effectShort} from "../../game-mechanics/effect.ts";
import {Numbers} from "../.././utils/Numbers.ts";
import {GameDataClass} from "../baseData.ts";
import {player} from "../../player.ts";
import {ref, Ref} from "vue";
import {notify} from "../.././utils/notify.ts";
import {noEmpty} from "../.././utils/noEmpty.ts";
import {ui} from "../../game-mechanics/ui.ts";
import {Optional} from "../../constants.ts";
import {Decimal} from "../../utils/break_infinity.ts";


export const EmployeeWork: EmployeeWorkData[] = [
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
    onUpdate: ref(true),
    unlockCount: ref(0),
    equipCount: ref(0),
    checking: ref() as Ref<Optional<number>>
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
    regain: Ref<number>
  }

  constructor(data: EmployeeWorkData) {
    super({
      id: data.id,
      name: data.name,
      // As we needed, they are all Employed manually, so we never let it unlock
      condition: () => false
    });
    this.des = data.des
    this.maxLevel = data.maxLevel
    this.rarity = data.rarity
    this.gain = data.gain
    this.skill = data.skill
    this.name2 = data.name2 ?? ''

    if (!player.employee[this.id]) {
      player.employee.push({
        unlocked: false,
        equipped: false,
        level: 1,
        exp: 0,
        joinTime: 0,
        regain: 0,
      })
    }

    this.refs = {
      unlocked: ref(false),
      level: ref(0),
      equipped: ref(false),
      exp: ref(0),
      joinTime: ref(0),
      req: ref(0),
      regain: ref(0),
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

  static get unlockedAndUnequipped() {
    return this.all.filter(e => e.unlocked && !e.equipped)
  }

  get unlocked() {
    return player.employee[this.id].unlocked
  }

  set unlocked(value: boolean) {
    player.employee[this.id].unlocked = value
    this.refs.unlocked.value = value
  }

  get equipped() {
    return player.employee[this.id].equipped
  }

  set equipped(value) {
    player.employee[this.id].equipped = value
    this.refs.equipped.value = value
  }

  get level() {
    return player.employee[this.id].level
  }

  set level(value) {
    player.employee[this.id].level = value
    this.refs.level.value = value
  }

  get exp() {
    return player.employee[this.id].exp
  }

  set exp(value: number) {
    player.employee[this.id].exp = value
    this.refs.exp.value = value
  }

  get joinTime() {
    return player.employee[this.id].joinTime
  }

  set joinTime(value: number) {
    player.employee[this.id].joinTime = value
    this.refs.joinTime.value = value
  }

  get upgradeRequire() {
    // 1000 + 100*level*log6(level)
    return Decimal.log(this.level, 6) * this.level * 100 + 1000
  }

  get dateString() {
    const date = new Date(this.joinTime)
    return date.getFullYear() + "年"
      + date.getMonth() + "月"
      + date.getDate() + "日"
  }

  get joinDays() {
    return Numbers.round(
      (Date.now() - this.joinTime) / (1000 * 60 * 60 * 24)
    )
  }

  get advantages() {
    const skill = this.skill(this.level)
    const v: string[] = []
    for (const s of skill) {
      v.push(Effect.parseTarget(s[0]).charAt(0))
    }
    return [...new Set(v)]
  }

  get regain() {
    return player.employee[this.id].regain
  }

  set regain(value: number) {
    player.employee[this.id].regain = value
    this.refs.regain.value = value
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

  static updateRef() {
    this.refs.equipCount.value = this.allEquipped.length
    this.refs.unlockCount.value = this.allUnlocked.length
    this.refs.onUpdate.value = false
    setTimeout(() => EmployeeWorkClass.refs.onUpdate.value = true, 1)
  }

  static onCheck(id: number) {
    setTimeout(() => EmployeeWorkClass._onCheck(id))
  }

  static _onCheck(id: number) {
    this.refs.checking.value = id
  }

  static unCheck() {
    this.refs.checking.value = undefined
  }

  check() {
    EmployeeWorkClass.onCheck(this.id)
  }

  equip() {
    if (EmployeeWorkClass.equippedCount >= EmployeeWorkClass.maxEquipCount) return
    if (!this.unlocked) return
    if (this.equipped) return

    this.equipped = true
    Effect.registerEffect(...this.toEffect())
    EmployeeWorkClass.updateRef()
  }

  unEquip() {
    if (!this.equipped) return
    this.equipped = false
    Effect.deleteEffect('employee', this.id)
    EmployeeWorkClass.updateRef()
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
  }

  updateRef() {
    this.refs.exp.value = this.exp
    this.refs.equipped.value ||= this.equipped
    this.refs.unlocked.value ||= this.unlocked
    this.refs.level.value = this.level
    this.refs.joinTime.value = this.joinTime
    this.refs.req.value = this.upgradeRequire
    this.refs.regain.value = this.regain
  }

  toEffect(): effectShort[] {
    const smalls: effectShort[] = []
    const source = "employee"
    const id = this.id
    for (const eff of this.skill(this.level)) {
      if (eff.length == 2) {
        smalls.push({
          target: eff[0],
          factor: Numbers.round(eff[1], 2),
          source,
          id
        })
      } else if (eff.length == 3) {
        smalls.push({target: eff[0], type: eff[1], factor: eff[2], source, id})
      }
    }
    return smalls
  }

  register() {
    Effect.deleteEffect('employee', this.id)

    if (this.equipped) {
      Effect.registerEffect(...this.toEffect())
    }
  }

  join() {
    if (!this.unlocked) {
      notify.success("新员工加入：" + this.name, 1000)
      this.unlocked = true
      this.joinTime = Date.now()
    } else {
      this.regain += 1
    }
    EmployeeWorkClass.updateRef()
  }

  updateLogic(): void {
    return
  }
}

ui.init.wait(() => EmployeeWorkClass.updateRef())
export const Employee = EmployeeWorkClass.createAccessor(...EmployeeWork)
window.dev.employee = {Employee, EmployeeWorkClass}