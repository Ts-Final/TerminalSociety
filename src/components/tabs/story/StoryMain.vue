<script setup lang="ts">

import StoryUnit from "./storyUnit.vue";
import {StoryMain} from "../../../core/GameDataBase/story/storyMain.ts";

</script>

<template>
  <div class="gameUnit-contain flex-col">
    <StoryUnit :story="story" v-for="story in StoryMain.all"/>
  </div>
</template>

<style scoped>

</style>