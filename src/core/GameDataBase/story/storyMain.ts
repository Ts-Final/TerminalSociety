import {StoryClass, StoryDataInterface} from "./story.ts";
import {player} from "../../player.ts";

export const StoryMainData: StoryDataInterface[] = [
  {
    id: 0,
    dataIndex: "Main0-0",
    index: "",
    name: "序",
    unlock(): boolean {
      return player.dev
    },
    content: [],
    chapter: 0,
  }
]

export const StoryMain =
  StoryClass.createAccessor('main', ...StoryMainData)

export const StoryMainHandler = {
  all: StoryMain.all,
  get allChapters() {
    let x = 0
    this.all.forEach(s => x = s.chapter > x ? s.chapter : x)
    return x
  },
  sortByChapter() {
    let v: StoryClass[][] = []
    for (let i = 0; i < this.allChapters; i++) {
      v.push(this.all.filter(x => x.chapter == i))
    }
    return v
  },
}