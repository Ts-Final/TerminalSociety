import {GameStorage} from "../game-mechanics/GameStorage.ts";
import {notify} from "./notify.ts";
import {EventHub, GameEvent} from "../gameUpdate/eventHub.ts";
import {player} from "../player";
import {isLocal} from "../init.ts";
import {Numbers} from "./Numbers.ts";
import {changeTab} from "../game-mechanics/display.ts";

export function initListener() {
  document.addEventListener('keydown', function (e) {
      console.log(e.code)
      if (e.code === "KeyS" && e.ctrlKey) {
        GameStorage.save()
        e.preventDefault()
      } else if (e.code === "KeyM" && e.altKey) {
        EventHub.dispatch(GameEvent.MARKET_UPDATE)
        e.preventDefault()
      } else if (e.code === "Delete") {
        GameStorage.clearSave()
        notify.error("Save deleted", 1000)
      } else if (e.code === "KeyN" && e.altKey) {
        EventHub.dispatch(GameEvent.UPDATE)
      } else if (e.code === "ArrowUp") {
        changeTab(Numbers.cycle(1, 14, player.display - 1))
      } else if (e.code === "ArrowDown") {
        changeTab(Numbers.cycle(1, 14, player.display + 1))
      } else if (e.code === "KeyC" && e.ctrlKey) {
        GameStorage.copySave()
      }
    }
  )
}

if (false) {
  window.onerror = function (event,
                             source,
                             lineno,
                             colno,
                             error) {
    GameStorage.clearSave()
    console.log(event, source, lineno, colno, error)
  }
}