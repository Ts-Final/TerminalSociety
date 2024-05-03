import {countryName} from "../situation/country.ts";
import {effectData} from "../../game-mechanics/effect.ts";
import {GameDataClass} from "../baseData.ts";
import {ResourceTypes} from "../../constants.ts";
import {player} from "../../player.ts";
import {ref, Ref} from "vue";
import {Money} from "./money.ts";
import {Resource} from "../resource.ts";
import {noEmpty} from "../.././utils/noEmpty.ts";

export interface upg {
  id: number
  name: string
  des: string
  costResource: [ResourceTypes, number][]
  costMoney: number
  country: countryName
  effects: effectData[]

  unlock(): boolean
}

const UpgradeData: upg[] = [
  {
    id: 0,
    name: "挖掘许可",
    des: "有了这个就可以持有矿场了。",
    costMoney: 100,
    costResource: [],
    unlock: () => true,
    country: "teLin",
    effects: []
  }
]

export class UpgradeClass extends GameDataClass {
  static all: UpgradeClass[]
  des: string
  costResource: [ResourceTypes, number][]
  costMoney: number
  country: countryName
  effects: effectData[]

  refs: {
    unlocked: Ref<boolean>,
    bought: Ref<boolean>,
    canBuy: Ref<boolean>,
  }


  constructor(data: upg) {
    super(data);
    this.des = data.des;
    this.country = data.country;
    this.effects = data.effects;
    this.costResource = data.costResource;
    this.costMoney = data.costMoney;

    if (player.market.upgrades[this.id] == undefined) {
      player.market.upgrades[this.id] = [false, false];
    }
    this.refs = {
      unlocked: ref(false),
      bought: ref(false),
      canBuy: ref(false),
    }
    this.onLogic()
  }

  get unlocked() {
    return player.market.upgrades[this.id][0];
  }

  set unlocked(value: boolean) {
    player.market.upgrades[this.id][0] = value;
    this.refs.unlocked.value = value
  }

  get bought() {
    return player.market.upgrades[this.id][1];
  }

  set bought(value: boolean) {
    player.market.upgrades[this.id][1] = value;
    this.refs.bought.value = value
  }

  get canBuy() {
    let flag = true
    flag &&= Money.amount.gte(this.costMoney)
    for (const [res, value] of this.costResource) {
      flag &&= Resource(res).amount.gte(value)
    }
    return flag
  }

  static fromData(...data: upg[]) {
    this.all = data.map(e => new this(e))
    const accessor = (id: number) => noEmpty(this.all.find(e => e.id == id))
    accessor.all = this.all
    return accessor
  }

  purchase() {
    if (!this.canBuy) {
      return
    }

    Money.spend(this.costMoney)
    for (const [res, value] of this.costResource) {
      Resource(res).doProduce(value, false)
    }
  }

  updateLogic() {
    this.unlocked ||= this.unlock()
  }

  updateRef() {
    this.refs.canBuy.value = this.canBuy
    this.refs.unlocked.value = this.unlocked
  }

}

export const Upgrades = UpgradeClass.fromData(...UpgradeData)