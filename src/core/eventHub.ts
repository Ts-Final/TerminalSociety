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
export const GameEvents = {
  update: 'update',
  /*use this event here to separate ui-related things from logic*/
  updateLogic: "updateLogic",
  changeTab: 'changeTab',
  closeModal: 'closeModal',

  optionChange: 'optionChange',

  marketUpdate: 'marketUpdate',
  marketExchangeUpdate: 'marketExchangeUpdate',
  changeEmployee: 'changeEmployee'
} as const
export type Events = typeof GameEvents[keyof typeof GameEvents]


export const EventHub = {
  _handlers: {} as { [key in Events]: { fn: Function, target: any }[] },
  dispatch(event: Events) {
    const handlers = this._handlers[event]
    if (handlers === undefined) return
    for (const handler of handlers) {
      handler.fn()
    }
  },
  on(e: Events, fn: Function, target: any) {
    const handler = this._handlers[e]
    if (!handler) {
      this._handlers[e] = []
    }
    this._handlers[e].push({fn, target})
  },
  offAll(target: any) {
    for (const handlers in this._handlers) {
      let key = <Events>handlers
      this._handlers[key] = this._handlers[key].filter(x => x.target !== target)
    }
  }
}

window.dev.eventHub = EventHub