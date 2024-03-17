import {clearSave, save} from "../game-mechanics/save.ts";
import {notify} from "./notify.ts";
import {EventHub, GameEvent} from "../gameUpdate/eventHub.ts";
import {player} from "../player";
import {isLocal} from "../init.ts";
import {Numbers} from "./Numbers.ts";
import {changeTab} from "../game-mechanics/display.ts";

export function initListener() {
  document.addEventListener('keydown', function (e) {
      // console.log(e.code)
      if (e.code === "KeyS" && e.ctrlKey) {
        save()
        e.preventDefault()
      } else if (e.code === "KeyM" && e.altKey) {
        EventHub.dispatch(GameEvent.MARKET_UPDATE)
        e.preventDefault()
      } else if (e.code === "Delete") {
        clearSave()
        notify.error("Save deleted", 1000)
      } else if (e.code === "KeyN" && e.altKey) {
        EventHub.dispatch(GameEvent.UPDATE_NEWS)
      } else if (e.code === "ArrowUp") {
        changeTab(Numbers.cycle(1, 14, player.display - 1))
      } else if (e.code === "ArrowDown") {
        changeTab(Numbers.cycle(1, 14, player.display + 1))
      }
    }
  )
}

if (isLocal()) {
  window.onerror = function (event,
                             source,
                             lineno,
                             colno,
                             error) {
    clearSave()
    console.log(event, source, lineno, colno, error)
  }
}