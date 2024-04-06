import {player} from "../player";
import {gameIntervals} from "./gameIntervals.ts";
import {EventHub, GameEvent} from "../eventHub.ts";
import {ref} from "vue";

const visual = {
  get updateRate() {
    return player.options.updateRate
  },
  set updateRate(value: number) {
    player.options.updateRate = value
    gameIntervals.update.restart()
    this.refs.updateRate.value = value
  },
  get newsEnabled() {
    return player.options.news
  },
  set newsEnabled(value: boolean) {
    player.options.news = value
    this.refs.news.value = value
    EventHub.dispatch(GameEvent.OPTION_CHANGE)
  },
  get laugh() {
    return player.options.laugh
  },
  set laugh(value: boolean) {
    player.options.laugh = value
    EventHub.dispatch(GameEvent.OPTION_CHANGE)
    this.refs.laugh.value = value
  },

  refs: {
    laugh: ref(player.options.laugh),
    news: ref(player.options.news),
    updateRate: ref(player.options.updateRate),
  }
}

export const Options = {
  visual,
}

