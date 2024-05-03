import {NotImplementedError} from ".././utils/errors.ts";
import {Numbers} from ".././utils/Numbers.ts";
import {effectSource, effectTarget, resourceEffectTypes} from "../constants.ts";
import {Employee} from "../GameDataBase/employee/work.ts";
import {Research} from "../GameDataBase/research.ts";
import {Lazy, LazyCollection} from "../utils/lazy.ts";

/**
 * 用于GDB中一些简单的affect效果
 * 与effectSmall不同，反正
 */
export type effectData = [
  effectTarget,
  resourceEffectTypes,
  number
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
  factor: number
}

export interface effect {
  source: effectSource
  id: number
  /**
   * 这样一个effect可以对应一堆effects
   */
  effects: effectShort[]
}

/*
export const Effect = {
  _effects: [] as effect[],
  lastCheck: [] as effect[],

  registerEffect(target: effect) {
    if (this._effects.find((e) => e.id == target.id && e.source == target.source)) {
      return
    }
    this._effects.push(target)
  },
  get effects() {
    return this._effects
  },
  /!**
   * 记得check返回是不是undefined
   *!/
  findEffect(source: effectSource, id: number) {
    return this._effects.find((v) => v.id == id && v.source == source)
  },

  clearSpecEffect(source: effectSource, id: number) {
    const effect = this.findEffect(source, id)
    if (!effect) {
      return
    }
    this._effects.splice(
      this._effects.findIndex((e) => e == effect),
      1
    )
  },
  /!**
   * 返回带[来源，id，effectSmall]的东西
   * @param e
   *!/
  toEffects(...e: effect[]) {
    let v: [effectSource, id, effectShort][] = []
    for (const eff of e) {
      for (const small of eff.effects) {
        v.push([eff.source, eff.id, small])
      }
    }
    return v
  },
  toSmall(...e: effect[]): effectShort[] {
    let v: effectShort[] = []
    for (const eff of e) {
      v.push(...eff.effects)
    }
    return v
  },
  /!**
   * with this function called before any (or some) updates, this will
   * remove lots of useless updates.
   *!/
  hasChanged() {
    const r = this._effects == this.lastCheck
    this.lastCheck = this._effects
    return r
  },

  /!* calculate related *!/
  calcResearchProgress() {
    let arr =
      this.effects.filter((e) => e[2].target === "research")
    let v = 1
    for (const e of arr) {
      v += e.factor
    }
    return v
  },
  /!**
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
   *!/
  calcFromEffects(...e: effect[]): { [x: string]: number } {
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

  /!* Parse Related *!/
  parseAffectName(s: string, id: number) {
    switch (s) {
      case "research" :
        return `研究：${Research(id).name}`

      case "NMP":
        throw new NotImplementedError("Effect not implemented")

      case "employee":
        return `雇员：${Employee(id).name}`
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
}*/

export const Effect = (function () {
  const _effects: effect[] = []
  let _copy: effect[] = []
  const collection = new LazyCollection()


  function registerEffect(target: effect) {
    if (_effects.find(x => x.id == target.id && x.source == target.source)) return
    _effects.push(target)
    collection.invalidate()
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

  function findShort(target: effectTarget, type?: resourceEffectTypes) {
    let shorts = [] as effectShort[]
    if (type) {
      for (const e of _effects) {
        shorts.push(...
          e.effects.filter(
            function (e) {
              if (e.type) return e.type == type && e.target == target
              else return e.target == target
            }
          )
        )
      }
    } else {
      for (const e of _effects) {
        shorts.push(...
          e.effects.filter(
            e => e.target == target
          )
        )
      }
    }
    return shorts
  }

  function shortsFactorTotal(...shorts: effectShort[]) {
    let v = 0
    shorts.forEach(x => v += x.factor)
    return v
  }

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
  function calcEffectMap(...e: effect[]): { [x: string]: number } {
    let v: { [key: string]: number } = {}
    for (const small of e) {
      for (const short of small.effects) {
        if (short.type) {
          const key = `${short.target},${short.type}`
          if (key in v) {
            v[key] += short.factor
          } else {
            v[key] = short.factor
          }
        } else {
          if (short.target in v) {
            v[short.target] += short.factor
          } else {
            v[short.target] = short.factor
          }
        }
      }
    }
    return v
  }

  const researchProgress = Lazy.bindTo(
    () => 1 + shortsFactorTotal(
      ...findShort('research')
    ), collection
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
  function effToName(eff:effect) {
    return parseEffectName(eff.source, eff.id)
  }

  function hasChanged() {
    const r = _copy == _effects
    _copy = _effects.map(x => x)
    return r
  }

  function parseEffect(e: effect): { target: string, type?: string, factor: string }[] {
    let v: { target: string, type?: string, factor: string }[] = []
    for (const es of e.effects) {
      let factor = ["maxAdd"].includes(es.type || 'undefined')
        ? Numbers.formatInt(es.factor, false, 0)
        : Numbers.formatInt(es.factor, true, 3)
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
  }
})()

window.dev.effect = Effect