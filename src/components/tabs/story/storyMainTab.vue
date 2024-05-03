<script setup lang="ts">

import StoryUnit from "./storyUnit.vue";
import {ChapterNames, StoryMain, StoryMainClass} from "../../../core/GameDataBase/story/storyMain.ts";
import {ref} from "vue";

const idx = ref(0)
const option: {
  fn: (x: StoryMainClass) => boolean,
  name: string
}[] = [
  {
    fn: () => true,
    name: "不筛选",
  },
  {
    fn: (x: StoryMainClass) => x.chapter == 0,
    name: `章节：${ChapterNames[0]}`
  }
]

function changeToNext() {
  if (idx.value == option.length - 1) {
    idx.value = 0
  } else {
    idx.value += 1
  }
}

</script>

<template>
  <div class="full overflow-y-scroll">
    <div class="story-tab-title">主线故事</div>
    <div class="story-filter" v-html="option[idx].name" @click="changeToNext"></div>
    <div class="full-w flex-col">
      <StoryUnit :story="story" v-for="story in StoryMain.all.filter(option[idx].fn)"/>
    </div>
  </div>
</template>

<style scoped>
.story-tab-title {
  color: #7cdcf4;
  font-size: 2rem;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.story-filter {
  position: fixed;
  right: 2rem;
  top: 4rem;
  border:2px solid #7cdcf4;
  background-color: #000000;
  color: #7cdcf4;
  line-height: 1.5rem;
  min-width: 15rem;
  text-align: center;
  cursor: pointer;
}
</style>