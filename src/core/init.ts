import {GameStorage} from "./game-mechanics/GameStorage.ts";
import {initListener} from "./game-mechanics/eventListener.ts";
import {Base64} from "././utils/base64.ts";
import {gameIntervals} from "./game-mechanics/gameIntervals.ts";
import {EventHub} from "./eventHub.ts";
import {Tab} from "./GameDataBase/tabs.ts";
import {player} from "./player.ts";
import {Money} from "./GameDataBase/market/money.ts";
import {ExchangeHandler} from "./GameDataBase/market/exchange.ts";
import {How2PlayClass} from "./GameDataBase/how2play.ts";


export function isLocal() {
  const href = window.location.href
  return href.includes("127.0.0.1") || href.includes("localhost")
}

export function init() {
  GameStorage.load(isLocal())
  gameIntervals.start()
  initListener()
  // initEffects()
  Tab.class.show(player.display[0], player.display[1])
  Money.fromPlayer()
  ExchangeHandler.fromPlayer()
  How2PlayClass.updateRef()

  EventHub.dispatch("update")
}


window.dev.base64 = Base64