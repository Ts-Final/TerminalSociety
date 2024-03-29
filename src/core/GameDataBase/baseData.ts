import {onMounted, onUnmounted, ref, Ref} from "vue"
import {EventHub, GameEvent} from "../gameUpdate/eventHub.ts"

export interface GameDataInterface {
  id: number
  name: string

  unlock(): boolean
}

// this is just used to shit the value, doesnt valuable.
function shit(value: any) {
  return value == value
}

export function noEmpty<T>(value: T | undefined): T {
  if (value == null) throw new Error("value is empty!")
  return value
}

abstract class GameDataClassAbstract {
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
  }

  abstract get unlocked():boolean
  abstract set unlocked(value: boolean)

  useBase() {
    onMounted(() => EventHub.ui.on(GameEvent.UPDATE, this.updateVisual, this))
    onUnmounted(() => EventHub.ui.offAll(this))
    return this.refs
  }

  abstract updateLogic(): void
  abstract updateVisual(): void

}

export class GameDataClass extends GameDataClassAbstract {
  refs: { unlocked: Ref<boolean> };

  get unlocked(): boolean {
    return false
  }

  constructor(data: GameDataInterface) {
    super(data);
    this.unlock = data.unlock
    this.id = data.id
    this.name = data.name

    this.refs = {
      unlocked: ref(this.unlock())
    }
  }

  updateLogic() {

  }

  updateVisual() {

  }

  /* The all values below should be re-declared in extending class */
  // all the DataClass instances
  static all = [] as GameDataClass[]

  /**
   * Generate from a list of data
   * @param data
   */
  static fromData(...data: GameDataInterface[]) {
    for (let i = 0; i < data.length; i++) {
      let ins = new GameDataClass(data[i])
      GameDataClass.all.push(ins)
    }
    return GameDataClass
  }
  /**
   * The function to create Assessor to the game Object
   * */
  static _createAssessor() {
    let all = GameDataClass.all
    return function (id: number) {
      return noEmpty(all.find((x) => x.id === id))
    }
  }
}
