import {EventHub} from "../eventHub.ts";

export class Lazy<T> {
  _value: T | undefined
  getValue: () => T

  constructor(getter: () => T) {
    this.getValue = getter
  }
  invalidate() {
    this._value = undefined
  }
  get value() {
    if (this._value == undefined) {
      this._value = this.getValue()
    }
    return this._value
  }
  invalidateOn(event:number) {
    EventHub.logic.on(event, this.invalidate.bind(this), this)
  }
}