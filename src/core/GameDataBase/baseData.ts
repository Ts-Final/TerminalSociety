import {Ref, ref} from "vue"
import {EventHub} from "../eventHub.ts"
import {ui} from "../game-mechanics/ui.ts";

export interface GameDataInterface {
  id: number
  name: string

  condition(): boolean

  onUnlock?(): void
}


export abstract class GameDataClass implements GameDataInterface {
  condition: () => boolean
  id: number
  name: string
  refs: {
    unlocked: Ref<boolean>
  }

  protected constructor(data: GameDataInterface) {
    this.condition = data.condition
    this.id = data.id
    this.name = data.name

    this.refs = {
      unlocked: ref(false)
    }
    if (data.onUnlock) {
      this.onUnlock = data.onUnlock
    }

    ui.init.wait(this.updateRef.bind(this))
  }

  abstract get unlocked(): boolean
  abstract set unlocked(value)

  onLogic() {
    EventHub.on('updateLogic', this.updateLogic.bind(this), this)
  }

  abstract updateLogic(): void


  /**
  * @abstract */
  updateRef(): void {
    // the function here is empty because otherwise it will be bugged in constructor
  }

  onUnlock?(): void

  /*
  * return true if the object is unlocked during this check.
  * else would be either that the obj has already been unlocked or
  * it fails the condition check.
  * */
  tryUnlock() {
    if (this.condition()) {
      this.unlocked = true
      if (this.onUnlock) {
        this.onUnlock()
      }
      return true
    }
    return false
  }
}
