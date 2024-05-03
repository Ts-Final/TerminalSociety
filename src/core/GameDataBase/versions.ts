import {noEmpty} from "../utils/noEmpty.ts";

function toDate(y: number, month: number, d: number, h = 0, m = 0, s = 0) {
  let date = new Date()
  date.setFullYear(y, month, d)
  // though we dont use the hours, just define it for possible bugs.
  date.setHours(h, m, s)
  return date.getTime()
}

export interface VersionDataInterface {
  id: number
  name: string
  date: number
  description: string[]
}

export const Versions: VersionDataInterface[] = [
  {
    id: 1,
    name: "Pre-Dev 01",
    date: toDate(2023, 11, 18),
    description: ["新增模块：资源（总览，详细），生产"]
  },
  {
    id: 2,
    name: "Pre-Dev 02",
    date: toDate(2024, 1, 30),
    description: ["UI：重构了侧边栏",]
  },
  {
    id: 3,
    name: "Pre-Dev 03",
    date: toDate(2024, 2, 1),
    description: ['新增模块：研究']
  },
  {
    id: 4,
    name: "Pre-Dev 04",
    date: toDate(2024, 2, 9),
    description: ['新增模块：故事（主线，支线，外传）'],
  },
  {
    id: 5,
    name: "Pre-Dev 05",
    date: toDate(2024, 2, 12),
    description: ['重构了底层代码。现在读取游戏数据效率（略微）提高。']
  },
  {
    id: 6,
    name: "Pre-Dev 06",
    date: toDate(2024, 2, 18),
    description: ['新增模块：市场（价格，交易，公司，购买）']
  },
  {
    id: 7,
    name: "Pre-Dev 07",
    date: toDate(2024, 3, 6),
    description: ['UI：新增顶部趣闻栏']
  },
  {
    id: 8,
    name: "Pre-Dev 08",
    date: toDate(2024, 4, 6),
    description: ['新增模块：员工（雇员）']
  },
  {
    id: 9,
    name: "Pre-Dev 09",
    date: toDate(2024, 4, 6),
    description: ['重构底层代码，减少了大量逻辑性能开销。（只是为了方便游戏后续开发）'],
  },
  {
    id: 10,
    name: "Pre-Dev 10",
    date: toDate(2024, 4, 30),
    description: ['加入了这个页面，然后其实可以试试还有没有什么奇奇怪怪的东西。']
  },
  {
    id: 11,
    name: "Pre-Dev 11",
    date: toDate(2024, 5, 1),
    description: ["各位五一快乐！", '新增模块：故事（主线）', '由于各种原因我还是不把全部都放上来了。']
  },
  {
    id: 12,
    name: "Pre-dev 12",
    date: toDate(2024, 5, 3),
    description: ["给故事界面加了分类，现在可以分类查看了。", "实现了离线进度计算。"]
  }
]

export const LatestVersion = Math.max(...Versions.map(x => x.id))
export const Version = (id: number) => noEmpty(Versions.find(x => x.id == id))