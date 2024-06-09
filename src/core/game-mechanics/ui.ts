import {Modal} from ".././utils/modal.ts";
import {Component, Ref, ref} from "vue";
import {callable, Optional} from "../constants.ts";

const initialize = {
  _value: false,
  get value() {
    return this._value
  },
  set value(v: boolean) {
    this._value = v
    this.ref.value = v
  },
  ref: ref(false),
  waitInitialize: [] as callable[],

  // Add the function to the list and wait for initialize,
  // if the game is already initialized will call it immediately.
  wait(func: callable) {
    if (this.value) {
      func()
      return
    }
    this.waitInitialize.push(func)
  },
  finishInitialize() {
    this.value = true
    this.ref.value = true
    this.waitInitialize.forEach(x => x())
  }
}
const tabs = {
  _current: undefined as Optional<Component>,
  refs: {
    current: ref() as Ref<Optional<Component>>,
  },
  get current() {
    return this._current
  },
  set current(value: Optional<Component>) {
    this._current = value
    this.refs.current.value = value
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
  handlers: [] as callable[]
}
const curtain = {
  _value: false,
  ref: ref(false),
  get value() {
    return this._value
  },
  set value(v: boolean) {
    this._value = v
    this.ref.value = v
  },
  show(config?: Partial<CSSStyleDeclaration>) {
    this.setStyle(config ?? {})
    this.value = true
  },
  hide() {
    this.value = false
  },

  style: ref({}),
  setStyle(config: Partial<CSSStyleDeclaration>) {
    this.style.value = config
  },
}
export const ui = {
  init: initialize,
  view,
  tabs,
  curtain
}
window.dev.ui = ui