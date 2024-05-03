import {onMounted, onUnmounted, Ref, ref} from "vue"
import {EventHub, GameEvent} from "../eventHub.ts"
import {ui} from "../game-mechanics/ui.ts";

export interface GameDataInterface {
  id: number
  name: string

  unlock(): boolean

}

/*
abstract class GameDataClassAbstract implements GameDataInterface {
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
      this.updateLogic.bind(this), this)
  }

  abstract get unlocked(): boolean
  abstract set unlocked(value: boolean)

  abstract updateLogic(): void

  abstract updateVisual(): void

}
*/
export class GameDataClass implements GameDataInterface {
  unlock: () => boolean
  id: number
  name: string
  refs: {
    unlocked: Ref<boolean>
  }

  constructor(data: GameDataInterface) {
    this.unlock = data.unlock
    this.id = data.id
    this.name = data.name

    this.refs = {
      unlocked: ref(false)
    }

    ui.init.wait(this.updateRef.bind(this))
  }

  get unlocked(): boolean {
    return false
  }

  _boundBase(ins: GameDataClass) {
    onMounted(() => EventHub.ui.on(GameEvent.UPDATE, ins.updateRef.bind(ins), ins))
    onUnmounted(() => EventHub.ui.offAll(ins))
  }

  /** @deprecated */
  useBase() {
    this._boundBase(this)
    return this.refs
  }

  onLogic() {
    EventHub.logic.on(GameEvent.UPDATE, this.updateLogic.bind(this), this)
  }

  updateLogic() {
  }

  updateRef() {

  }
}
