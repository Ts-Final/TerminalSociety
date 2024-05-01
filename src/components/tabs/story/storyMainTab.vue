<script setup lang="ts">

import StoryUnit from "./storyUnit.vue";
import {StoryMain} from "../../../core/GameDataBase/story/storyMain.ts";

</script>

<template>
  <div class="full overflow-y-scroll">
    <div class="story-tab-title">主线故事</div>
    <div class="full-w flex-col">
      <StoryUnit :story="story" v-for="story in StoryMain.all"/>
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
</style>