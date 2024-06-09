import {countryName} from "../situation/country.ts";
import {effectData} from "../../game-mechanics/effect.ts";
import {GameDataClass} from "../baseData.ts";
import {Accessor, ResourceTypes} from "../../constants.ts";
import {player} from "../../player.ts";
import {ref, Ref} from "vue";
import {Money} from "./money.ts";
import {Resource} from "../resource.ts";
import {noEmpty} from "../.././utils/noEmpty.ts";
import {Decimal} from "../../utils/break_infinity.ts";

export interface upg {
  id: number
  name: string
  des: string
  costResource: [ResourceTypes, number][]
  price: number
  country: countryName
  effects: effectData[]

  condition(): boolean
}

const UpgradeData: upg[] = [
  {
    id: 0,
    name: "挖掘许可",
    des: "有了这个就可以持有矿场了。",
    price: 100,
    costResource: [],
    condition: () => true,
    country: "teLin",
    effects: []
  }
]

export class UpgradeClass extends GameDataClass {
  static all: UpgradeClass[]
  des: string
  costResource: [ResourceTypes, number][]
  price: number
  country: countryName
  effects: effectData[]

  refs: {
    unlocked: Ref<boolean>,
    bought: Ref<boolean>,
  }


  constructor(data: upg) {
    super(data);
    this.des = data.des;
    this.country = data.country;
    this.effects = data.effects;
    this.costResource = data.costResource;
    this.price = data.price;

    if (player.market.upgrades[this.id] == undefined) {
      player.market.upgrades[this.id] = {unlocked: false, bought:false};
    }
    this.refs = {
      unlocked: ref(false),
      bought: ref(false),
    }
    this.onLogic()
  }

  get unlocked() {
    return player.market.upgrades[this.id].unlocked
  }

  set unlocked(value: boolean) {
    player.market.upgrades[this.id].unlocked = value;
    this.refs.unlocked.value = value
  }

  get bought() {
    return player.market.upgrades[this.id].bought
  }

  set bought(value: boolean) {
    player.market.upgrades[this.id].bought = value;
    this.refs.bought.value = value
  }

  canBuy(money:Decimal) {
    let flag = true
    flag &&= money.gte(this.price)
    for (const [res, value] of this.costResource) {
      flag &&= Resource(res).amount.gte(value)
    }
    return flag
  }

  static fromData(...data: upg[]) : Accessor<UpgradeClass> {
    this.all = data.map(e => new this(e))
    const accessor = (id: number) => noEmpty(this.all.find(e => e.id == id))
    accessor.all = this.all
    return accessor
  }

  purchase() {
    if (!this.canBuy) {
      return
    }

    Money.spend(this.price)
    for (const [res, value] of this.costResource) {
      Resource(res).directCost(value)
    }
    this.bought = true
  }

  updateLogic() {
    if (!this.unlocked) {
      this.unlocked = this.condition()
    }
  }

  updateRef() {
    this.refs.unlocked.value = this.unlocked
    this.refs.bought.value = this.bought
  }

}

export const Upgrades = UpgradeClass.fromData(...UpgradeData)