import {player} from "../player";
import {notify} from ".././utils/notify.ts";
import {deepSet} from ".././utils/deepSet.ts";
import {Base64} from ".././utils/base64.ts";
import {Numbers} from ".././utils/Numbers.ts";
import {EventHub, GameEvent} from "../eventHub.ts";
import {Market} from "../GameDataBase/market";
import {version} from "../GameDataBase/how2play/how2play.ts";

const Key = 'TerminalSociety'

function reverse(x: string) {
  let v = ""
  for (let char of x) {
    v = char + v
  }
  return v
}

function repeat(x: Function, times: number) {
  for (let i = 0; i < times; i++) {
    x()
  }
}

function nextDay() {
  let days = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  days += 1
  return days * 24 * 60 * 60 * 1000;
}

export const GameStorage = {
  save(n: boolean = true) {
    if (n) {
      notify.normal("游戏已保存", 500)
    }
    player.saveTime = Date.now()
    player.dailyFreshTime = nextDay()
    player.version = version
    let v = this.deserialize(JSON.stringify(player))
    localStorage.setItem(Key, v)
    return v
  },
  clearSave() {
    localStorage.removeItem(Key)
  },
  load(isLocal = false) {
    let str = localStorage.getItem('TerminalSociety')
    if (str != null) {
      let obj
      try {
        obj = JSON.parse(str) // 向上兼容没有serial的版本
      } catch (e) {
        obj = JSON.parse(this.serialize(str))
      } finally {
        deepSet(obj, player)
      }

      /* Update */
      let seconds = (Date.now() - player.saveTime) / (24 * 60 * 60 * 1000)
      seconds = Numbers.round(seconds, 0) // update Times
      if (seconds <= 200) {
        repeat(() => EventHub.logic.dispatch(GameEvent.UPDATE), seconds)
      }
    }
    if (Date.now() >= player.dailyFreshTime) {
      Market.generate()
    }
    player.dev = isLocal

  },
  copySave() {
    navigator.clipboard.writeText(this.save(false))
      .then(() => notify.success("存档已复制到剪贴板", 1000))
      .catch(() => notify.error("复制存档时出现问题。", 1000))
  },
  deserialize(x: string) {
    let str = x
    for (const step of this.steps) {
      str = step.encode(str)
    }
    return str
  },
  serialize(x: string) {
    let str = x
    for (const step of this.steps.reverse()) {
      str = step.decode(str)
    }
    this.steps.reverse() // 转回来，为什么没有toReversed
    return str
  },
  steps: [
    {
      encode(x: string): string {
        return x.replace('"', '~')
      },
      decode(x: string): string {
        return x.replace('~', '"')
      }
    },
    {
      encode(x) {
        return Base64.encode(x)
      },
      decode(x) {
        return Base64.decode(x)
      }
    },
    {
      encode(x: string) {
        return reverse(x)
      },
      decode(x: string): string {
        return reverse(x)
      }
    },
    {
      encode(x: string): string {
        return x.replace('/', '-')
      },
      decode(x: string): string {
        return x.replace('-', '/')
      }
    }
  ] as { encode(x: string): string, decode(x: string): string }[]

}

window.dev.save = GameStorage