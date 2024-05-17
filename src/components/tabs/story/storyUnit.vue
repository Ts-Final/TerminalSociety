<script setup lang="ts">
import {StoryClass} from "../../../core/GameDataBase/story/story.ts";

const {story} = defineProps<{ story: StoryClass }>()
const {unlocked} = story.refs
</script>

<template>
  <div class="story-unit" :style="{borderColor:story.border}"
       v-if="unlocked">
    <div class="story-unit-left">
      <div v-html="story.displayIndex"/>
      <div class="story-tri" @click="story.show()">&vrtri;</div>
    </div>
    <div class="story-unit-right-wrapper">
      <div class="story-unit-right" v-html="story.name"/>
      <div class="story-unit-right" v-html="story.description"/>
    </div>
  </div>

</template>

<style scoped>
.story-unit {
  width: 70vw;
  min-height: 10vh;
  max-height: 20vh;
  display: grid;
  grid-template-columns: 1fr 3fr;
  border: 2px var(--border-color) solid;
  align-self: center;
  background-color: #00000088;
  color: #7cdcf4;
}

.story-unit-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  font-size: 2rem;
  border-right: 1px solid var(--border-color);
  align-items: center;
}
.story-unit-right {
  width: 100%;
  align-items: center;
  text-align: center;
}
.story-unit-right-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-around;

}
.story-tri {
  font-size: 2rem;
  width: 4rem;
  height: 4rem;
  cursor: pointer;
}
</style>