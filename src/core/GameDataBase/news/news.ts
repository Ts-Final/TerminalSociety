import {player} from "../../player";

export interface NewsTick {
  content: string
  id: number

  unlocked(): boolean
}

export * from "./news.css"

export const News: NewsTick[] = [
  {
    id: 1,
    content: "天空灰蓝。这种天气，谁都抬不起好心情吧？" +
      "不过这时候撑一把伞，和（或者不）一些人去散步，湿漉漉的空气，谁知道这一丝的愉悦呢？",
    unlocked() {
      return true
    }
  },
  {
    id: 2,
    content: "事实上还有人处于苦难之中。所以现在还不是休息的时候，我们仍有被需要的价值。",
    unlocked(): boolean {
      return true
    }
  },
  {
    id: 3,
    content: "从不起眼的角落里，我们翻出了那个排气扇。提出“把它倒过来”用的那位其实也事实上——算是个天才吧。",
    unlocked() {
      return true
    }
  },
  {
    id: 4,
    content: `就这个战斗<span class='news-ZHANDOU-SHUANG'>爽</span>`,
    unlocked(): boolean {
      return player.options.laugh
    }
  },
  {
    id:5,
    content: "有的时候会想起一些儿时的回忆。从最开始认识瑕亘，还有许多陪着自己走向现在的人，却不知道他们现在又在何处。" +
      "当然，有时也不得不减去那欢愉的过往，和没有意义的昨天。",
    unlocked():boolean {return false}
  },
  {
    id:6,
    content: "114514",
    unlocked(): boolean {
      return player.resource.energy.max_record >= 5e4
    }
  }
]