import {player} from "../player";
import {doResourceChange} from "./resourceChange.ts";
import {status} from "../functions/status.ts";

export function canBuyExchange(index: number, value: number): status {
  value = Number(value)
  if (index > player.market.exchange.length - 1) {
    return -1
  }
  const [, , max, bought, prize]
    = player.market.exchange[index]
  if (bought + value > max) {
    return 0
  }
  return prize * value <= player.money ? 1 : 0
}

export function canSellExchange(index: number, value: number): status {
  value = Number(value)
  if (index > player.market.exchange.length - 1) {
    return -1
  }
  const [, resType]
    = player.market.exchange[index]
  if (resType == undefined) {
    return -1
  }
  return player.resource[resType].amount >= value ? 1 : 0
}


export function doBuyExchange(index: number, value: number, canExchange: boolean) {
  value = Number(value)
  if (!canExchange) {
    return
  }
  const [, resType, , , prize]
    = player.market.exchange[index]
  player.money -= value * prize
  player.market.exchange[index][3] += value

  doResourceChange(resType, value, true)
}

export function doSellExchange(index: number, value: number, canExchange: boolean) {
  value = Number(value)
  if (!canExchange) {
    return
  }
  const [, resType, , , prize]
    = player.market.exchange[index]
  player.money += value * prize

  doResourceChange(resType, value, false)
}
