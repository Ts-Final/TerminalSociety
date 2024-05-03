import {player} from "../player";
import {notify} from ".././utils/notify.ts";
import {deepSet} from ".././utils/deepSet.ts";
import {Base64} from ".././utils/base64.ts";
import {Market} from "../GameDataBase/market";
import {ui} from "./ui.ts";
import {NewGame} from "./newGame.ts";
import {Decimal} from "../utils/break_infinity.ts";
import {LatestVersion} from "../GameDataBase/versions.ts";
import {Modal} from "../utils/modal.ts";

const Key = 'TerminalSociety'

function reverse(x: string) {
  let v = ""
  for (let char of x) {
    v = char + v
  }
  return v
}

function nextDay() {
  let days = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  days += 1
  return days * 24 * 60 * 60 * 1000;
}

export const GameStorage = {
  save(doNotify = true) {
    if (doNotify) {
      notify.normal("游戏已保存", 500)
    }
    player.saveTime = Date.now()
    if (player.saveTime > player.dailyFreshTime) {
      player.dailyFreshTime = nextDay()
      Market.generate()
    }
    player.version = LatestVersion
    let v = this.deserialize(JSON.stringify(player))
    localStorage.setItem(Key, v)
    return v
  },
  clearSave() {
    localStorage.removeItem(Key)
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
  ] as { encode(x: string): string, decode(x: string): string }[],

  load(isLocal = false) {
    let str = localStorage.getItem('TerminalSociety')
    if (str != null) {
      /*try {
        obj = JSON.parse(str) // 向上兼容没有serial的版本
      } catch (e) {
        obj = JSON.parse(this.serialize(str))
        兼容（）（），不兼容了。到这个时候估计没什么用了（笑
      } */
      deepSet(JSON.parse(this.serialize(str)), player)
      if (player.customName == "") ui.init.wait(NewGame)

    } else {
      ui.init.wait(NewGame)
    }
    Decimal.transfer(player)
    player.dev = isLocal
    if (player.version !== LatestVersion) {
      ui.init.wait(() => Modal.VersionModal.show({}))
    }
  },

}

window.dev.save = GameStorage