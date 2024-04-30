<script setup lang="ts">
import {StoryHandler} from "../../../core/GameDataBase/story/story.ts";
import {StoryMain} from "../../../core/GameDataBase/story/storyMain.ts";
import StoryUnit from "./storyUnit.vue";
</script>

<template>

  <div v-if="StoryHandler.lastOpenRef.value == '' ">
    <div @click="StoryHandler.open('main')">
      主线
    </div>
    <div @click="StoryHandler.open('side')">
      支线
    </div>
    <div @click="StoryHandler.open('extra')">
      其他
    </div>
  </div>

  <div class="gameUnit-contain flex-col" v-if="StoryHandler.lastOpenRef.value == 'main'">
    <StoryUnit :story="story" v-for="story in StoryMain.all"/>
  </div>

  <div class=""></div>
</template>

<style scoped>
.story-col {
  width: 20%;
}
</style>