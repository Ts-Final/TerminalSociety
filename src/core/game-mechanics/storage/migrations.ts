import {Decimal} from "../../utils/break_infinity.ts";
import {exchangeShort, ResourceTypes} from "../../constants.ts";
import {Player, PlayerType} from "../../player.ts";
import {deepmergeAll} from "../../utils/deepmerge.ts";

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace LegacyPlayer {
  export interface v12 {
    resource: Record<string, {
      amount: Decimal,
      maximum: Decimal,
      change: Decimal,
      max_record: Decimal,
      affects: {
        pro: { source: [string, Decimal][], total: Decimal },
        consume: { source: [string, Decimal][], total: Decimal },
        maxAdd: { source: [string, Decimal][], total: Decimal },
        maxMult: { source: [string, Decimal][], total: Decimal },
      },
    }>
    task: [boolean, boolean][]
    research: [boolean, boolean, Decimal, number][]
    market: {
      affect: number,
      upgrades: [boolean, boolean][],
      company: [boolean, number][],
      exchange: exchangeShort[],
      basePrice: { [key in ResourceTypes]: Decimal }

    },
    version: number,
    employee: [boolean, boolean, number, number, number][],

    // country: __player_country,
    display: [number, number],
    how2play: number,
    money: {
      current: Decimal,
      totalSpend: Decimal,
      totalEarned: Decimal,

    },
    saveTime: number,
    dailyFreshTime: number,
    dev: boolean,
    options: {
      updateRate: number,
      laugh: boolean,
      news: boolean,
      autoStory: boolean,
    },
    tabs: Record<number, {
      unlocks: boolean[],
      show: boolean[],
      lastOpen: number
    }>,
    news: {
      seen: number[],
      totalSeen: number,
      stupidThings: {
        clicks: number,
      }
    },
    story: Record<string, [boolean, boolean]>,
    customName: string,
    lastUpdate: number,
    gameSpeed: number,
    final: boolean
  }
}

export const Migrations = {
  patches: {
    13: (player: LegacyPlayer.v12) => {
      player.version = 13
    },
    14: (player:any) => {
      const tabs = player.tabs
      for (const key in tabs) {
        player.tabs[key] = {
          unlocked: tabs[key].unlocks[0],
          show: tabs[key].show[0],
          lastOpen: tabs[key].lastOpen,
          sub: tabs[key].unlocks.slice(1).map(
            (value:boolean, index:number) => {
            return [value, tabs[key].show[index]]
          })
        }
      }
    }
  } as Record<number, (val: any) => any>,

  patch(saveData: any, maxVersion: number): PlayerType {
    const player = deepmergeAll<PlayerType>([Player.defaultStart, saveData]);
    const versions = Object.keys(this.patches).map(parseFloat).sort()

    let version: number | undefined;
    while (
      (version =
          versions.find(v => player.version < v && v < maxVersion)
      ) !== undefined) {
      const patch = this.patches[version];
      patch(player)
      player.version = version
    }
    return player
  }
}