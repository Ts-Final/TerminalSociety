import {GameStorage} from "./game-mechanics/GameStorage.ts";
import {initListener} from "./game-mechanics/eventListener.ts";
import {Base64} from "././utils/base64.ts";
import {gameIntervals} from "./game-mechanics/gameIntervals.ts";


export function isLocal() {
  const href = window.location.href
  return href.includes("127.0.0.1") || href.includes("localhost")
}

export function init() {
  GameStorage.load(isLocal())
  gameIntervals.start()
  initListener()
  // initEffects()
}


window.dev.base64 = Base64