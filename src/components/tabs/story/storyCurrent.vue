<script setup lang="ts">

import {StoryClass} from "../../../core/GameDataBase/story/story.ts";

const {current, content, ended} = StoryClass.refs
</script>

<template>
  <div class="story-current slow-show"
       @click="StoryClass.next()" v-if="current">
    <div class="story-topbar">
      <div class="story-topbar-close" @click="StoryClass.close()">&ltcc; 返回</div>
      <div class="story-topbar-fast" @click="StoryClass.fastRead()">&Del;快速浏览</div>
      <div class="size-1.5rem" v-html="current.name"/>
    </div>
    <div class="story-content">
      <div v-for="p in content"
           class="story-piece slow-show" v-html="p">
      </div>
      <div class="story-end" v-if="ended">
        <div style="width: 70%;height: 2px;"/>
        <div style="width: 80%;height: 5px;"/>
      </div>
      <div class="story-padding-bottom"></div>
    </div>
  </div>

</template>

<style scoped>
.story-current {
  background-color: #000000cc;
  position: fixed;
  left: var(--left-bar-width);
  width: calc(100vw - var(--left-bar-width));
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  color: #7cdcf4;
  pointer-events: all;

}

.story-content {
  flex-direction: column;
  display: flex;
  padding: 15px 10rem 0 10rem;
  user-select: text;
}

.story-topbar {
  text-align: center;
  position: relative;
  margin-top: 5rem;
}

.story-topbar-close {
  cursor: pointer;
  pointer-events: auto;
  left: calc(var(--left-bar-width) + 10px);
  top: 5px;
  position: fixed;
}
.story-topbar-fast {
  cursor: pointer;
  pointer-events: auto;
  right: 10px;
  top: 5px;
  position: fixed;
}

.story-piece {
  margin-top: 5px;
}
.story-end {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}
.story-end > div {
  margin-top: 5px;
  background-color: #7cdcf4;
  align-self: center;
}

.story-padding-bottom {
  height: 10vh;
  width: 100%;
}
</style>