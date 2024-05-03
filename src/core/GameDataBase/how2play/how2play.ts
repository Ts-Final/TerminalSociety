import "./h2p.css"
import {player} from "../../player";
import {ref, Ref} from "vue";
import {EventHub, GameEvent} from "../../eventHub.ts";
import {noEmpty} from "../.././utils/noEmpty.ts";
import {Resource} from "../resource.ts";
import {LatestVersion, Version} from "../versions.ts";

export interface how2play {
  id: number
  title: string
  info: string

  unlock(): boolean
}

export const versionCount = 15 + LatestVersion
export const version = Version(LatestVersion).id

let setUpDate = new Date(2022, 5, 28)
let passedDays = Math.floor((Date.now() - setUpDate.getTime()) / (1000 * 60 * 60 * 24))

export const How2PlayData: how2play[] = [
  {
    id: 1000,
    title: '关于游戏',
    info: `
    <p class="small-title size-1.5rem">
    Terminal Society Incorporated.<br>
    <span class="rainbow-text">
    Decline EndWorld
    </span>
    </p>
    末式公司，是一家以建立平等社会为终极目的的联合公司。<br>
    作为公司目前实际领导人，你需要从最基础开始管理（其实没有多少）。<br><br>
    以上是设定。本游戏是从Space Travel Idle
    <a style="color:#d7ec31" href="https://store.steampowered.com/app/1407860/">(steam)</a>
    改变而来，加入了作者设定的一些世界观使本游戏稍微丰富一点（作者发疯确认）。<br>
    本游戏于2022/5/28立项。前后一共有${versionCount}个版本（现在已经过去了${passedDays}天）
    `,
    unlock: () => true
  },
  {
    id: 1001,
    title: "致谢",
    info: `
    <p class="small-title">
    （以下排名不分先后，部分名字暂时以缩写代替）<br>
    部分带有点的为名字缩写或比较泛用代号，个人名义<br>
    <span class="rainbow-text-color">（游戏都没做完你就致谢了？）</span>
    </p>
    <p class="small-title size-1.25rem shadow">Creator</p>
    <p class="small-title rainbow-text-color">Ts.Final</p>
    <p class="small-title size-1.25rem shadow">Ts.Inc Assistants</p>
    <div class="credit-3col">
      <p>Kun.</p>
      <p>HW.</p>
      <p>RJY.</p>
      <p>Ryuji</p>
      <p>MCY.</p>
      <p>WQX.</p>
    </div>
    <p class="small-title size-1.25rem shadow">Special Thanks</p>
    <div class="credit-3col">
      <p>Arcaea中文维基</p>
      <p>一直等待本游戏的各位</p>
      <p>Felleta Inc.</p>
      <p>作者的电脑</p>
    </div>
    <p class="small-title size-1.5rem rainbow-text">Thank for your playing!</p>
    `,
    unlock: () => player.dev,
  },
  {
    id: 1,
    title: '资源',
    info: `
    游戏进行中可以采集的各种物资。<br>
    通过各种方式可以获取各种物资，有些物资要到游戏的一定阶段（解锁了相应途径）之后才会开放获取，但是也会显示在表格中。<br>
    你的物资是有上下限的（基础为0~10000），超出这个范围的物资获取可能被暂停（参见各个物资获取途径的指引，可能会有提及）。<br>
    物资获取会受到一系列的影响。可以在 资源-详细 中查看各种影响效果及其来源。（由于某些原因，部分影响效果可能不会给出名字）<br>
    `,
    unlock: () => true,
  },
  {
    id: 2,
    title: '生产',
    info: `
    生产游戏中各种物资最常见的途径。<br>
    将鼠标覆盖在各个生产任务上方可以查阅该生产任务的物资产出、消耗（计算物资获取之前）。
    `,
    unlock: () => true
  },
  {
    id: 3,
    title: "市场",
    info: `
    <div class="text-italic small-title">纷繁复杂的资本……沉浮其中的代价是什么？</div>
    市场机制允许你购买一些乱七八糟的东西，通过交易（资源）等途径获取资金，至于怎么花取决于你。<br>
    每天0点，市场资源价格和可交易的资源会刷新。请注意这是离线加载的，如果0点时在线会错过刷新（会优化，在路上了<br>
    如果你觉得今天的东西太抽象了，可以按Alt+M以刷新市场价格和资源。请注意这是补救措施，在一定时间后会删除此功能。<br>
    <br>
    <div class="small-title">交易</div>
    每家公司在每天刷新的时候会提供一些物资的交易。你可以无限卖出（做好功能之后会限制），但每日购买是限量的。<br>
    
    `,
    unlock() {
      return Resource.air.max_record.gte(20)
    }
  },
  {
    id: 4,
    title: "求助",
    info: `
    如果你有需要，可以在<a href="https://github.com/Ts-Final/Terminal-Society-SourceCode">Github(链接)</a>上提出issue反馈，如果无法访问github可以通过qq联系我（你从哪个群得知你游就从哪里找我）<br>
    请不要对一些刻意设计提出疑问，虽然我还是能解决问题（不过还没有刻意设计）<br>
    <div class="self-center full-w" style="font-size: 3rem">当前版本为${Version(LatestVersion).name}，尚未完成！</div>
    `,
    unlock: () => true,
  }
]

export class How2PlayClass {
  static all: How2PlayClass[]
  static refs = {
    id: ref(0),
    info: ref(""),
    title: ref(""),
  }
  id: number
  title: string
  info: string
  refs: {
    unlocked: Ref<boolean>,
  }
  unlock: () => boolean

  constructor(data: how2play) {
    this.id = data.id
    this.title = data.title
    this.info = data.info
    this.unlock = data.unlock
    this.refs = {
      unlocked: ref(false)
    }

    EventHub.logic.on(GameEvent.UPDATE, this.updateLogic.bind(this), this)
  }

  static fromData(...data: how2play[]) {
    this.all = data.map(e => new this(e))
    const accessor = (id: number) => noEmpty(this.all.find(e => e.id == id))
    accessor.all = this.all
    accessor.sorted = this.sorted()
    return accessor
  }

  static sorted() {
    let v: How2PlayClass[] = this.all
    return v.sort((a, b) => a.id - b.id)
  }

  useBase() {
    return this.refs
  }

  updateLogic() {
    this.refs.unlocked.value ||= this.unlock()
  }

  show() {
    player.how2play = this.id
    const refs = How2PlayClass.refs
    refs.id.value = this.id
    refs.title.value = this.title
    refs.info.value = this.info

  }
}

export const How2Play = How2PlayClass.fromData(...How2PlayData)