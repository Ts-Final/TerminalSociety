import {EventHub, Events} from "../eventHub.ts";

export class Lazy<T = any> {
  _value: T | undefined
  getValue: () => T

  constructor(getter: () => T) {
    this.getValue = getter
  }
  invalidate() {
    this._value = undefined
  }
  get value(): T {
    if (this._value == undefined) {
      this._value = this.getValue()
    }
    return this._value
  }
  invalidateOn(event:Events) {
    EventHub.on(event, this.invalidate.bind(this), this)
  }

  static bindTo<K>(getter: () => K, collection:LazyCollection) {
    const ins = new Lazy(getter)
    collection.push(ins)
    return ins
  }
}

export class LazyCollection {
  _all: Lazy[]
  get all() {
    return this._all
  }
  constructor() {
    this._all = []
  }
  invalidate() {
    this._all.forEach(x =>  x.invalidate())
  }
  push(ins:Lazy) {
    this.all.push(ins)
  }
  lazy<T>(getter: () => T) {
    const x = new Lazy(getter)
    this.all.push(x)
    return x
  }
}