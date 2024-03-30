import {player} from "../player";
import {Resources, ResourceTypes} from "./resource.ts";
import {GameDataClass, GameDataInterface} from "./baseData.ts";
import {Ref, ref} from "vue";

interface TaskDataInterface extends GameDataInterface {
  id: number
  name: string
  des: string
  itl: string
  produce: [ResourceTypes, number][]
  cost: [ResourceTypes, number][]

  unlock(): boolean
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
export const TaskData: TaskDataInterface[] = [
  {
    id: 0,
    name: "太阳能",
    des: "至少太阳一直照耀着这里。",
    itl: "也没有人知道，为什么太阳永不落下",
    produce: [["energy", 5]],
    cost: [],
    unlock: () => true,
  },
  {
    id: 1,
    name: "排气扇",
    des: "排气扇反过来用就可以变成吸气扇了。",
    itl: "仍然看着很怪，你也不清楚这玩意是否能用，并且开始怀念空气泵",
    produce: [["air", 1]],
    cost: [["energy", 2]],
    unlock() {
      return Resources.energy.max_record >= 25
    }
  },
  {
    id: 2,
    name: "矿泉水瓶",
    des: "这玩意总比那个倒过来用的排气扇要正常一点，虽然也不是什么好东西",
    itl: "什么年代了还需要手动舀水的？你仍然觉得作者脑子多少有点问题，不过总归不用耗能。",
    produce: [["water", 2]],
    cost: [],
    unlock() {
      return Resources.air.max_record >= 3
    },
  },
  {
    id: 3,
    name: "下矿",
    des: "从别人那里买的确很方便，但要担心被背刺的那一天什么时候到来",
    itl: "最后决定：自己去买一片地。真正实现矿产自由，但是环境破坏嘛……你仍然需要思考。",
    produce: [['iron', 10], ['copper', 10], ["coal", 20]],
    cost: [['energy', 100], ['water', 5]],
    unlock() {
      return false
    },
  },
  {
    id: 4,
    name: "水泵",
    des: "机械时代！收藏矿泉水瓶吧，我们终于有了一个效率更高的东西。",
    itl: "这块地的旁边就是一条小河，对岸是另外一片荒地。谁知道■■花了多大力气才找了这么一块风水宝地。",
    produce: [['water', 10]],
    cost: [['energy', 10]],
    unlock() {
      return false
    },
  },
]

export class TaskClass
  extends GameDataClass
  implements TaskDataInterface {

  static all: TaskClass[] = []
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
  }

  get unlocked(): boolean {
    return player.task[this.id][0]
  }

  set unlocked(value: boolean) {
    player.task[this.id][0] = value
  }

  get activated(): boolean {
    return player.task[this.id][1]
  }

  set activated(value: boolean) {
    player.task[this.id][1] = value
  }

  static fromData(data: TaskDataInterface[]) {
    return super._fromData(this, ...data)
  }

  static createAssessor(): (id: number) => GameDataClass {
    return super._createAssessor(this)
  }

  trigger() {
    this.activated = !this.activated
    this.updateVisual()
  }

  updateVisual() {
    this.refs.activated.value = this.activated
    this.refs.unlocked.value = this.unlocked
  }
  updateLogic() {
    this.unlocked = this.unlock() || this.unlocked
  }

  useBase() {
    console.trace("Task: UseBase")
    this._boundBase(this)
    return this.refs
  }
}

export const Tasks = TaskClass.fromData(TaskData)
export const Task = Tasks.createAssessor()