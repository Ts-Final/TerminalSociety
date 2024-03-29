import {effect} from "./effect.ts";
export const GameStats = {
  h2pUnlocks: {} as {[x:number]:boolean},
  effects: [] as effect[],
  onModal: false
}

window.dev.gameStats = GameStats