import {player} from "../player";
import {gameIntervals} from "./gameIntervals.ts";
import {EventHub, GameEvent} from "../eventHub.ts";
import {ref} from "vue";
import {ui} from "./ui.ts";

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
  get autoStory() {
    return player.options.autoStory
  },
  set autoStory(value: boolean) {
    player.options.autoStory = value
    this.refs.autoStory.value = value
  },

  refs: {
    laugh: ref(player.options.laugh),
    news: ref(player.options.news),
    updateRate: ref(player.options.updateRate),
    autoStory: ref(player.options.autoStory),
  },
  updateRef() {
    this.refs.laugh.value = player.options.laugh
    this.refs.news.value = player.options.news
    this.refs.updateRate.value = player.options.updateRate
    this.refs.autoStory.value = player.options.autoStory
  },
}

export const Options = {
  visual,
}

ui.init.addWait(visual.updateRef.bind(visual))

