import {player} from "../../player";
import {ref, Ref} from "vue";
import {EventHub, GameEvent} from "../../eventHub.ts";
import {randomElement} from "../../functions/random.ts";
import {Options} from "../../game-mechanics/options.ts";

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
    id: 5,
    content: "有的时候会想起一些儿时的回忆。从最开始认识瑕亘，还有许多陪着自己走向现在的人，却不知道他们现在又在何处。" +
      "当然，有时也不得不减去那欢愉的过往，和没有意义的昨天。",
    unlocked(): boolean {
      return false
    }
  },
  {
    id: 6,
    content: "114514",
    unlocked(): boolean {
      return player.resource.energy.max_record >= 5e4
    }
  }
]

export const NewsHandler = new (class NewsHandler {
  data: NewsTick[]
  refs: {
    enabled: Ref<boolean>,
    recent: Ref<number[]>,
    id: Ref,
  }
  recent: number[]
  recentMax: number = 2

  constructor() {
    this.data = News

    if (this.seen.length < Math.ceil(this.data.length / 20)) {
      while (this.seen.length < Math.ceil(this.data.length / 20)) {
        this.seen.push(0)
      }
    }
    this.refs = {
      enabled: ref(false),
      recent: ref([]),
      id: ref(),
    }
    this.recent = []
    EventHub.ui.on(GameEvent.UPDATE, this.update.bind(this), this)
  }

  /**
   * 这个东西是每20个一组
   */
  get seen() {
    return player.news.seen
  }

  get totalSeen() {
    return player.news.totalSeen
  }

  set totalSeen(value: number) {
    player.news.totalSeen = value
  }

  get all() {
    return this.data
  }

  get clicks() {
    return player.news.stupidThings.clicks
  }

  get unlocked() {
    return this.data.filter(x => x.unlocked())
  }

  get randomUnlocked() {
    return randomElement(this.unlocked)
  }

  setSeen(id: number) {
    let index = Math.floor((id - 1) / 20)
    this.seen[index] |= 2 ** (id - index * 20)
  }

  update() {
    this.refs.enabled.value = Options.visual.newsEnabled
    this.refs.recent.value = this.recent
  }

  changeNextNews(span: Ref<HTMLSpanElement | undefined>,
                 contain: Ref<HTMLDivElement | undefined>) {
    if (span.value == undefined) {
      setTimeout(() => this.changeNextNews(span, contain), 100)
      return
    }

    let nextNews = this.randomUnlocked
    while (this.recent.includes(nextNews.id)) {
      nextNews = randomElement(News.filter((x) => x.unlocked()))
    }
    this.recent.push(nextNews.id)
    while (this.recent.length > this.recentMax) {
      this.recent.shift()
    }

    span.value.innerHTML = nextNews.content // set the content
    span.value.style["transitionDuration"] = "0s"
    span.value.style['transform'] = "translateX(0)"

    setTimeout(() => this.setDuration(span, contain), 500)

  }

  setDuration(span: Ref<HTMLSpanElement | undefined>,
              contain: Ref<HTMLDivElement | undefined>) {
    if (span.value == undefined || contain.value == undefined) {
      setTimeout(() =>
        this.setDuration(span, contain), 500)
      return
    }
    const scrollSpeed = 140 // px /s
    const duration = (span.value.clientWidth + contain.value.clientWidth) / scrollSpeed
    span.value.style["transform"] = "translateX(-100%)"

    span.value.style['transitionDuration'] = duration + "s"

    this.refs.id.value = setTimeout(() =>
      this.changeNextNews(span, contain), duration * 1000)
  }
})()