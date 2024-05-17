import {GameStorage} from "./GameStorage.ts";
import {notify} from ".././utils/notify.ts";
import {EventHub} from "../eventHub.ts";
import {Market} from "../GameDataBase/market";
import {Modal} from "../utils/modal.ts";
import {isLocal} from "../init.ts";

export function initListener() {
  document.addEventListener('keydown', function (e) {
    // console.log(e.code)
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
        EventHub.dispatch('update')
      } else if (e.code === "KeyC" && e.ctrlKey) {
        GameStorage.copySave()
      } else if (e.code === "KeyV" && e.altKey) {
        Modal.VersionModal.show({})
      } else if (e.code === "Escape") {
        EventHub.dispatch("closeModal")
      }
    }
  )
}

if (isLocal()) {
  window.onerror = function () {
    GameStorage.clearSave()
  }
}