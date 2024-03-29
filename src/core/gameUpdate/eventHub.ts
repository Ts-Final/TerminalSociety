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

