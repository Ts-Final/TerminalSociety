import {player} from "../player";
import {gameIntervals} from "./gameIntervals.ts";
import {EventHub, GameEvent} from "../gameUpdate/eventHub.ts";

export const Options = {
  get updateRate() {
    return player.options.updateRate
  },
  set updateRate(value: number) {
    player.options.updateRate = value
    gameIntervals.update.restart()
  },
  get newsEnabled() {
    return player.options.news
  },
  set newsEnabled(value: boolean) {
    player.options.news = value
    EventHub.dispatch(GameEvent.OPTION_CHANGE)
  },
  get laugh() {
    return player.options.laugh
  },
  set laugh(value: boolean) {
    player.options.laugh = value
  }
}