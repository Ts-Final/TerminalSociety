import {GameDataClass, GameDataInterface} from "./baseData.ts";
import {ref, Ref} from "vue";
import {player} from "../player.ts";
import {ValueNotFoundError} from ".././utils/errors.ts";
import {Effect} from "../game-mechanics/effect.ts";
import {randomNumber} from ".././utils/random.ts";
import {resourceBasePrice, ResourceTypeList, ResourceTypes} from "../constants.ts";
import {noEmpty} from ".././utils/noEmpty.ts";
import {Lazy} from "../utils/lazy.ts";
import {Decimal, DecimalSource} from "../utils/break_infinity.ts";


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

function toLazy(name: ResourceTypes) {
  function getter() {
    const dict = {
      pro: {source: [] as [string, number][], total: new Decimal(0)},
      maxMult: {source: [] as [string, number][], total: new Decimal(0)},
      consume: {source: [] as [string, number][], total: new Decimal(0)},
      maxAdd: {source: [] as [string, number][], total: new Decimal(0)},
    }
    const effects = Effect.effects.filter(
      x => x.effects.filter(
        x => x.target == name
      ).length > 0
    )
    for (const eff of effects) {
      const effName = Effect.effToName(eff);

      for (const short of eff.effects) {
        if (short.target !== name) continue
        if (!short.type) continue
        dict[short.type].total.add(short.factor)
        dict[short.type].source.push(
          [effName, short.factor]
        )
      }

    }
    return dict
  }

  return Lazy.bindTo(getter, Effect.collection)
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
    amount: Ref<Decimal>,
    maximum: Ref<Decimal>,
    change: Ref<Decimal>,
    max_record: Ref<Decimal>,
    affects: {
      pro: Ref<{ source: [string, Decimal][], total: Decimal }>
      consume: Ref<{ source: [string, Decimal][], total: Decimal }>
      maxAdd: Ref<{ source: [string, Decimal][], total: Decimal }>
      maxMult: Ref<{ source: [string, Decimal][], total: Decimal }>
    },
  }
  name: ResourceTypes
  lazy: Lazy
  private readonly _parsed: string

  constructor(data: ResourceDataInterface) {
    super(data);
    this.name = data.name;
    this.onLogic()

    if (player.resource[this.name] == undefined) {
      player.resource[this.name] = {
        amount: new Decimal(0),
        maximum: new Decimal(1e4),
        change: new Decimal(0),
        max_record: new Decimal(0),
        affects: {
          pro: {source: [], total: new Decimal(0)},
          consume: {source: [], total: new Decimal(0)},
          maxAdd: {source: [], total: new Decimal(0)},
          maxMult: {source: [], total: new Decimal(0)},
        },
      }
    }
    if (player.market.basePrice[this.name] == undefined) {
      player.market.basePrice[this.name] =
        new Decimal(randomNumber(...resourceBasePrice[this.name], 2))
    }

    this.refs = {
      unlocked: ref(false), // useLess Forever (?
      amount: ref(new Decimal(0)),
      maximum: ref(new Decimal(1e4)),
      change: ref(new Decimal(0)),
      max_record: ref(new Decimal(0)),
      affects: {
        pro: ref({source: [], total: new Decimal(0)}),
        consume: ref({source: [], total: new Decimal(0)}),
        maxAdd: ref({source: [], total: new Decimal(0)}),
        maxMult: ref({source: [], total: new Decimal(0)}),
      },
    }
    this._parsed = parseResourceName(this.name)
    this.lazy = toLazy(data.name)
  }

  get unlocked(): boolean {
    return true
  }

  get amount(): Decimal {
    return player.resource[this.name].amount
  }

  set amount(value: DecimalSource) {
    this.change = this.change.add(value).sub(this.amount)
    player.resource[this.name].amount.fromValue(value)
    this.refs.amount.value = this.amount
    this.max_record = Decimal.max(this.amount, this.max_record)
  }

  get maximum() {
    return player.resource[this.name].maximum
  }

  set maximum(value: Decimal) {
    player.resource[this.name].maximum = value
    this.refs.maximum.value = value
  }

  get change(): Decimal {
    return player.resource[this.name].change
  }

  set change(value: DecimalSource) {
    player.resource[this.name].change.fromValue(value)
    this.refs.change.value = Decimal.fromValue(value)
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

  set effects(value) {
    player.resource[this.name].affects = value
    this.refs.affects.pro.value = value.pro
    this.refs.affects.consume.value = value.consume
    this.refs.affects.maxAdd.value = value.maxAdd
    this.refs.affects.maxMult.value = value.maxMult
  }

  get basePrice():Decimal {
    return player.market.basePrice[this.name]
  }

  set basePrice(value: DecimalSource) {
    player.market.basePrice[this.name].fromValue(value)
  }

  get parsed() {
    return this._parsed
  }

  static createAccessor(): {
    (name: ResourceTypes): ResourceClass,
    all: ResourceClass[],
    energy: ResourceClass,
    air: ResourceClass,
    water: ResourceClass,
    copper: ResourceClass,
    coal: ResourceClass,
    iron: ResourceClass,
    class: typeof ResourceClass,
  } {
    this.all = []
    for (const resType of ResourceTypeList) {
      let ins = new this(_(resType))
      this.all.push(ins)
      this[resType] = ins
    }
    const accessor = (name: ResourceTypes) =>
      noEmpty(this.all.find(x => x.name === name))

    accessor.all = this.all

    accessor.energy = this.energy
    accessor.air = this.air
    accessor.water = this.water
    accessor.copper = this.copper
    accessor.coal = this.coal
    accessor.iron = this.iron
    accessor.class = this
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
    this.refs.amount.value = this.amount
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
    this.effects = this.lazy.value
    this.updateMaximum()
  }

  updateMaximum() {
    // this.maximum = Numbers.round((1e4 + this.effects.maxAdd.total) * (1 + this.effects.maxMult.total))
    this.maximum = this.effects.maxAdd.total.add(1e4).mul(this.effects.maxMult.total.add(1))
  }

  canProduce(value: DecimalSource) {
    return this.maximum.gt(
      this.effects.pro.total.add(1).mul(value).add(this.amount)
    )
  }

  canCost(value: number) {
    return this.amount.gt(
      this.effects.consume.total.neg().add(1).mul(value)
    )
  }

  doProduce(value: number, useEffect: boolean) {
    this._produce(useEffect ?
      this.effects.pro.total.add(1).mul(value) : value)
  }

  doCost(value: number, useEffect: boolean) {
    this._cost(useEffect ?
      this.effects.consume.total.neg().add(1).mul(value) : value
    )
  }
  _produce(value:DecimalSource) {
    this.amount = this.amount.add(value)
  }
  _cost(value:DecimalSource) {
    this.amount = this.amount.sub(value)
  }

}


export const Resource = ResourceClass.createAccessor()
window.dev.resources = Resource