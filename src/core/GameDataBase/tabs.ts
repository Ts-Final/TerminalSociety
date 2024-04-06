import {player} from "../player";
import {GameDataClass, GameDataInterface} from "./baseData.ts";
import {ref, Ref} from "vue";
import {EventHub, GameEvent} from "../eventHub.ts";
import {Resources} from "./resource.ts";
import {noEmpty} from "../functions/noEmpty.ts";

interface TabDataInterface extends GameDataInterface {
  col: number
  name: string
  hideable: boolean

  subTabs?: {
    name: string,
    row: number,
    unlock(): boolean,
  }[]

  unlock(): boolean
}

/**
 * 检查一个arr里面是否全为true
 * @param arr
 */
function all(arr: boolean[]) {
  return !arr.includes(false)
}

function repeat(length: number, value: boolean) {
  let v: boolean[] = []
  while (v.length < length) {
    v.push(value)
  }
  return v
}

export class TabClass extends GameDataClass {
  constructor(data: TabDataInterface) {
    super({
      name: data.name,
      id: data.col,
      unlock: data.unlock,
    });
    this.refs = {
      unlocked: ref(false),
      chosen: ref(false),
      hide: ref(data.subTabs ? repeat(data.subTabs.length, false) : [false]),
      unlocks: ref(data.subTabs ? repeat(data.subTabs.length, false) : [false]),
      hidden: ref(false)
    }

    if (data.id != data.col) {
      throw new Error("Tab ID != Tab Col")
    }

    this.col = data.col
    this.hideable = data.hideable
    if (data.subTabs) {
      this.subTabs = data.subTabs
      this.hasSubTab = true
    }

    if (player.tabs[this.col] == undefined) {
      player.tabs[this.col] = {
        unlocks: repeat(data.subTabs ? data.subTabs.length+1 : 1, false),
        hide: repeat(data.subTabs ? data.subTabs.length+1 : 1, false),
        lastOpen: 0,
      }
    }

    EventHub.logic.on(GameEvent.UPDATE, this.updateLogic.bind(this),this)
  }

  static all: TabClass[] = []
  static display = ref(player.display)

  declare refs: {
    unlocked: Ref<boolean>,
    hide: Ref<boolean[]>,
    chosen: Ref<boolean>,
    unlocks: Ref<boolean[]>,
    hidden: Ref<boolean>,
  }
  col: number
  subTabs?: {
    name: string,
    row: number,
    unlock(): boolean,
  }[]
  hideable: boolean
  hasSubTab: boolean = false


  get unlocked() {
    return player.tabs[this.id].unlocks[0]
  }

  set unlocked(value: boolean) {
    player.tabs[this.id].unlocks.fill(value)
  }

  get shown() {
    return !all(player.tabs[this.col].hide)
  }

  set shown(value: boolean) {
    player.tabs[this.id].hide.fill(value)
  }

  get chosen() {
    return player.display[0] == this.col
  }

  get lastOpen() {
    return player.tabs[this.id].lastOpen
  }

  set lastOpen(value: number) {
    player.tabs[this.id].lastOpen = value
  }

  get unlocks() {
    return player.tabs[this.id].unlocks
  }
  set unlocks(value) {
    player.tabs[this.id].unlocks = value
  }
  get hide() {
    return player.tabs[this.id].hide
  }
  get hidden() {
    return !this.hide.includes(false)
  }


  static createAccessor(...data: TabDataInterface[]) {
    this.all = data.map(x => new this(x))
    const accessor = (id: number) => noEmpty(this.all.find(x => x.id == id))
    accessor.all = this.all
    accessor.class = this
    accessor.display = this.display
    return accessor
  }

  showSubTab(row: number) {
    this.hide.fill(false)
    this.lastOpen = row
    player.display = [this.id, row]
    EventHub.ui.dispatch(GameEvent.CHANGE_TAB)
  }

  updateVisual() {
    this.refs.hide.value = this.hide
    this.refs.unlocked.value = this.unlocked
    this.refs.chosen.value = this.chosen
    this.refs.unlocks.value = this.unlocks
    this.refs.hidden.value = this.hidden
  }

  updateLogic() {
    if (this.subTabs) {
      for (const subTab of this.subTabs) {
        this.unlocks[subTab.row + 1] ||= this.subTabs[subTab.row].unlock()
        this.unlocks[0] ||= this.unlock()
      }
    } else {
      this.unlocks = [this.unlock()]
    }
  }

  useBase() {
    this._boundBase(this)
    return this.refs
  }

  show() {
    player.display = [this.col, this.lastOpen]
    EventHub.ui.dispatch(GameEvent.CHANGE_TAB)
  }

  hideSubtab(row: number) {
    this.hide[row] = false
  }
}

const TabData: TabDataInterface[] = [
  {
    name: "资源",
    col: 0,
    id: 0,
    hideable: false,
    unlock(): boolean {
      return true
    },
    subTabs: [
      {
        name: "总览",
        row: 0,
        unlock(): boolean {
          return true
        }
      },
      {
        name: "详细",
        row: 1,
        unlock:() => true
      }
    ]
  },
  {
    name:"生产",
    col: 1,
    id: 1,
    hideable: true,
    unlock(): boolean { return true },
  },
  {
    name: "研究",
    col:2,
    id:2,
    hideable:true,
    unlock:() => true
  },
  {
    name:"市场",
    col:3,
    id:3,
    hideable: true,
    unlock(): boolean {
      return Resources.air.max_record >= 20
    },
    subTabs: [
      {
        name: "交易",
        unlock(): boolean {
          return true
        },
        row: 1
      },
      {
        name: "价格",
        row:0,
        unlock(): boolean {
          return true
        }
      },
      {
        name: "公司",
        row:2,
        unlock(): boolean {
          return true
        }
      },
      {
        name:"许可",
        row:3,
        unlock(): boolean {
          return true
        }
      }
    ]
  },
  {
    name: "员工",
    col:4,
    id:4,
    hideable: true,
    unlock(): boolean {
      return Resources.water.max_record >= 5
    },
    subTabs: [
      {
        name: "雇员",
        row: 0,
        unlock(): boolean {
          return true
        }
      },
    ]
  },
  {
    name: '指引',
    col:5,
    id:5,
    hideable: false,
    unlock() {
      return true
    }
  },
  {
    name: "设置",
    col:6,
    id:6,
    hideable: false,
    unlock(): boolean {
      return true
    },
    subTabs: [
      {
        name:"视觉",
        unlock(): boolean {
          return true
        },
        row: 0,
      }
    ]
  }
]

export const Tab = TabClass.createAccessor(...TabData)

EventHub.ui.on(GameEvent.CHANGE_TAB, function () {
  Tab.class.display.value = player.display
}, Tab)
EventHub.ui.dispatch(GameEvent.CHANGE_TAB)

window.dev.tab = Tab