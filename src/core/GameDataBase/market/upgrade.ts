import {countryEnum} from "../situation/country.ts";
import {ResourceTypes} from "../resource.ts";
import {effectShort} from "../../game-mechanics/effect.ts";

export interface upg {
  id:number
  name: string
  des: string
  costResource: [ResourceTypes, number][]
  costMoney: number
  unlock: boolean
  country: number
  effects: effectShort[]
}

export const Upgrade: upg[] = [
  {
    id:1,
    name:"挖掘许可",
    des:"有了这个就可以持有矿场了。",
    costMoney: 100,
    costResource: [],
    unlock: true,
    country: countryEnum.teLin,
    effects: []
  }
]