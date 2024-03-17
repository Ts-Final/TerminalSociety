import {GameEvent} from "./gameEvent.ts";
import {gameLoop, updateDisplay} from "./gameLoop";
import {getAllowProxy} from "../functions/getAllowProxy.ts";
import {generateMarket} from "../player/market.ts";


class eventHub {
  handlers = getAllowProxy<{ [key: number]: Function[] }>({})

  events: number[];

  constructor() {
    this.events = []
  }

  dispatch(event: number) {
    this.events.push(event)
  }

  update() {
    for (const event of this.events) {
      this.handlers[event].forEach((v) => v())
    }
    this.events = []
    updateDisplay()
  }

  updateEvent(event: number) {
    this.handlers[event].forEach((v) => v())
  }

  addHandler(event: number, ...fn: Function[]) {
    this.handlers[event].push(...fn)
    console.log(this.handlers[event].length,event)
  }
}

export const EventHub = new eventHub()
export {GameEvent}

EventHub.addHandler(GameEvent.UPDATE, gameLoop)
EventHub.addHandler(GameEvent.UPDATE_DISPLAY,updateDisplay)
EventHub.addHandler(GameEvent.MARKET_UPDATE,generateMarket)
