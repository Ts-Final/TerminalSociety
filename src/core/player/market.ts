import {getNumArray} from "./generator.ts";
import {GameDataBase} from "../GameDataBase";
import {ResourceTypes} from "../GameDataBase/resource.ts";
import {randomElements, randomNumber} from "../functions/random.ts";
import {player} from "./index.ts";
import {Numbers} from "../functions/Numbers.ts";
import {notify} from "../functions/notify.ts";


/**
 * Sets value of
 * ```
 * player.market.exchange
 * ```
 * @borrows player.market.exchange as exchange
 */
export function generateExchange() {
  let v: [string, ResourceTypes, number, number, number][] = []

  v.push(["???", "energy", 0, 0, 0.2])
  for (const company of GameDataBase.Market.Company) {
    const sellResourceTypes = randomElements(company.allResource)

    for (let i = 0; i < sellResourceTypes.length; i++) {
      const resKey = sellResourceTypes[i]
      const isADV = resKey in company.advantage
      let amount = isADV ? Numbers.round(randomNumber(...company.advPow))
        : Numbers.round(randomNumber(0.95, 1.05))
      amount *= company.baseAmount
      let price = player.market.basePrice[resKey as ResourceTypes]
      price *= randomNumber(0.9, 1.05)
      price = Numbers.round(price,3)

      /* Anti-undefined check <- whats dis lol */
      let arr = [company.name, resKey, amount, 0, price]
      let fail = false
      arr.forEach((v) => fail = fail || v == undefined)
      if (fail) {
        continue
      }

      v.push([company.name, resKey, amount, 0, price])
    }
  }
  return v
}

/**
 * Sets value of
 * ```
 * player.market.basePrice
 * ```
 */
export function generateBasePrice() {
  return {
    energy: Numbers.round(randomNumber(0.5, 0.7),2),
    iron: Numbers.round(randomNumber(12, 16),2),
    water: Numbers.round(randomNumber(2, 3),2),
    coal: Numbers.round(randomNumber(8, 11),2),
    copper: Numbers.round(randomNumber(15, 19),2),
    air: 0,
  }
}

export function generateMarket() {
  player.market.exchange = generateExchange()
  player.market.basePrice = generateBasePrice()
  notify.normal("市场交易已刷新",1000)
}

export const __player_market = {
  affect: 0,
  /**
   * Unlocked, bought
   */
  upgrades: getNumArray<[boolean, boolean]>
  (GameDataBase.Market.Upgrade.length, [false, false]),

  /**
   * ```
   * {
   * 0:unlocked,
   * 1:relation,
   * }
   * ```
   */
  company: getNumArray<[boolean, number]>(GameDataBase.Market.Company.length, [false, 0]),

  /**
   * ```
   * {
   *   0:company,
   *   1:Type,
   *   2:sellAmountMax // 库存量
   *   3:boughtAmount // 已买量
   *   4:price // 价格
   * }
   * ```
   */
  exchange: [] as [string, ResourceTypes, number, number, number][],

  basePrice: {
    energy: Numbers.round(randomNumber(0.5, 0.7),2),
    iron: Numbers.round(randomNumber(12, 16),2),
    water: Numbers.round(randomNumber(2, 3),2),
    coal: Numbers.round(randomNumber(8, 11),2),
    copper: Numbers.round(randomNumber(15, 19),2),
    air: 0,
  }

}