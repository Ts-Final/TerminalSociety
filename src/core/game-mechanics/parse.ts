import {resourceEffectTypes} from "../constants.ts";

export function parseAffectType(type: resourceEffectTypes) {
  switch (type) {
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

export function parseAffectValue(v: number, type: resourceEffectTypes = "pro"): string {
  switch (type) {
    case "pro":
      return Math.floor(v * 100) + "%"
    case "consume":
      return Math.floor(v * 100) + "%"
    case "maxAdd":
      return v + ''
    case "maxMult":
      return Math.floor(v * 100) + "%"
  }
  if (Math.abs(v) <= 0.5) {
    return parseAffectValue(v, 'pro')
  } else {
    return v + ''
  }
}

