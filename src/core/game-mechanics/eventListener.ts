import {GameStorage} from "./GameStorage.ts";
import {notify} from ".././utils/notify.ts";
import {EventHub, GameEvent} from "../eventHub.ts";
import {player} from "../player.ts";
import {Market} from "../GameDataBase/market";
import {Modal} from "../utils/modal.ts";

export function initListener() {
  document.addEventListener('keydown', function (e) {
      console.log(e.code)
      if (e.code === "KeyS" && e.ctrlKey) {
        GameStorage.save()
        e.preventDefault()
      } else if (e.code === "KeyM" && e.altKey) {
        Market.generate()
        e.preventDefault()
      } else if (e.code === "Delete") {
        GameStorage.clearSave()
        notify.error("Save deleted", 1000)
      } else if (e.code === "KeyN" && e.altKey) {
        EventHub.dispatch(GameEvent.UPDATE)
      } else if (e.code === "KeyC" && e.ctrlKey) {
        GameStorage.copySave()
      } else if (e.code === "KeyV" && e.altKey) {
        Modal.VersionModal.show()
      }
    }
  )
}

if (player.dev) {
  window.onerror = function (event,
                             source,
                             lineno,
                             colno,
                             error) {
    GameStorage.clearSave()
    console.log(event, source, lineno, colno, error)
  }
}