<script setup lang="ts">
import {StoryClass, StoryHandler} from "../../../core/GameDataBase/story/story.ts";

const {story} = defineProps<{story: StoryClass}>()
const {unlocked} = story.refs
</script>

<template>
  <div class="gameUnit medium-size" :style="{borderColor:story.border}"
       v-if="unlocked"
       @click="StoryHandler.show(story)">
    <p v-html="story.name"></p>
  </div>

</template>

<style scoped>

</style>