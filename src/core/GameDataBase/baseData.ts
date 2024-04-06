import {onMounted, onUnmounted, Ref, ref} from "vue"
import {EventHub, GameEvent} from "../eventHub.ts"
import {noEmpty} from "../functions/noEmpty.ts";

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
  }

  get unlocked(): boolean {
    return false
  }

  /**
   * Volar-complainer. SHIT!!!!!
   *
   * For the extending classes, define createAccessor() and call this function.
   *
   * @param classObj The extending class, which can be used to call its constructor()
   * @deprecated
   */
  static _createAccessor<arg, ins extends GameDataClass>(classObj: { new(data: arg): ins }) {
    return function (...data: arg[]) {
      const all = data.map((x) => new classObj(x))
      const accessor = (id: number) => noEmpty(all.find(x => x.id == id))
      accessor.all = all
      return accessor
    }
  }

  _boundBase(ins: GameDataClass) {
    onMounted(() => EventHub.ui.on(GameEvent.UPDATE, ins.updateVisual.bind(ins), ins))
    onUnmounted(() => EventHub.ui.offAll(ins))
  }

  useBase() {
    this._boundBase(this)
    return this.refs
  }
  onLogic() {
    EventHub.logic.on(GameEvent.UPDATE,this.updateLogic.bind(this),this)
  }

  updateLogic() {}

  updateVisual() {

  }
}
