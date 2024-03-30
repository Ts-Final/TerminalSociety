import {ResourceTypes} from "./GameDataBase/resource.ts";

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
        pro: [string, number][],
        consume: [string, number][],
        maxAdd: [string, number][],
        maxMult: [string, number][],
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
    exchange: [] as [string, ResourceTypes, number, number, number][],
    basePrice: {
      energy: 0,
      iron: 0,
      water: 0,
      coal: 0,
      copper: 0,
      air: 0,
    }

  },
  version: "Test 08 change 1",
  employee: {
    work: [] as [boolean, boolean, number, number, number][],
  },
  // country: __player_country,
  display: 1,
  how2play: 1,
  money: 0,
  saveTime: 0,
  dailyFreshTime: 0,
  dev: false,
  options: {
    tabShown: [] as boolean[],
    updateRate: 33,
    laugh: false,
    news: true,
  },

}
declare global {
  interface Window {
    player: any,
    dev: any,
  }
}

window["player"] = player