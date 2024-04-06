import {EventHub} from "../eventHub.ts";

export const GameUI = {
  dispatch(event:number) {
    EventHub.ui.dispatch(event)
  },
  initialized: false,
  waitInitialize: [] as Function[],
  addWait(func:Function) {
    this.waitInitialize.push(func)
  },
  finishInitialize() {
    this.initialized = true
    this.waitInitialize.forEach(x => x())
  }

}