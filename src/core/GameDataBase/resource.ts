import {GameDataClass, GameDataInterface} from "./baseData.ts";
import {ref, Ref} from "vue";
import {player} from "../player.ts";
import {ValueNotFoundError} from "../functions/errors.ts";
import {Numbers} from "../functions/Numbers.ts";

/**
 * 资源类型
 */
export type ResourceTypes = "energy" | "iron" | "copper" | "air" | "water" | "coal"
export const ResourceTypeList = ["energy", "iron", "copper", "air", "water"]
/**
 * 对Resource影响的类型
 * 消耗/产出/最大值
 */
export type resourceEffectTypes = 'consume' | 'pro' | 'maxAdd' | 'maxMult'

let resIdCounter = 0

interface ResourceDataInterface extends GameDataInterface {
  name: string
  id: number
  unlock: () => boolean
}

function _(name: string): ResourceDataInterface {
  return {
    name: name,
    id: resIdCounter++,
    unlock: () => true
  }
}

export class ResourceClass
  extends GameDataClass
  implements GameDataInterface {

  static all = [] as ResourceClass[]

  static energy = new ResourceClass(_('energy'))
  static air = new ResourceClass(_('air'))
  static water = new ResourceClass(_('water'))
  static copper = new ResourceClass(_('copper'))
  static coal = new ResourceClass(_('coal'))
  static iron = new ResourceClass(_('iron'))

  refs: {
    unlocked: Ref<boolean>
    amount: Ref<number>,
    maximum: Ref<number>,
    change: Ref<number>,
    max_record: Ref<number>,
    affects: {
      pro: Ref<[string, number][]>
      consume: Ref<[string, number][]>
      maxAdd: Ref<[string, number][]>
      maxMult: Ref<[string, number][]>
    },
  }

  constructor(data: ResourceDataInterface) {
    super(data);
    ResourceClass.all.push(this)

    if (player.resource[this.name] == undefined) {
      player.resource[this.name] = {
        amount: 0,
        maximum: 1e4,
        change: 0,
        max_record: 0,
        affects: {
          pro: [] as [string, number][],
          consume: [] as [string, number][],
          maxAdd: [] as [string, number][],
          maxMult: [] as [string, number][],
        },
      }
    }

    this.refs = {
      unlocked: ref(false), // useLess Forever (?
      amount: ref(0),
      maximum: ref(1e4),
      change: ref(0),
      max_record: ref(0),
      affects: {
        pro: ref([] as [string, number][]),
        consume: ref([] as [string, number][]),
        maxAdd: ref([] as [string, number][]),
        maxMult: ref([] as [string, number][]),
      },
    }
  }

  get unlocked(): boolean {
    return true
  }

  get amount() {
    return player.resource[this.name].amount
  }

  set amount(value: number) {
    player.resource[this.name].amount = value
  }

  get maximum() {
    return player.resource[this.name].maximum
  }

  set maximum(value: number) {
    player.resource[this.name].maximum = value
  }

  get change() {
    return player.resource[this.name].change
  }

  set change(value: number) {
    player.resource[this.name].change = value
  }

  get max_record() {
    return player.resource[this.name].max_record
  }

  set max_record(value: number) {
    player.resource[this.name].max_record = value
  }

  get affects() {
    return player.resource[this.name].affects
  }

  updateVisual() {
    this.refs.amount.value = Numbers.round(this.amount,2)
    this.refs.maximum.value = this.maximum
    this.refs.change.value = this.change
    this.refs.max_record.value = this.max_record

    this.refs.affects.pro.value = this.affects.pro
    this.refs.affects.consume.value = this.affects.consume
    this.refs.affects.maxAdd.value = this.affects.maxAdd
    this.refs.affects.maxMult.value = this.affects.maxMult
  }

  useBase() {
    this._boundBase(this)
    return this.refs
  }

  parseName() {
    switch (this.name) {
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
        throw new ValueNotFoundError(`什么resource名字：${this.name}`)
    }

  }
}

export const Resources = ResourceClass