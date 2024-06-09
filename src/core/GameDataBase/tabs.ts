import {player} from "../player";
import {GameDataClass, GameDataInterface} from "./baseData.ts";
import {Component, ref, Ref, toValue} from "vue";
import {EventHub} from "../eventHub.ts";
import {Resource} from "./resource.ts";
import {noEmpty} from ".././utils/noEmpty.ts";
import ResourceGeneralTab from "../../components/tabs/resource/ResourceGeneralTab.vue";
import ResourceDetailTab from "../../components/tabs/resource/ResourceDetailTab.vue";
import TaskTab from "../../components/tabs/task/TaskTab.vue";
import ResearchTab from "../../components/tabs/research/researchTab.vue";
import ExchangeTab from "../../components/tabs/market/exchange/exchangeTab.vue";
import BasePriceTab from "../../components/tabs/market/basePrice/basePriceTab.vue";
import CompanyTab from "../../components/tabs/market/company/companyTab.vue";
import UpgradeTab from "../../components/tabs/market/upgrade/upgradeTab.vue";
import EmployeeTab from "../../components/tabs/employ/employee/employeeTab.vue";
import OptionVisual from "../../components/tabs/options/OptionVisual.vue";
import {ui} from "../game-mechanics/ui.ts";
import H2PTab from "../../components/tabs/H2PTab.vue";
import {Numbers} from "../utils/Numbers.ts";
import StoryMainTab from "../../components/tabs/story/storyMainTab.vue";
import {Effect} from "../game-mechanics/effect.ts";

interface TabDataInterface extends GameDataInterface {
  name: string
  hideable: boolean
  component?: Component

  subTabs?: {
    name: string,
    row: number,
    condition(): boolean,
    component: Component
  }[]

  condition(): boolean
}

/* value can be a function here, as we dont have a deepClone in the function*/
function repeat<T>(length: number, value: T | (() => T)): T[] {
  const v: T[] = []
  while (v.length < length) {
    v.push(toValue(value))
  }
  return v
}

export class TabClass extends GameDataClass implements TabDataInterface {
  static all: TabClass[] = []
  static display = ref(player.display)
  refs: {
    unlocked: Ref<boolean>,
    chosen: Ref<boolean>,
    show: Ref<boolean>,
    sub: [Ref<boolean>, Ref<boolean>][]
  }
  subTabs?: { name: string; row: number; condition(): boolean; component: Component; }[]
  component?: Component
  hideable: boolean
  hasSubTab = false

  constructor(data: TabDataInterface) {
    super({
      name: data.name,
      id: data.id,
      condition: data.condition,
    });
    this.hideable = data.hideable
    if (data.subTabs) {
      this.subTabs = data.subTabs
      this.hasSubTab = true
    }
    if (data.component) {
      this.component = data.component
    }

    if (player.tabs[this.id] == undefined) {
      player.tabs[this.id] = {
        unlocked: false,
        lastOpen: 0,
        show: true,
        sub: repeat(this.subTabs ? this.subTabs.length : 0, [false, false])
      }
    }
    this.refs = {
      unlocked: ref(false),
      chosen: ref(false),
      show: ref(true),
      sub: repeat(this.subTabs ? this.subTabs.length : 0,
        () => [ref(false), ref(true)])
    }

    this.onLogic()

    const x = this
    EventHub.on('changeTab', () => x.refs.chosen.value = x.chosen, this)
  }

  get unlocked() {
    return player.tabs[this.id].unlocked
  }

  set unlocked(value: boolean) {
    this.refs.unlocked.value = value
  }

  get shown() {
    return player.tabs[this.id].show
  }

  get chosen() {
    return player.display[0] == this.id
  }

  get lastOpen() {
    return player.tabs[this.id].lastOpen
  }

  set lastOpen(value: number) {
    player.tabs[this.id].lastOpen = value
  }

  get sub() {
    return player.tabs[this.id].sub
  }

  static createAccessor(...data: TabDataInterface[]): {
    (id: number): TabClass,
    class: typeof TabClass,
    all: TabClass[],
  } {
    this.all = data.map(x => new this(x))
    const accessor = (id: number) => noEmpty(this.all.find(x => x.id == id))
    accessor.all = this.all
    accessor.class = this
    accessor.display = this.display
    return accessor
  }

  static show(col: number, row?: number) {
    const tab = this.all.find(x => x.id == col)
    if (!tab) throw new Error(`WTF tab column index ${col}`)
    tab.show(row)
  }

  static updateDisplay() {
    this.display.value = player.display
  }

  updateRef() {
    this.refs.unlocked.value = this.unlocked
    this.refs.chosen.value = this.chosen
    this.updateSub()
  }
  updateSub() {
    this.refs.sub.map((value, index) => {
      value[0].value = this.sub[index][0]
      value[1].value = this.sub[index][1]
    })

  }

  updateLogic() {
    if (!this.unlocked) {
      super.tryUnlock()
      return
    }
    if (this.subTabs) {
      for (const subTab of this.subTabs) {
        const [unlocked, shown] = this.sub[subTab.row]
        this.sub[subTab.row] = [unlocked || subTab.condition(), shown]

      }
    }
    this.updateSub()
  }

  show(row?: number) {
    if (row != undefined) {
      player.display = [this.id, row]
      if (this.subTabs) {
        ui.tabs.current =
          this.subTabs.find(
            x => x.row == row)?.component
      } else {
        ui.tabs.current = this.component
      }
    } else {
      player.display = [this.id, this.lastOpen]
      this.refs.chosen.value = this.chosen
      if (this.component) ui.tabs.current = this.component
      else if (this.subTabs) {
        ui.tabs.current = this.subTabs[this.lastOpen].component
      }
    }
    EventHub.dispatch('changeTab')
  }
}

const counter = Numbers.counter(0, 1)
const TabData: TabDataInterface[] = [
  {
    name: "资源",
    id: counter.next(),
    hideable: false,
    condition(): boolean {
      return true
    },
    subTabs: [
      {
        name: "总览",
        row: 0,
        condition(): boolean {
          return true
        },
        component: ResourceGeneralTab
      },
      {
        name: "详细",
        row: 1,
        condition: () => Effect.effects.length > 0,
        component: ResourceDetailTab
      }
    ]
  },
  {
    name: "生产",
    id: counter.next(),
    hideable: true,
    condition(): boolean {
      return true
    },
    component: TaskTab
  },
  {
    name: "研究",
    id: counter.next(),
    hideable: true,
    condition: () => true,
    component: ResearchTab
  },
  {
    name: "市场",
    id: counter.next(),
    hideable: true,
    condition(): boolean {
      return Resource.air.max_record.gt(20)
    },
    subTabs: [
      {
        name: "价格",
        row: 0,
        condition(): boolean {
          return true
        },
        component: BasePriceTab
      },
      {
        name: "交易",
        condition(): boolean {
          return true
        },
        row: 1,
        component: ExchangeTab
      },
      {
        name: "公司",
        row: 2,
        condition(): boolean {
          return true
        },
        component: CompanyTab
      },
      {
        name: "许可",
        row: 3,
        condition(): boolean {
          return true
        },
        component: UpgradeTab
      },
    ]
  },
  {
    name: "员工",
    id: counter.next(),
    hideable: true,
    condition(): boolean {
      return Resource.water.max_record.gt(5)
    },
    subTabs: [
      {
        name: "雇员",
        row: 0,
        condition(): boolean {
          return true
        },
        component: EmployeeTab
      },
    ]
  },
  {
    name: "故事",
    id: counter.next(),
    hideable: true,
    condition(): boolean {
      return Resource.energy.max_record.gt(10)
    },
    subTabs: [
      {
        row: 0,
        name: "主线",
        condition(): boolean {
          return true
        },
        component: StoryMainTab,
      }
    ]
  },
  {
    name: '指引',
    id: counter.next(),
    hideable: false,
    condition() {
      return true
    },
    component: H2PTab
  },
  {
    name: "设置",
    id: counter.next(),
    hideable: false,
    condition(): boolean {
      return true
    },
    subTabs: [
      {
        name: "视觉",
        condition(): boolean {
          return true
        },
        row: 0,
        component: OptionVisual
      }
    ]
  }
]

export const Tab = TabClass.createAccessor(...TabData)

EventHub.dispatch('changeTab')
EventHub.on('changeTab', () => TabClass.updateDisplay(), TabClass)

window.dev.tab = Tab