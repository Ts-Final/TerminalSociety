import {EventHub} from "../eventHub.ts";
import {Modal} from ".././utils/modal.ts";
import {Ref, ref} from "vue";
import {Optional} from "../constants.ts";

const initialize = {
  dispatch(event: number) {
    EventHub.ui.dispatch(event)
  },
  initialized: false,
  waitInitialize: [] as Function[],
  addWait(func: Function) {
    this.waitInitialize.push(func)
  },
  finishInitialize() {
    this.initialized = true
    this.waitInitialize.forEach(x => x())


  }
}
const view = {
  modal: {
    refs: {
      current: ref() as Ref<Optional<Modal>>,
      showModal: ref(false),
    },
    queue: [] as Modal[],
    _current: undefined as Optional<Modal>,
    get current() {
      return this._current
    },
    set current(value) {
      this._current = value
      this.refs.current.value = value
      this.refs.showModal.value = !(value == undefined)
    },

  },
  handlers: [] as Function[]
}
export const ui = {
  init: initialize,
  view,
  events: EventHub.ui

}