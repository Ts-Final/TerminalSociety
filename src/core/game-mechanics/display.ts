import {player} from "../player";
import {EventHub, GameEvent} from "../eventHub.ts";

export function changeTab(tab:number) {
  player.display = tab
  EventHub.dispatch(GameEvent.UPDATE_DISPLAY)
  setTimeout(()=>EventHub.dispatch(GameEvent.UPDATE_DISPLAY),50)
}