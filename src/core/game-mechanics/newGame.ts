import {Modal} from "../utils/modal.ts";
import {Tab} from "../GameDataBase/tabs.ts";
import {Task} from "../GameDataBase/task.ts";
import {ui} from "./ui.ts";

export function NewGame() {
  Modal.WhatsYourNameModal.show({})
  Modal.ChooseYNModal.show({fulfill: BP1, reject: () => undefined, content: "是否要开始新手教程？"})
}

function BP1() {
  Tab(0).show(0)
  Modal.NormalContentModal.show({
    content: "欢迎来到末式！本系列回归性指引将带你重温这里将发生的东西。",
    callback: () => {
      Modal.NormalContentModal.show({
        content:
          "我们拥有各种的物资。在此页面（资源-总览）你可以查看当前物资的数量，上限，每秒的变化，", callback: BP2
      })

    }
  })
}

function BP2() {
  Tab(1).show()
  ui.curtain.show({"backgroundColor": "none"})
  Modal.NormalContentModal.show({
    content: "这里是生产任务的总览。尝试启动第一个生产任务吧。",
    callback: () => {
      ui.curtain.hide()
    }
  })
  BP2pending()
}

function BP2pending() {
  if (Task(0).unlocked) {
    BP3()
    return
  }
  setTimeout(BP2pending, 20)
}

function BP3() {
  Tab(2).show()
  Modal.NormalContentModal.show({content: "很好。这里是研究模块。自己试试吧。（系列教程结束）"})
}

window.dev.ng = NewGame