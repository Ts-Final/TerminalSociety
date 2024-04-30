import {Resources} from "./resource.ts";
import {player} from "../player";
import {Effect, effect, effectData, effectShort} from "../game-mechanics/effect.ts";
import {Numbers} from ".././utils/Numbers.ts";
import {GameDataClass, GameDataInterface} from "./baseData.ts";
import {ref, Ref} from "vue";
import {notify} from ".././utils/notify.ts";
import {ResourceTypes} from "../constants.ts";
import {noEmpty} from ".././utils/noEmpty.ts";

export interface Research {
  id: number
  name: string
  des: string
  itl: string
  effect: effectData[]
  cost: [ResourceTypes, number][]
  time: number
  maxLevel: number
  timePow: number

  get unlock(): boolean
}

/**
 * 将Research变成Effect
 * @param r
 * @param lv
 */
export function researchToEffect(r: Research, lv: number): effect {
  let e: effectShort[] = []
  for (const eff of r.effect) {
    if (eff.length == 2) {
      e.push({
        target: eff[0],
        factor: Numbers.round(eff[1] * (lv / r.maxLevel), 4)
      })
    } else if (eff.length == 3) {
      e.push({
        target: eff[0], type: eff[1],
        factor: Numbers.round(eff[2] * (lv / r.maxLevel), 4)
      })
    }
  }
  return {
    source: "research",
    id: r.id,
    effects: e
  }
}

export const Researches: ResearchData[] = [
  {
    id: 0,
    name: '电板扩建',
    des: '加几块太阳能板，也许可以让发电更多一点',
    itl: '楼顶一片黑。下面的人看了都说好，太阳是照不到了。不过也看不见阳光了。',
    effect: [['energy', 'pro', 0.05], ["energy", 'maxAdd', 1e3]],
    cost: [['iron', 10]],
    time: 10,
    maxLevel: 2,
    unlock: () => true,
    timePow: 1.5
  },
  {
    id: 1,
    name: '气象观测 1',
    des: '气象在有些时候还是很重要的',
    itl: '如果天下起了大雨，那么人们也许会陷入哀伤。如果天下起了大鱼……谁知道呢？',
    effect: [["air", 'pro', 0.05], ['water', "pro", 0.01]],
    cost: [],
    time: 15,
    maxLevel: 1,
    unlock() {
      return player.resource.air.max_record >= 10
    },
    timePow: 1,
  }
]

interface ResearchData extends GameDataInterface {
  id: number
  name: string
  des: string
  itl: string
  effect: effectData[]
  cost: [ResourceTypes, number][]
  time: number
  maxLevel: number
  timePow: number

  unlock(): boolean
}

export class ResearchClass
  extends GameDataClass
  implements ResearchData {
  static all: ResearchClass[] = []

  cost: [ResourceTypes, number][];
  des: string;
  effect: effectData[];
  itl: string;
  maxLevel: number;
  time: number;
  timePow: number;

  refs: {
    unlocked: Ref<boolean>,
    activated: Ref<boolean>,
    started: Ref<number>,
    level: Ref<number>,
    timeToUpg: Ref<number>,
    finished: Ref<boolean>,
    percent: Ref<string>,
  }

  constructor(data: ResearchData) {
    super(data);
    this.cost = data.cost
    this.des = data.des
    this.effect = data.effect
    this.itl = data.itl
    this.maxLevel = data.maxLevel
    this.time = data.time
    this.timePow = data.timePow

    if (player.research[this.id] === undefined) {
      player.research[this.id] = [false, false, 0, 0]
    }

    this.refs = {
      unlocked: ref(false),
      activated: ref(false),
      started: ref(0),
      level: ref(0),
      timeToUpg: ref(0),
      finished: ref(false),
      percent: ref("0")
    }

    this.onLogic()
    setTimeout(this.registerEffect.bind(this), 100)
  }

  get unlocked() {
    return player.research[this.id][0]
  }

  set unlocked(value) {
    player.research[this.id][0] = value
    this.refs.unlocked.value = value
  }

  get activated() {
    return player.research[this.id][1]
  }

  set activated(value) {
    player.research[this.id] [1] = value
    this.refs.activated.value = value
  }

  get started() {
    return player.research[this.id][2]
  }

  set started(value) {
    player.research[this.id][2] = value
    this.refs.started.value = value
    this.refs.percent.value = this.percent
  }

  get level() {
    return player.research[this.id][3]
  }

  set level(value) {
    player.research[this.id][3] = value
    this.refs.level.value = value
  }

  get maxed() {
    return this.level >= this.maxLevel
  }

  get percent() {
    return Numbers.formatInt(this.started / this.timeToUpg, true)
  }

  get timeToUpg() {
    return Numbers.round(
      this.time * (this.timePow ** this.level) / this.secondaryProgress, 2)
  }

  get secondaryProgress() {
    return Effect.researchProgress.value
  }

  static createAccessor(...data: ResearchData[]) {
    this.all = data.map((x) => new this(x))
    const accessor = (id: number) => noEmpty(this.all.find(x => x.id === id))
    accessor.all = this.all
    return accessor
  }

  toEffect() {
    return this.levelEffect(this.level)
  }
  nextEffect() {
    return this.levelEffect(this.level + 1)
  }

  levelEffect(level: number): effect {
    if (level > this.maxLevel) {
      throw new Error("level cant greater than max" + level + this.maxLevel)
    }
    let e: effectShort[] = []
    for (const eff of this.effect) {
      if (eff.length == 2) {
        e.push({
          target: eff[0],
          factor: Numbers.round(eff[1] * (level / this.maxLevel), 4)
        })
      } else if (eff.length == 3) {
        e.push({
          target: eff[0], type: eff[1],
          factor: Numbers.round(eff[2] * (level / this.maxLevel), 4)
        })
      }
    }
    return {
      source: "research",
      id: this.id,
      effects: e
    }
  }

  updateLogic() {
    if (!this.unlocked) {
      this.unlocked ||= this.unlock()
      if (this.unlocked) {
        notify.success("解锁研究：" + this.name, 1000)
      }
      return
    }

    if (!this.activated) return

    let canProduce = true
    this.cost.forEach((x) => {
      canProduce &&= Resources(x[0]).canCost(x[1])
    })
    if (!canProduce) return

    this.nextSecond()
    if (this.levelCheck()) {
      if (!this.maxed) {
        notify.success("研究升级" + this.name + "Lv." + this.level, 1000)
      } else {
        notify.success("研究完成：" + this.name, 1000)
      }
      this.upgrade()
    }
  }

  nextSecond() {
    this.started += this.secondaryProgress
  }

  levelCheck() {
    return this.started >= this.timeToUpg
  }

  upgrade() {
    this.level += 1
    this.started = 0
  }

  registerEffect() {
    Effect.deleteEffect('research', this.id)
    if (this.level > 0) {
      Effect.registerEffect(this.toEffect())
    }
  }

  updateRef() {
    this.refs.finished.value = this.maxed
    this.refs.percent.value = this.percent
    this.refs.unlocked.value = this.unlocked
    this.refs.started.value = this.started
    this.refs.level.value = this.level
    this.refs.timeToUpg.value = this.timeToUpg
    this.refs.activated.value = this.activated
  }


  trigger() {
    this.activated = !this.activated
  }
}

export const Research = ResearchClass.createAccessor(...Researches)
window.dev.research = Research