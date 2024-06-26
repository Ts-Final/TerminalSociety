import {countryName} from "../situation/country.ts";
import {GameDataClass, GameDataInterface} from "../baseData.ts";
import {player} from "../../player.ts";
import {Accessor, exchangeShort, ResourceTypes} from "../../constants.ts";
import {randomElements, randomNumber} from "../.././utils/random.ts";
import {Numbers} from "../.././utils/Numbers.ts";
import {Resource} from "../resource.ts";
import {noEmpty} from "../.././utils/noEmpty.ts";

export interface company extends GameDataInterface {
  id: number
  name: string // 名字
  des: string // 描述
  country: countryName // 所属国家 会有依据国家relation而改变价格.
  advantage: ResourceTypes[] // 售卖量比较多的资源
  advPow: [number, number] // adv售卖量的浮动
  allResource: ResourceTypes[]
  baseAmount: number // 售卖数量基础
  generate?(): exchangeShort[]
}

const counter = Numbers.counter(0, 1)

export const CompanyData: company[] = [
  {
    id: counter.next(),
    name: "珉琳矿务局",
    des: "家乡仍然值得信任，只可惜他们……",
    country: 'xi',
    advantage: ['iron', 'copper'],
    advPow: [1.25, 1.3],
    baseAmount: 2e3,
    allResource: ["iron", "copper", "coal"],
    condition: () => true,
  },
  {
    id: counter.next(),
    name: "初式",
    des: "你觉得这家公司很熟悉，但是说不上什么样的感觉。",
    country: 'tsFinal',
    advantage: [],
    advPow: [1, 1],
    baseAmount: 1e3,
    allResource: ["energy", "water", "coal", "iron", "copper"],
    condition: () => true,
    generate() {
      const x: exchangeShort[] = []
      const id = this.id
      for (const str of this.allResource) {
        x.push({
          company: id,
          resource: str,
          stock: 1e3,
          bought: 0,
          price: Resource(str).basePrice.mul(0.8)
        })
      }
      return x
    },
  },

]

export class CompanyClass extends GameDataClass {
  static all: CompanyClass[]
  des: string // 描述
  country: countryName // 所属国家 会有依据国家relation而改变价格.
  advantage: ResourceTypes[] // 售卖量比较多的资源
  advPow: [number, number] // adv售卖量的浮动
  allResource: ResourceTypes[]
  baseAmount: number // 售卖数量基础

  constructor(data: company) {
    super(data);
    this.des = data.des
    this.country = data.country
    this.advantage = data.advantage
    this.advPow = data.advPow
    this.baseAmount = data.baseAmount
    this.allResource = data.allResource

    if (player.market.company[this.id] == undefined) {
      player.market.company[this.id] = {
        unlocked: true,
        relation: 0
      }
    }
    if (data.generate) this.generateExchange = data.generate
    this.onLogic()
  }

  get unlocked() {
    return player.market.company[this.id].unlocked
  }

  set unlocked(value) {
    player.market.company[this.id].unlocked = value
    this.refs.unlocked.value = value
  }

  get allResourceString() {
    return this.allResource.map((x) => {
      const name = Resource(x).parsed
      return name in this.advantage ? `<span style="color: #f7f12c;">${name}</span>` : name
    })
  }

  static createAccessor(...data: company[]): Accessor<CompanyClass> {
    this.all = data.map(x => new this(x))
    const accessor = (id: number) => noEmpty(this.all.find(x => x.id == id))
    accessor.all = this.all
    return accessor
  }


  updateLogic() {
    this.unlocked ||= this.condition()
  }

  updateRef() {
    this.refs.unlocked.value ||= this.unlocked
  }


  generateExchange() {
    const v: exchangeShort[] = []
    const resources = randomElements(this.allResource)
    const id = this.id
    for (const res of resources) {
      if (res === undefined) {
        continue
      }
      const pow = res in this.advantage ?
        randomNumber(...this.advPow, 2) : randomNumber(0.9, 1.05)
      let amount = this.baseAmount * pow
      amount = Numbers.round(amount, 0)
      let price = Resource(res).basePrice
      price = price.mul(randomNumber(0.9, 1.05, 2))
      v.push({
        price: price,
        company: id,
        resource: res,
        bought: 0,
        stock: amount
      })
    }

    return v
  }
}

export const Company = CompanyClass.createAccessor(...CompanyData)