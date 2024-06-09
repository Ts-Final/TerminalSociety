import {Resource} from "./resource.ts";
import {player} from "../player";
import {Effect, effectData, effectShort} from "../game-mechanics/effect.ts";
import {Numbers} from ".././utils/Numbers.ts";
import {GameDataClass, GameDataInterface} from "./baseData.ts";
import {ref, Ref} from "vue";
import {notify} from ".././utils/notify.ts";
import {Accessor, ResourceTypes} from "../constants.ts";
import {noEmpty} from ".././utils/noEmpty.ts";
import {ui} from "../game-mechanics/ui.ts";
import {Decimal} from "../utils/break_infinity.ts";

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

const counter = Numbers.counter(0, 1)
export const Researches: ResearchData[] = [
  {
    id: counter.next(),
    name: "欢迎来到研究室",
    des: "当然这里还没有什么东西。",
    itl: "我的意思是——存在的存在依赖于存在。",
    effect: [],
    cost: [],
    time: 5,
    maxLevel: 1,
    condition: () => true,
    timePow: 1,
  },
  {
    id: counter.next(),
    name: '电板扩建',
    des: '加几块太阳能板，也许可以让发电更多一点',
    itl: '楼顶一片黑。下面的人看了都说好，太阳是照不到了。不过也看不见阳光了。',
    effect: [['energy', 'pro', 0.05], ["energy", 'maxAdd', 1e3]],
    cost: [['iron', 10]],
    time: 10,
    maxLevel: 2,
    condition: () => true,
    timePow: 1.5
  },
  {
    id: counter.next(),
    name: '气象观测 1',
    des: '气象在有些时候还是很重要的',
    itl: '如果天下起了大雨，那么人们也许会陷入哀伤。如果天下起了大鱼……谁知道呢？',
    effect: [["air", 'pro', 0.05], ['water', "pro", 0.01]],
    cost: [],
    time: 15,
    maxLevel: 1,
    condition() {
      return Resource.air.max_record.gt(10)
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

  condition(): boolean
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
    started: Ref<Decimal>,
    level: Ref<number>,
    timeToUpg: Ref<Decimal>,
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
      player.research[this.id] = {
        unlocked:false,
        activated:false,
        started:new Decimal(0),
        level: 0,
      }
       // [false, false, new Decimal(0), 0]
    }

    this.refs = {
      unlocked: ref(false),
      activated: ref(false),
      started: ref(new Decimal(0)),
      level: ref(0),
      timeToUpg: ref(new Decimal(0)),
      percent: ref("0")
    }

    this.onLogic()
    ui.init.wait(this.registerEffect.bind(this))
  }

  get unlocked() {
    return player.research[this.id].unlocked
  }

  set unlocked(value) {
    player.research[this.id].unlocked = value
    this.refs.unlocked.value = value
  }

  get activated() {
    return player.research[this.id].activated
  }

  set activated(value) {
    player.research[this.id].activated = value
    this.refs.activated.value = value
  }

  get started() {
    return player.research[this.id].started
  }

  set started(value) {
    player.research[this.id].started = value
    this.refs.started.value = value
    this.refs.percent.value = this.percent
  }

  get level() {
    return player.research[this.id].level
  }

  set level(value) {
    player.research[this.id].level = value
    this.refs.level.value = value
  }

  get maxed() {
    return this.level >= this.maxLevel
  }

  get percent() {
    return this.started.div(this.timeToUpg).toPercent()
  }

  get timeToUpg() {
    const totalTime = new Decimal(this.time).pow(this.timePow ** this.level)
    return totalTime.div(this.secondaryProgress)
  }

  get secondaryProgress() {
    return Effect.researchProgress.value
  }

  static createAccessor(...data: ResearchData[]): Accessor<ResearchClass> {
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

  levelEffect(level: number): effectShort[] {
    if (level > this.maxLevel) {
      throw new Error(`level cant greater than max(${this.maxLevel}):Lv.${level}`)
    }
    const e: effectShort[] = []
    const source = "research", id = this.id
    for (const eff of this.effect) {
      if (eff.length == 2) {
        e.push({
          target: eff[0],
          // factor: Numbers.round(eff[1] * (level / this.maxLevel), 4)
          factor: new Decimal(eff[1]).mul(level).div(this.maxLevel),
          source, id
        })
      } else if (eff.length == 3) {
        e.push({
          target: eff[0], type: eff[1],
          // factor: Numbers.round(eff[2] * (level / this.maxLevel), 4)
          factor: new Decimal(eff[2]).mul(level).div(this.maxLevel),
          source, id
        })
      }
    }
    return e
  }

  updateLogic(speed = 1) {
    this.cheatGuard()
    this.updateRef()
    if (!this.unlocked) {
      if (this.tryUnlock()) {
        notify.success("解锁研究：" + this.name, 1000)
      }
      return
    }

    if (this.maxed) return
    if (!this.activated) return

    let canProduce = true
    this.cost.forEach((x) => {
      canProduce &&= Resource(x[0]).canEffectCost(x[1] * speed)
    })
    if (!canProduce) return

    this.nextSecond(speed)
    this.cost.forEach(x => {
      Resource(x[0]).effectCost(x[1] * speed)
    })
    if (this.levelCheck()) {
      this.upgrade()
      if (!this.maxed) {
        notify.success("研究升级" + this.name + "Lv." + this.level + 1, 1000)
      } else {
        notify.success("研究完成：" + this.name, 1000)
        this.activated = false
      }
    }
  }

  nextSecond(speed = 1) {
    this.started = this.started.add(this.secondaryProgress.mul(speed))
  }

  levelCheck() {
    return this.started.minus(0.2).gte(this.timeToUpg)
  }

  upgrade() {
    this.level += 1
    this.started = new Decimal(0)
  }

  registerEffect() {
    Effect.deleteEffect('research', this.id)
    if (this.level > 0) {
      Effect.registerEffect(...this.toEffect())
    }
  }

  updateRef() {
    this.refs.unlocked.value = this.unlocked && Research(0).maxed
    this.refs.percent.value = this.percent
    this.refs.started.value = this.started
    this.refs.level.value = this.level
    this.refs.timeToUpg.value = this.timeToUpg
    this.refs.activated.value = this.activated
  }

  trigger() {
    this.activated = !this.activated
  }

  cheatGuard() {
    this.level = Math.min(this.level, this.maxLevel)
  }
}

export const Research = ResearchClass.createAccessor(...Researches)
window.dev.research = Research