import {player} from "../player";
import {ResourceTypes} from "../GameDataBase/resource.ts";
import {Effect} from "./effect.ts";


/**
 * 检查一下能不能产出、消耗
 * @param res
 * @param value
 * @param produce
 */
export function canResourceChange(res: ResourceTypes, value: number, produce: boolean) {
  const Res = player.resource[res] // same pointer 同一个指针
  if (produce) {
    return Res.amount + value * (1 + Effect.calcResource(res, 'pro').value) <= Res.maximum
  } else {
    return Res.amount - value * (1 - Effect.calcResource(res, "consume").value) >= 0
  }
}

export function doResourceChange(res: ResourceTypes,
                                 value: number,
                                 produce: boolean,) {
  const Res = player.resource[res] // same pointer 同一个指针
  if (produce) {
    Res.amount += value * (1 + Effect.calcResource(res, 'pro').value)
    Res.change += value * (1 + Effect.calcResource(res, 'pro').value)
  } else {
    Res.amount -= value * (1 - Effect.calcResource(res, 'consume').value)
    Res.change -= value * (1 - Effect.calcResource(res, 'consume').value)
  }
}

export function resetResourceChange() {
  for (const key in player.resource) {
    let v = player.resource[key as keyof typeof player.resource]
    v.change = 0
  }
}