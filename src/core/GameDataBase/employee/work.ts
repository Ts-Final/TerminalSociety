import {effect, effectShort, effectSmall} from "../../game-mechanics/effect.ts";
import {Numbers} from "../../functions/Numbers.ts";

export interface employeeWork {
  id: number
  name: string
  name2?: string
  des: string
  maxLevel: number
  rarity: number
  skill(lv:number): effectShort[]
}


export function employeeWorkSkillToAffect(ew: employeeWork,lv:number): effect {
  let es: effectSmall[] = []
  for (const eff of ew.skill(lv)) {
    if (eff.length == 2) {
      es.push({
        target: eff[0],
        factor: Numbers.round(eff[1], 2)
      })
    } else if (eff.length == 3) {
      es.push({target: eff[0], type: eff[1], factor: eff[2]})
    }
  }
  return {
    source: "employee",
    id: ew.id,
    effects: es
  }
}

export const __EmployeeWork: employeeWork[] = [
  {
    id: 0,
    name: "牢大",
    name2: `Kobe Bryant`,
    des: "孩子们，我回来了",
    maxLevel: 5,
    rarity: 1,
    skill:(lv:number) => [
      ["research", 0.01 * lv],
      ['energy',"pro", 0.02 / 5 * lv],
    ]
  },
  {
    id:1,
    name:"星",
    des:'你明白，这世上唯一还能一起玩耍的人，也就只有这位了。或者，更应该向那些人致以再见，送去离别的挥手。',
    rarity: 5,
    maxLevel: 5,
    skill: (lv:number) => [
      ['energy','pro',0.01 * lv],
      ['energy','maxAdd',100 * lv]
    ]
  }
]
