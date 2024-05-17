<script setup lang="ts">

import ModalBase from "./ModalBase.vue";
import SidebarTab from "../sidebar/SidebarTab.vue";
import {Tab} from "../../core/GameDataBase/tabs.ts";
import TaskUnit from "../tabs/task/TaskUnit.vue";
import {Task} from "../../core/GameDataBase/task.ts";
import ResearchUnit from "../tabs/research/researchUnit.vue";
import {Research} from "../../core/GameDataBase/research.ts";
</script>

<template>
  <ModalBase class="flex-col overflow-y-scroll align-center">
    <template v-slot:header>
      基础玩法介绍
    </template>
    <div>
      欢迎来到末式！本窗口将讲述一些简单的游戏玩法。
      指引也可以在左侧侧边栏中找到，不过和这个略为不同。
    </div>
    <div class="size-1.25rem margin-top-2rem">
      侧边栏
    </div>
    <div>
      左侧你可以看到游戏各功能界面切换的地方：侧边栏。<br>
      尝试点击一下吧！<br>
      <div style="width:var(--left-bar-width)" class="style-border">
        <SidebarTab :tab="Tab(0)"></SidebarTab>
      </div>
      有一些功能里面细分为了数个小的模块。<br>
      你可以尝试看看资源中的两个页面。（当然更推荐先看完这个窗口。）
    </div>
    <div class="size-1.25rem margin-top-2rem">
      基础资源
    </div>
    <div>
      游戏中你拥有数种基础资源：能量，铁，铜，（到处都是的）空气之类。<br>
      你可以通过很多种途径获得这些资源，包括但不限于下文的“生产任务”。<br>
      不能过度浪费哦。<br>
    </div>
    <div class="size-1.25rem margin-top-2rem">
      生产任务
    </div>
    <div>
      生产任务是游戏中获取资源最基础的方式。<br>
      每一个生产任务都对应一个（或数个）资源的生产和消耗，也有部分任务是不消耗资源的。<br>
      你可以在左侧“生产”页面中查看，不过这里有一个。<br>
      <TaskUnit :task="Task(0)"/>
      当然你也看到了，每个生产任务下方有一个小弹窗，用于补充一些奇奇怪怪的信息。
    </div>
    <div class="margin-top-2rem"></div>
    <div class="margin-top-2rem size-1.25rem">研究</div>
    <div>
      你可以通过研究来为末式提供加成。<br>
      研究可以为各种东西提供加成：比如生产任务的产出，资源消耗的减少。 <br>
      <span v-if="Research(0).refs.level.value < 1">
        尝试完成这个研究吧。
        （请注意：研究模块
        <span style="color: #f00;">必须</span>
        完成此研究以继续，你也可以在研究页面中进行此研究。）</span>
      <span v-else>
        当然你已经完成示例研究了。棒！
      </span>
      <div  class="self-center">
        <ResearchUnit :research="Research(0)" style="display:flex;left: 20%;width: 60%;"/>
      </div>
    </div>
  </ModalBase>
</template>

<style scoped>

</style>