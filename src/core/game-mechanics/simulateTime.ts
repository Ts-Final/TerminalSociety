import {Task} from "../GameDataBase/task.ts";
import {Research} from "../GameDataBase/research.ts";
import {Tab} from "../GameDataBase/tabs.ts";
import {Employee} from "../GameDataBase/employee/work.ts";
import {Company} from "../GameDataBase/market/company.ts";
import {Resource} from "../GameDataBase/resource.ts";
import {StoryMain} from "../GameDataBase/story/storyMain.ts";
import {player} from "../player.ts";
import {Numbers} from "../utils/Numbers.ts";
import {ref} from "vue";
import {Modal, props} from "../utils/modal.ts";
import {Async} from "../utils/async-utils.ts";
import {EventHub, GameEvent} from "../eventHub.ts";
import {gameIntervals} from "./gameIntervals.ts";
import {Optional} from "../constants";
import {deepClone} from "../utils/deepClone.ts";
import {Decimal} from "../utils/break_infinity.ts";
import {different} from "../utils/different.ts";

/**
 * @param diff passed milliseconds
 * @param fast should it be called immediately
 * */
export function simulateTime(diff: number, fast: boolean = false) {
  const seconds = Math.round(diff / 1000)
  if (seconds <= 20 || fast) {
    for (let i = 0; i < seconds; ++i) {
      gameLoop()
    }
    return
  }
  let ticks = 5e3
  let speed = 1
  if (seconds > ticks) {
    speed = Numbers.round(seconds / ticks)
  } else {
    ticks = Math.min(ticks, seconds)
  }
  const dict = {
    _tick: 0,
    max_ticks: ticks,
    tickR: ref(0),
    finished: ref(false),
    get tick() {
      return this._tick
    },
    set tick(tick: number) {
      this._tick = tick
      this.tickR.value = tick
    },
    time: diff
  }

  OfflineProgress.start()
  Async.run(
    () => {
      gameUpdate(speed * 1000)
      dict.tickR.value += 1
    },
    ticks,
    {
      maxTime: 10,
      sleepTime: 1,
      asyncExit() {
        gameIntervals.gameLoop.start()
        EventHub.ui.dispatch(GameEvent.CLOSE_MODAL)

      },
      asyncEntry() {
        Modal.OfflineModal.show(dict)
        gameIntervals.gameLoop.stop()
      },
      then() {
        OfflineProgress.end()
      },

    }
  )

}

export function gameLoop() {
  const now = Date.now()
  const diff = now - player.lastUpdate
  /*
  * For a time longer than 1 minute, we assume that player's device is not currently
  * focusing on this page, so we simulate that as offline time.
  * */
  if (diff > 60 * 1e3) {
    simulateTime(diff)
  }
  gameUpdate(diff)
  player.lastUpdate = Date.now()
}

function gameUpdate(passDiff: number) {
  const speed = passDiff / 1000
  Resource.all.forEach(x => x.updateLogic())
  Task.all.forEach(x => x.updateLogic(speed))
  Research.all.forEach(x => x.updateLogic(speed))
  Tab.all.forEach(x => x.updateLogic())
  Employee.all.forEach(x => x.updateLogic())
  Company.all.forEach(x => x.updateLogic())
  StoryMain.all.forEach(x => x.updateLogic())
}

window.dev.offline = {
  gameLoop,
  simulateTime,
  gameUpdate
}


export const OfflineProgress = {
  _initial: undefined as Optional<typeof player>,
  get initial() {
    return this._initial
  },
  set initial(value) {
    this._initial = value
  },
  start() {
    if (this.initial) throw new Error('Trying to restart? lol.')
    this.initial = deepClone(player)
    Decimal.transfer(this.initial)
  },
  end() {
    if (!this.initial) throw new Error("hadn't start, why are you gonna shitting end?")
    const initial = this.initial

    const x = {} as props.offlineChange
    for (const res of Resource.all) {
      if (res.amount.compare(initial.resource[res.name].amount) !== 0) {
        if (!x.resource) x.resource = []
        x.resource.push([res.parsed, res.amount.sub(initial.resource[res.name].amount)])
      }
    }
    for (const rch of Research.all) {
      if (rch.level !== initial.research[rch.id][3]) {
        if (!x.research) x.research = []
        if (rch.maxed) {
          x.research.push([rch.name, true])
        } else {
          x.research.push([rch.name, rch.level - initial.research[rch.id][3]])
        }
      }
    }
    if (different(x, {})) {
      Modal.OfflineProgressModal.show(x)
    }
    this.initial = undefined
  }
}