import {resourceEffectTypes, ResourceTypes} from "../GameDataBase/resource.ts";
import {ValueNotFoundError} from "../functions/errors.ts";
import {countryEnum} from "../GameDataBase/situation/country.ts";

export function parseResourceName(key: ResourceTypes) {
  switch (key) {
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
    default:
      throw new ValueNotFoundError(`什么resource名字：${key}`)
  }
}

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

/**
 * 务必使用v-html
 * @param type 国家名字
 */
export function parseCountryName(type: number) {
  switch (type) {
    case countryEnum.xi:
      return "锡"
    case countryEnum.agleta:
      return "阿各塔"
    case countryEnum.fatery:
      return "法谭"
    case countryEnum.teLin:
      return "特林"
    case countryEnum.tsFinal:
      return `<span class="rainbow-text">Ts.Final</span>`
  }
}