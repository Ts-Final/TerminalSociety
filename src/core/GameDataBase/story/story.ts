import {GameDataClass} from "../baseData.ts";
import {ref, Ref} from "vue";
import {player} from "../../player.ts";
import {noEmpty} from "../../utils/noEmpty.ts";
import {Accessor, Optional} from "../../constants.ts";
import {notify} from "../../utils/notify.ts";
import {Options} from "../../game-mechanics/options.ts";

export interface StoryData {
  id: number
  name: string
  // 序号 用于player存储
  index: string
  //
  description: string

  content: string[]
  border?: string
  displayIndex?: string

  unlock(): boolean
}

export class StoryClass extends GameDataClass {
  static refs = {
    current: ref<Optional<StoryClass>>(),
    content: ref([]) as Ref<string[]>,
    full: [] as string[],
    ended: ref(false)
  }
  static interval: Optional<NodeJS.Timeout> = undefined
  refs: {
    unlocked: Ref<boolean>
  }
  // 序号 用于player存储
  index: string

  content: string[]
  border?: string
  description: string
  displayIndex?: string

  constructor(data: StoryData) {
    super({
      id: data.id,
      name: data.name,
      condition: data.unlock
    });
    this.index = data.index
    this.content = data.content
    this.description = data.description

    if (player.final) {
      this.description = this.description.replace(/\*.+\*/g, '')
    }
    if (data.displayIndex) {
      this.displayIndex = data.displayIndex
    } else {
      this.displayIndex = data.index
    }

    this.refs = {
      unlocked: ref(false),
    }
    if (player.story[this.index] == undefined) {
      player.story[this.index] = [false, false]
    }
    this.onLogic()
  }

  get unlocked() {
    return player.story[this.index][0]
  }

  set unlocked(value: boolean) {
    player.story[this.index][0] = value
    this.refs.unlocked.value = value
  }

  get read() {
    return player.story[this.index][1]
  }

  set read(value: boolean) {
    player.story[this.index][1] = value
  }

  /**
   * Use this function in divided parts wont make stupid things.
   * Maybe.
   * */
  static createAccessor(data: StoryData[]): Accessor<StoryClass> {
    const all = data.map(x => new this(x))
    const accessor = (id: number) => noEmpty(all.find(x => x.id === id))
    accessor.all = all
    return accessor
  }

  static show(ins: StoryClass) {
    this.refs.current.value = ins

    if (Options.visual.autoStory) {
      this.interval = setInterval(this.next.bind(this), 5e3)
    }
    this.refs.content.value = []
    this.refs.full = ins.content.map(x => x.replace("[player]", player.customName))
  }

  static next() {
    if (!this.refs.current.value) return

    if (this.refs.content.value.length < this.refs.full.length) {
      const next = this.refs.full[this.refs.content.value.length]
      this.refs.content.value.push(next)
    } else {
      clearInterval(this.interval)
      this.refs.ended.value = true
    }
  }

  static close() {
    this.refs.current.value = undefined
    this.refs.full = []
    this.refs.content.value = []
    this.refs.ended.value = false
    clearInterval(this.interval)
  }

  static fastRead() {
    if (!this.refs.current.value) return
    this.refs.content.value = []
    this.refs.content.value = this.refs.full
    this.next()
  }

  updateRef() {
    this.refs.unlocked.value = this.unlocked
  }

  updateLogic() {
    if (!this.unlocked) {
      this.unlocked ||= this.condition()
      if (this.unlocked) {
        notify.success('故事篇章解锁：' + this.index + "  " + this.name, 1500)
      }
    }
  }

  show() {
    if (!this.unlocked) return
    this.read = true
    StoryClass.show(this)
  }
}

window.dev.storyClass = StoryClass