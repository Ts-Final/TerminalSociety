import {player} from "../player";
import {Resource} from "./resource.ts";
import {GameDataClass, GameDataInterface} from "./baseData.ts";
import {Ref, ref} from "vue";
import {notify} from ".././utils/notify.ts";
import {Accessor, ResourceTypes} from "../constants.ts";
import {noEmpty} from ".././utils/noEmpty.ts";
import {Upgrades} from "./market/upgrade.ts";
import {Numbers} from "../utils/Numbers.ts";

interface TaskDataInterface extends GameDataInterface {
  id: number
  name: string
  des: string
  itl: string
  produce: [ResourceTypes, number][]
  cost: [ResourceTypes, number][]

  condition(): boolean
}

/**
 * @example
 {
 id:114,
 name:"",
 des:"",
 itl: "",
 produce:[],
 cost:[],
 get unlock() {},
 },

 */
const counter = Numbers.counter(0, 1)
export const TaskData: TaskDataInterface[] = [
  {
    id: counter.next(),
    name: "太阳能",
    des: "至少太阳一直照耀着这里。",
    itl: "也没有人知道，为什么太阳永不落下",
    produce: [["energy", 5]],
    cost: [],
    condition: () => true,
  },
  {
    id: counter.next(),
    name: "排气扇",
    des: "排气扇反过来用就可以变成吸气扇了。",
    itl: "仍然看着很怪，你也不清楚这玩意是否能用，并且开始怀念空气泵",
    produce: [["air", 1]],
    cost: [["energy", 2]],
    condition() {
      return Resource("energy").max_record.gt(25)
    }
  },
  {
    id: counter.next(),
    name: "矿泉水瓶",
    des: "这玩意总比那个倒过来用的排气扇要正常一点，虽然也不是什么好东西",
    itl: "什么年代了还需要手动舀水的？你仍然觉得作者脑子多少有点问题，不过总归不用耗能。",
    produce: [["water", 2]],
    cost: [],
    condition() {
      return Resource.air.max_record.gt(3)
    },
  },
  {
    id: counter.next(),
    name: "下矿",
    des: "从别人那里买的确很方便，但要担心被背刺的那一天什么时候到来",
    itl: "最后决定：自己去买一片地。真正实现矿产自由，但是环境破坏嘛……你仍然需要思考。",
    produce: [['iron', 10], ['copper', 10], ["coal", 20]],
    cost: [['energy', 100], ['water', 5]],
    condition() {
      return Upgrades(0).unlocked
    },
  },
  {
    id: counter.next(),
    name: "水泵",
    des: "机械时代！收藏矿泉水瓶吧，我们终于有了一个效率更高的东西。",
    itl: "这块地的旁边就是一条小河，对岸是另外一片荒地。谁知道■■花了多大力气才找了这么一块风水宝地。",
    produce: [['water', 10]],
    cost: [['energy', 10]],
    condition() {
      return Upgrades(0).unlocked
    },
  },
]

export class TaskClass
  extends GameDataClass
  implements TaskDataInterface {

  refs: {
    unlocked: Ref<boolean>,
    activated: Ref<boolean>,
  }
  des: string
  itl: string
  produce: [ResourceTypes, number][]
  cost: [ResourceTypes, number][]

  constructor(data: TaskDataInterface) {
    super(data);
    this.des = data.des;
    this.itl = data.itl
    this.produce = data.produce
    this.cost = data.cost
    this.refs = {
      unlocked: ref(false),
      activated: ref(false),
    }
    if (player.task[this.id] == undefined) {
      player.task[this.id] = [false, false]
    }
    this.onLogic()
  }

  get unlocked(): boolean {
    return player.task[this.id][0]
  }

  set unlocked(value: boolean) {
    player.task[this.id][0] = value
    this.refs.unlocked.value = value
  }

  get activated(): boolean {
    return player.task[this.id][1]
  }

  set activated(value: boolean) {
    player.task[this.id][1] = value
    this.refs.activated.value = value
  }

  static createAccessor(...data: TaskDataInterface[]): Accessor<TaskClass> {
    const all = data.map((x) => new this(x))
    const accessor = (id: number) => noEmpty(all.find(x => x.id == id))
    accessor.all = all
    return accessor
  }

  trigger() {
    this.activated = !this.activated
  }

  updateRef() {
    this.refs.activated.value = this.activated
    this.refs.unlocked.value = this.unlocked
  }

  updateLogic(speed: number = 1) {
    if (!this.unlocked) {
      if (this.tryUnlock()) {
        notify.success(`解锁生产：${this.name}`, 1000)
      }
      return;
    }

    // activate check
    if (!this.activated) return;

    // About Resources
    if (this.produce.map((x) =>
      Resource(x[0]).canEffectProduce(x[1]))
      .includes(false)) return
    if (this.cost.map(x =>
      Resource(x[0]).canEffectCost(x[1]))
      .includes(false)) return


    for (let [resKey, value] of this.produce) {
      Resource(resKey).effectProduce(value * speed)
    }
    for (let [resKey, value] of this.cost) {
      Resource(resKey).effectCost(value * speed)
    }
  }

}

export const Task = TaskClass.createAccessor(...TaskData)
window.dev.task = {Task, TaskClass}