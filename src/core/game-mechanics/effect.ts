import {NotImplementedError} from ".././utils/errors.ts";
import {effectSource, effectTarget, resourceEffectTypes} from "../constants.ts";
import {Employee} from "../GameDataBase/employee/work.ts";
import {Research} from "../GameDataBase/research.ts";
import {LazyCollection} from "../utils/lazy.ts";
import {Decimal} from "../utils/break_infinity.ts";

/**
 * 用于GDB中一些简单的affect效果
 * 与effectSmall不同，反正
 */
export type effectData = [
  effectTarget,
  resourceEffectTypes,
  number,
] | [
  "research",
  number
]

/**
 * 细分到每一个effect中的一小条，作用类似于effectShort
 * @property target
 * @property type
 * @property factor
 */
export interface effectShort {
  target: effectTarget,
  type?: resourceEffectTypes,
  factor: number | Decimal
  source: effectSource
  id: number
}

export const Effect = (function () {
  const _effects: effectShort[] = []
  let _copy: effectShort[] = []
  const collection = new LazyCollection()


  function registerEffect(...targets: effectShort[]) {
    for (const target of targets) {
      if (_effects.find(x => x.id == target.id && x.source == target.source)) return
      _effects.push(target)
      collection.invalidate()
    }
  }

  function deleteEffect(source: effectSource, id: number) {
    const effect = findEffect(source, id)
    if (!effect) {
      return
    }
    _effects.splice(
      _effects.findIndex(e => e == effect),
      1
    )
    collection.invalidate()
  }


  function findEffect(source: effectSource, id: number) {
    return _effects.find(v => v.id == id && v.source == source)
  }

  function findShort(target: "research"): effectShort[];
  function findShort(target: effectTarget, type?: resourceEffectTypes) {
    if (type) {
      return _effects.filter((value) => {
        return value.target == target && value.type == type
      })
    } else {
      return _effects.filter((value) => {
        return value.target == target
      })
    }
  }

  function shortsFactorTotal(...shorts: effectShort[]) {
    let v = new Decimal(0)
    shorts.forEach(x => v = v.add(x.factor))
    return v
  }

  /**
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
  function calcEffectMap(...e: effectShort[]): Record<string, Decimal> {
    const v: Record<string, Decimal> = {}
    for (const small of e) {
      if (small.type) {
        const key = `${small.target},${small.type}`
        if (key in v) {
          v[key] = v[key].add(small.factor)
        } else {
          v[key] = new Decimal(small.factor)
        }
      } else {
        if (small.target in v) {
          v[small.target] = v[small.target].add(small.factor)
        } else {
          v[small.target] = new Decimal(small.factor)
        }
      }

    }
    return v
  }

  const researchProgress = collection.lazy(
    () => shortsFactorTotal(
      ...findShort('research')
    ).add(1)
  )

  function parseEffectName(s: effectSource, id: number) {
    switch (s) {
      case "research" :
        return `研究：${Research(id).name}`


      case "employee":
        return `雇员：${Employee(id).name}`

      case "NMP":
        throw new NotImplementedError("Effect not implemented")

      default:
        throw new Error(`WTF effect ${s} ${id}`)
    }
  }

  function effToName(eff: effectShort) {
    return parseEffectName(eff.source, eff.id)
  }

  function hasChanged() {
    const r = _copy == _effects
    _copy = _effects.map(x => x)
    return r
  }

  function parseEffect(e: effectShort[]): { target: string, type?: string, factor: string }[] {
    const v: { target: string, type?: string, factor: string }[] = []
    for (const es of e) {
      const factor = ["maxAdd"].includes(es.type || 'undefined')
        ? Decimal.toResourceAmount(es.factor) : Decimal.toPercent(es.factor)
      v.push({
        target: parseTarget(es.target),
        type: es.type || undefined,
        factor,
      })
    }
    return v
  }

  function parseTarget(s: string) {
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
  }

  function parseType(s: string) {
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
  function parseFactor(eff:effectShort) {
    if (eff.type) {
      if (eff.type == "maxAdd") {
        return Decimal.toResourceAmount(eff.factor)
      } else {
        return Decimal.toPercent(eff.factor)
      }
    } else {
      return Decimal.toPercent(eff.factor)
    }
  }

  return {
    researchProgress,
    findShort,
    registerEffect,
    findEffect,
    deleteEffect,
    calcEffectMap,
    parseEffect,
    parseType,
    parseTarget,
    parseEffectName,
    effToName,
    get effects() {
      return _effects
    },
    hasChanged,
    _effects,
    _copy,
    collection,
    parseFactor
  }
})()

window.dev.effect = Effect