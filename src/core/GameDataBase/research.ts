import {ResourceTypes} from "./resource.ts";
import {player} from "../player";
import {effect, effectShort, effectSmall} from "../game-mechanics/effect.ts";
import {Numbers} from "../functions/Numbers.ts";

export interface Research {
  id: number
  name: string
  des: string
  itl: string
  effect: effectShort[]
  cost: [ResourceTypes, number][]
  time: number
  maxLevel: number
  timePow: number

  get unlock(): boolean
}

/**
 * 将Research变成Effect
 * @param r
 * @param lv
 */
export function researchToEffect(r: Research, lv: number): effect {
  let e: effectSmall[] = []
  for (const eff of r.effect) {
    if (eff.length == 2) {
      e.push({
        target: eff[0],
        factor: Numbers.round(eff[1] * ((lv + 1) / r.maxLevel), 4)
      })
    } else if (eff.length == 3) {
      e.push({target: eff[0], type: eff[1],
        factor: Numbers.round(eff[2] * ((lv+1) / r.maxLevel), 4)})
    }
  }
  return {
    source: "research",
    id: r.id,
    effects: e
  }
}

export const Researches: Research[] = [
  {
    id: 0,
    name: '电板扩建',
    des: '加几块太阳能板，也许可以让发电更多一点',
    itl: '楼顶一片黑。下面的人看了都说好，太阳是照不到了。不过也看不见阳光了。',
    effect: [['energy', 'pro', 0.05], ["energy", 'maxAdd', 1e3]],
    cost: [['iron', 10]],
    time: 10,
    maxLevel: 2,
    unlock: true,
    timePow: 1.5
  },
  {
    id: 1,
    name: '气象观测 1',
    des: '气象在有些时候还是很重要的',
    itl: '如果天下起了大雨，那么人们也许会陷入哀伤。如果天下起了大鱼……谁知道呢？',
    effect: [["air", 'pro', 0.05], ['water', "pro", 0.01]],
    cost: [],
    time: 15,
    maxLevel: 1,
    get unlock() {
      return player.resource.air.max_record >= 10
    },
    timePow: 1,
  }
]
