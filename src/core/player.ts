import {exchangeShort, ResourceTypes} from "./constants.ts";
import {Decimal} from "./utils/break_infinity.ts";

/*
* For most of the values we dont set its values here, and in different
* DataClasses instead.
*
* The object (player) should only be used in DataClasses or other
* functional Objects, anyway dont use its value directly
* */
export const player = {
  resource: {} as {
    [key: string]: {
      amount: Decimal,
      maximum: Decimal,
      change: Decimal,
      max_record: Decimal,
      affects: {
        pro: { source: [string, Decimal][], total: Decimal },
        consume: { source: [string, Decimal][], total: Decimal },
        maxAdd: { source: [string, Decimal][], total: Decimal },
        maxMult: { source: [string,Decimal][], total: Decimal },
      },
    }
  },
  task: [] as [boolean, boolean][],
  /**
   * ```
   * {
   *   0:unlocked,
   *   1:activated,
   *   2:started,
   *   3:level
   * }
   * ```
   */
  research: [] as [boolean, boolean, Decimal, number][],
  market: {
    affect: 0,
    /**
     * {
     *   0: unlocked,
     *   1: bought,
     * }
     */
    upgrades: [] as [boolean, boolean][],

    /**
     * ```
     * {
     * 0:unlocked,
     * 1:relation,
     * }
     * ```
     */
    company: [] as [boolean, number][],

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
    exchange: [] as exchangeShort[],
    basePrice: {} as { [key in ResourceTypes]: Decimal }

  },
  version: 0,
  /**
   * {
   *   0: unlocked,
   *   1: equipped,
   *   2: level,
   *   3: exp,
   *   4: join-time
   * }
   */
  employee: [] as [boolean, boolean, number, number, number][],

  // country: __player_country,
  display: [0, 0] as [number, number],
  how2play: 1,
  money: {
    current: new Decimal(0),
    totalSpend: new Decimal(0),
    totalEarned: new Decimal(0),

  },
  saveTime: 0,
  dailyFreshTime: 0,
  dev: false,
  options: {
    updateRate: 33,
    laugh: false,
    news: true,
    autoStory: false,
  },
  /**
   * {
   *   0: unlocks
   * }
   * */
  tabs: {} as {
    [x: number]: {
      unlocks: boolean[],
      show: boolean[],
      lastOpen: number
    }
  },
  news: {
    seen: [] as number[],
    totalSeen: 0,
    stupidThings: {
      clicks: 0,
    }
  },
  story: {} as { [key: string]: [boolean,boolean] },
  customName: "",
  lastUpdate: Date.now(),
  gameSpeed: 1,
  final: false

}

declare global {
  interface Window {
    player: any,
    dev: any,
    Decimal: any,
  }
}

window.player = player
window.Decimal = Decimal