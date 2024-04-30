import {GameDataClass, GameDataInterface} from "./baseData.ts";
import {ref, Ref} from "vue";
import {player} from "../player.ts";
import {ValueNotFoundError} from ".././utils/errors.ts";
import {Numbers} from ".././utils/Numbers.ts";
import {Effect} from "../game-mechanics/effect.ts";
import {randomNumber} from ".././utils/random.ts";
import {resourceBasePrice, ResourceTypeList, ResourceTypes} from "../constants.ts";
import {noEmpty} from ".././utils/noEmpty.ts";


let resIdCounter = 0

interface ResourceDataInterface extends GameDataInterface {
  name: ResourceTypes
  id: number
  unlock: () => boolean
}

function _(name: ResourceTypes): ResourceDataInterface {
  return {
    name: name,
    id: resIdCounter++,
    unlock: () => true
  }
}

export function parseResourceName(key: ResourceTypes) {
  switch (key) {
    case "energy":
      return "能量"
    case "copper":
      return "铜"
    case "air":
      return "空气"
    case "coal":
      return "煤"
    case "iron":
      return "铁"
    case "water":
      return "水"
    default:
      throw new ValueNotFoundError(`什么resource名字：${key}`)
  }
}

export class ResourceClass
  extends GameDataClass
  implements GameDataInterface {

  static all = [] as ResourceClass[]

  static energy: ResourceClass
  static air: ResourceClass
  static water: ResourceClass
  static copper: ResourceClass
  static coal: ResourceClass
  static iron: ResourceClass

  refs: {
    unlocked: Ref<boolean>
    amount: Ref<number>,
    maximum: Ref<number>,
    change: Ref<number>,
    max_record: Ref<number>,
    affects: {
      pro: Ref<{ source: [string, number][], total: number }>
      consume: Ref<{ source: [string, number][], total: number }>
      maxAdd: Ref<{ source: [string, number][], total: number }>
      maxMult: Ref<{ source: [string, number][], total: number }>
    },
    changes: Ref<string>,
  }
  name: ResourceTypes
  private readonly _parsed: string

  constructor(data: ResourceDataInterface) {
    super(data);
    this.name = data.name;
    this.onLogic()

    if (player.resource[this.name] == undefined) {
      player.resource[this.name] = {
        amount: 0,
        maximum: 1e4,
        change: 0,
        max_record: 0,
        affects: {
          pro: {source: [], total: 0},
          consume: {source: [], total: 0},
          maxAdd: {source: [], total: 0},
          maxMult: {source: [], total: 0},
        },
      }
    }
    if (player.market.basePrice[this.name] == undefined) {
      player.market.basePrice[this.name] =
        randomNumber(...resourceBasePrice[this.name], 2)
    }

    this.refs = {
      unlocked: ref(false), // useLess Forever (?
      amount: ref(0),
      maximum: ref(1e4),
      change: ref(0),
      changes: ref(""),
      max_record: ref(0),
      affects: {
        pro: ref({source: [], total: 0}),
        consume: ref({source: [], total: 0}),
        maxAdd: ref({source: [], total: 0}),
        maxMult: ref({source: [], total: 0}),
      },
    }
    this._parsed = parseResourceName(this.name)
  }

  get unlocked(): boolean {
    return true
  }

  get amount() {
    return player.resource[this.name].amount
  }

  set amount(value: number) {
    let rounded = Numbers.round(value)
    this.change += rounded - this.amount

    player.resource[this.name].amount = rounded
    this.refs.amount.value = value

    this.max_record = Math.max(rounded, this.max_record)
  }

  get maximum() {
    return player.resource[this.name].maximum
  }

  set maximum(value: number) {
    player.resource[this.name].maximum = value
    this.refs.maximum.value = value
  }

  get change() {
    return player.resource[this.name].change
  }

  set change(value: number) {
    let rounded = Numbers.round(value, 2)
    player.resource[this.name].change = rounded
    this.refs.change.value = rounded
    this.refs.changes.value = this.changes
  }

  get changes() {
    return this.amount < this.maximum ?
      Numbers.formatInt(this.change, false, 2) + `/s` : `Max`
  }

  get max_record() {
    return player.resource[this.name].max_record
  }

  set max_record(value) {
    player.resource[this.name].max_record = value
    this.refs.max_record.value = value
  }

  get effects() {
    return player.resource[this.name].affects
  }

  get basePrice() {
    return player.market.basePrice[this.name]
  }

  set basePrice(value: number) {
    player.market.basePrice[this.name] = value
  }

  get parsed() {
    return this._parsed
  }

  static createAccessor() {
    this.all = []
    for (const resType of ResourceTypeList) {
      let ins = new this(_(resType))
      this.all.push(ins)
      this[resType] = ins
    }
    const accessor = (name: ResourceTypes) =>
      noEmpty(this.all.find(x => x.name === name))
    accessor.all = this.all
    accessor.class = ResourceClass

    accessor.energy = this.energy
    accessor.air = this.air
    accessor.water = this.water
    accessor.copper = this.copper
    accessor.coal = this.coal
    accessor.iron = this.iron
    return accessor
  }

  /*
  * directly changes ```player.market.basePrice```
  * */
  static generateBasePrice() {
    for (const res of this.all) {
      const [min, max] = resourceBasePrice[res.name]
      res.basePrice = randomNumber(min, max, 2)
    }
  }

  updateRef() {
    this.refs.amount.value = Numbers.round(this.amount, 2)
    this.refs.maximum.value = this.maximum
    this.refs.change.value = this.change
    this.refs.max_record.value = this.max_record

    this.refs.affects.pro.value = this.effects.pro
    this.refs.affects.consume.value = this.effects.consume
    this.refs.affects.maxAdd.value = this.effects.maxAdd
    this.refs.affects.maxMult.value = this.effects.maxMult
  }

  updateLogic() {
    this.updateEffect()
    this.change = 0
  }

  updateEffect() {
    if (!Effect.hasChanged()) return
    const effects = Effect.effects.filter(
      x => x.effects.filter(
        x => x.target == this.name
      ).length > 0
    )

    // refresh
    this.effects.pro = {source: [], total: 0}
    this.effects.maxMult = {source: [], total: 0}
    this.effects.consume = {source: [], total: 0}
    this.effects.maxAdd = {source: [], total: 0}

    /*for (const [source, id, small] of effects) {
      if (!small.type) {
        throw new Error(`wtf resource Effect dont have type ${source} ${id}`)
      }
      this.affects[small.type].source.push(
        [Effect.parseAffectName(source, id), small.factor])
      this.affects[small.type].total += small.factor
    }*/
    for (const eff of effects) {
      for (const short of eff.effects) {
        if (!short.type || !(short.type in this.effects)) {
          throw new Error(`wtf resource Effect dont have type ${eff.source} ${eff.id}`)
        }
        this.effects[short.type].source.push(
          [Effect.parseEffectName(eff.source, eff.id), short.factor]
        )
        this.effects[short.type].total += short.factor
      }
    }
    this.updateMaximum()
  }

  updateMaximum() {
    this.maximum = Numbers.round((1e4 + this.effects.maxAdd.total) * (1 + this.effects.maxMult.total))
  }

  canProduce(value: number) {
    return this.amount + value * (1 + this.effects.pro.total) <= this.maximum
  }

  canCost(value: number) {
    return this.amount >= value * (1 - this.effects.consume.total)
  }

  doProduce(value: number, useEffect: boolean) {
    this.amount += useEffect ?
      value * (1 + this.effects.pro.total) : value
  }

  doCost(value: number, useEffect: boolean) {
    this.amount -= useEffect ?
      value * (1 - this.effects.consume.total) : value
  }

}


export const Resources = ResourceClass.createAccessor()
window.dev.resources = Resources