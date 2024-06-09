import {EventHub} from "../eventHub.ts";
import {player} from "../player";
import {GameStorage} from "./storage/GameStorage.ts";

import {ui} from "./ui.ts";
import {gameLoop} from "./simulateTime.ts";
import {callable} from "../constants.ts";

interface intervalObj {
  start(): void,
  stop(): void,
  restart(): void,
}

export const gameIntervals = (function () {
  const all: intervalObj[] = []
  const interval = (fn: callable, timeout: number | (() => number)) => {
    let id = -1
    const i: intervalObj = {
      start() {
        if (id != -1) {
          throw new Error("A same Interval has already started.")
        } else {
          id = Number(setInterval(fn, typeof timeout == 'function' ? timeout() : timeout))
        }
      },
      stop() {
        clearInterval(id)
        id = -1
      },
      restart() {
        this.stop()
        this.start()
      },

    }
    all.push(i)
    return i
  }
  return {
    all: all,
    start() {
      this.all.forEach((i) => i.start())
    },
    stop() {
      this.all.forEach((i) => i.stop())
    },
    gameLoop: interval(gameLoop, 1000),
    update: interval(() => EventHub.dispatch('update'),
      () => player.options.updateRate),
    save: interval(GameStorage.save.bind(GameStorage), 10e3),
    uiUpdate: interval(() => ui.view.handlers.forEach(x => x()), 33),
  }
})()

window.dev.gameIntervals = gameIntervals