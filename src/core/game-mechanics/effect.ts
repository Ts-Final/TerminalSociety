import {resourceEffectTypes, ResourceTypes} from "../GameDataBase/resource.ts";
import {GameStats} from "./gameStats.ts";
import {GameDataBase} from "../GameDataBase";
import {NotImplementedError} from "../functions/errors.ts";
import {Numbers} from "../functions/Numbers.ts";

export type effectSource = 'research' | "employee" | "NMP"
/**
 * target的影响目标
 */
export type effectTarget = ResourceTypes | "research"

/**
 * 用于GDB中一些简单的affect效果
 * 与effectSmall不同，反正
 */
export type effectShort = [
  effectTarget,
  resourceEffectTypes,
  number
] | [
  effectTarget,
  number
]

/**
 * 细分到每一个effect中的一小条，作用类似于effectShort
 * @property target
 * @property type
 * @property factor
 */
export interface effectSmall {
  target: effectTarget,
  type?: resourceEffectTypes,
  factor: number
}

export interface effect {
  source: effectSource
  id: number
  /**
   * 这样一个effect可以对应一堆effects
   */
  effects: effectSmall[]
}

export const Effect = {
  allEffects: GameStats.effects,

  registerEffect(target: effect) {
    if (this.allEffects.find((e) => e.id == target.id && e.source == target.source)) {
      return
    }
    this.allEffects.push(target)
  },
  get effects() {
    return this.toEffects(...this.allEffects)
  },
  /**
   * 记得check返回是不是undefined
   */
  findEffect(source: effectSource, id: number) {
    return this.allEffects.find((v) => v.id == id && v.source == source)
  },

  clearSpecEffect(source: effectSource, id: number) {
    const effect = this.findEffect(source, id)
    if (!effect) {
      return
    }
    this.allEffects.splice(
      this.allEffects.findIndex((e) => e == effect),
      1
    )
  },
  /**
   * 返回带[来源，id，effectSmall]的东西
   * @param e
   */
  toEffects(...e: effect[]) {
    let v: [string, number, effectSmall][] = []
    for (const eff of e) {
      for (const small of eff.effects) {
        v.push([eff.source, eff.id, small])
      }
    }
    return v
  },
  toSmall(...e: effect[]): effectSmall[] {
    let v: effectSmall[] = []
    for (const eff of e) {
      v.push(...eff.effects)
    }
    return v
  },

  /* calculate related */
  calcResource(rt: ResourceTypes, et: resourceEffectTypes) {
    const v = this.effects.filter(
      (e) => e[2].target == rt && e[2].type == et
    )
    const r = { // return value
      names: [] as [string, number][],
      value: 0
    }
    for (const e of v) {
      r.names.push([this.parseAffectName(e[0], e[1]), e[2].factor])
      r.value += e[2].factor
    }
    return r
  },
  calcResourceMax(r: ResourceTypes) {
    return Numbers.round((1e4 + this.calcResource(r, 'maxAdd').value) *
      (1 + this.calcResource(r, "maxMult").value), 2)
  },
  calcResearchProgress() {
    let arr =
      this.effects.filter((e) => e[2].target == "research")
    let v = 1
    for (const [, , e] of arr) {
      v += e.factor
    }
    return v
  },
  /**
   * @param e {effect} Effects
   *
   * @return {[x:string]:number}
   * 期望返回eg:
   * ```
   * {
   *  "energy,pro":114,
   *  "research":514,
   * }
   * ```
   */
  calcFromEffects(...e: effect[]):{[x:string]:number} {
    const smalls = this.toSmall(...e)
    let v: { [x: string]: number } = {}
    for (const small of smalls) {
      if (small.type) {
        if (`${small.target},${small.type}` in v) {
          v[`${small.target},${small.type}`] += small.factor
        } else {
          v[`${small.target},${small.type}`] = small.factor
        }
      } else {
        if (small.target in v) {
          v[small.target] += small.factor
        } else {
          v[small.target] = small.factor
        }
      }
    }
    return v
  },

  /* Parse Related */
  parseAffectName(s: string, id: number) {
    switch (s) {
      case "research" :
        let research = GameDataBase.Researches.find((v) => v.id == id)
        if (!research) {
          throw new Error()
        }
        return `研究：${research.name}`

      case "NMP":
        throw new NotImplementedError("Effect not implemented")

      case "employee":
        let employee = GameDataBase.Employees.work.find((v) => v.id == id)
        if (!employee) {
          throw new Error()
        }
        return `雇员：${employee.name}`
      default:
        throw new Error(`WTF effect ${s} ${id}`)
    }
  },
  parseEffect(e: effect): { target: string, type?: string, factor: string }[] {
    let v = []
    for (const es of e.effects) {
      let factor = ["maxAdd"].includes(es.type || 'undefined')
        ? Numbers.formatInt(es.factor, false, 0)
        : Numbers.formatInt(es.factor, true, 3)
      v.push({
        target: this.parseTarget(es.target),
        type: es.type || undefined,
        factor,
      })
    }
    return v
  },
  parseTarget(s: string) {
    switch (s) {
      case "energy":
        return "能量"
      case "copper":
        return "铜"
      case "air":
        return "空气"
      case "coal":
        return "煤"
      case "iron":
        return "铁"
      case "water":
        return "水"
      case "research":
        return "研究"
      default:
        throw new Error(`wtf effectTarget ${s}`)
    }
  },
  parseType(s: string) {
    switch (s) {
      case "maxMult":
        return "最大 +"
      case "maxAdd":
        return "最大 +"
      case "consume":
        return "消耗 -"
      case "pro":
        return "生产 +"
    }
  }
}
