import {exchangeShort, ResourceTypes} from "./constants.ts";

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
      amount: number,
      maximum: number,
      change: number,
      max_record: number,
      affects: {
        pro: { source: [string, number][], total: number },
        consume: { source: [string, number][], total: number },
        maxAdd: { source: [string, number][], total: number },
        maxMult: { source: [string, number][], total: number },
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
  research: [] as [boolean, boolean, number, number][],
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
    basePrice: {} as { [key in ResourceTypes]: number }

  },
  version: "Test 08 change 1",
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
    current: 0,
    totalSpend: 0,
    totalEarned: 0,

  },
  saveTime: 0,
  dailyFreshTime: 0,
  dev: false,
  options: {
    updateRate: 33,
    laugh: false,
    news: true,
  },
  /**
   * {
   *   0: unlocks
   * }
   * */
  tabs: {} as {
    [x: number]: {
      unlocks: boolean[],
      hide: boolean[],
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
  story: {} as { [key: string]: [boolean] },
  /* For some times testing or anyway to speed the game up in this way,
  * instead of calling EventHub.dispatch more often, thats crazy when
  * calculating game speed */
  globalAmplifier: 0,

}
declare global {
  interface Window {
    player: any,
    dev: any,
  }
}

window.player = player