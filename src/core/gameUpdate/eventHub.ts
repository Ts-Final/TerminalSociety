/*
import {GameEvent} from "./gameEvent.ts";
import {gameLoop} from "./gameLoop";

const display = {}

class eventHub {
  _handlers: { [key: number]: { fn: Function, target: any }[] }

  events: number[];

  constructor() {
    this.events = []
    this._handlers = {}
  }

  dispatch(event: number,args?:any) {
    const handlers = this._handlers[event]
    if (handlers === undefined) return
    for (const handler of handlers) {
      handler.fn(args)
    }
  }

  update() {
    for (const event of this.events) {
      this._handlers[event].forEach((v) => v.fn())
    }
    this.events = []
    gameLoop.updateDisplay()
  }

  on(event: number, fn: Function, target?: any) {
    let handlers = this._handlers[event]
    if (handlers === undefined) {
      handlers = []
      this._handlers[event] = handlers
    }
    this._handlers[event].push({fn, target})
  }

  static get Display () {
    return display
  }
}

export const EventHub = new eventHub()
export {GameEvent}

*/
export const enum GameEvent {
  /* UI update only, we use gameLoop() another-where */
  UPDATE,

  // Options
  OPTION_CHANGE,

  // Market
  MARKET_UPDATE,
  MARKET_EXCHANGE_UPDATE,

  // Employ
  CHANGE_EMPLOYEE
}

export function getStack(msg?: string) {
  let callstack = (new Error()).stack
  if (!callstack) throw new Error("Unable to get stack")
  let stacks = callstack.split("\n")
  let r = msg || ""
  for (const stack of stacks) {
    r += `\n at ${stack}`
  }
  return r
}

function emptyCheck(value: any) {
  if (!value) {
    console.warn("value is empty!")
  }
}

export class EventHub {
  static ui: EventHub
  static logic: EventHub;

  static dispatch(event:number) {
    EventHub.ui.dispatch(event)
    EventHub.logic.dispatch(event)
  }
  _handlers: { [key: number]: { fn: Function, target: any }[] }
  events: number[];

  constructor() {
    this.events = []
    this._handlers = {}
  }

  dispatch(event: number, args?: any) {
    const handlers = this._handlers[event]
    if (handlers === undefined) return
    for (const handler of handlers) {
      handler.fn(args)
    }
  }

  flushEvents() {
    for (const event of this.events) {
      this._handlers[event].forEach((v) => v.fn())
    }
    this.events = []
  }

  on(event: number, fn: Function, target?: any) {
    let handlers = this._handlers[event]
    if (handlers === undefined) {
      handlers = []
      this._handlers[event] = handlers
    }

    emptyCheck(target)
    this._handlers[event].push({fn, target})
  }

  offAll(target: any) {
    for (const event in this._handlers) {
      this._handlers[event] = this._handlers[event].filter(
        (x) => x.target !== target
      )
    }
  }

}

EventHub.logic = new EventHub()
EventHub.ui = new EventHub()
