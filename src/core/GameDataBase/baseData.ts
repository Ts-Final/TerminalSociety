import {onMounted, onUnmounted, Ref, ref} from "vue"
import {EventHub, GameEvent} from "../gameUpdate/eventHub.ts"

export interface GameDataInterface {
  id: number
  name: string
  unlock(): boolean
}

export function noEmpty<T>(value: T | undefined): T {
  if (value == null) throw new Error("value is empty!")
  return value
}

abstract class GameDataClassAbstract implements GameDataInterface {
  static all: GameDataInterface[] = []
  unlock: () => boolean
  id: number
  name: string
  refs: {
    unlocked: Ref<boolean>
  }

  protected constructor(data: GameDataInterface) {
    this.unlock = data.unlock
    this.id = data.id
    this.name = data.name

    this.refs = {
      unlocked: ref(this.unlock())
    }
    EventHub.logic.on(GameEvent.UPDATE,
      this.updateLogic.bind(this),this)
  }

  abstract get unlocked(): boolean
  abstract set unlocked(value: boolean)

  abstract updateLogic(): void

  abstract updateVisual(): void

}

export class GameDataClass extends GameDataClassAbstract {
  // all the DataClass instances
  static all = [] as GameDataClass[]

  constructor(data: GameDataInterface) {
    super(data);
    this.unlock = data.unlock
    this.id = data.id
    this.name = data.name

    this.refs = {
      unlocked: ref(this.unlock())
    }
  }

  get unlocked(): boolean {
    return false
  }

  /**
   * Generate from a list of data
   */
  static _fromData<T extends typeof GameDataClass>(
    classObj: T,
    ...data: GameDataInterface[]
  ): T {
    for (let i = 0; i < data.length; i++) {
      let ins = new classObj(data[i])
      classObj.all.push(ins)
    }
    return classObj
  }

  /* The all values below should be re-declared in extending class */

  /**
   * The function to create Assessor to the game Object
   * */
  static _createAssessor(classObj: typeof GameDataClass) {
    let all = classObj.all
    return function (id: number) {
      return noEmpty(all.find((x) => x.id === id))
    }
  }

  static createAssessor() {
    return this._createAssessor(this)
  }

  _boundBase(ins: GameDataClass) {
    onMounted(() => EventHub.ui.on(GameEvent.UPDATE, ins.updateVisual.bind(ins), ins))
    onUnmounted(() => EventHub.ui.offAll(ins))
  }

  useBase() {
    this._boundBase(this)
    return this.refs
  }

  updateLogic() {

  }

  updateVisual() {

  }
}
