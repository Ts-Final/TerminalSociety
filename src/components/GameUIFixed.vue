<script setup lang="ts">

import PopoutModal from "./Modals/PopoutModal.vue";
import Sidebar from "./sidebar/Sidebar.vue";
import {ui} from "../core/game-mechanics/ui.ts";
import StoryCurrent from "./tabs/story/storyCurrent.vue";
import {StoryClass} from "../core/GameDataBase/story/story.ts";
</script>

<template>
  <div id="ui-fixed" class="c-game-ui--fixed">
    <Sidebar/>
    <StoryCurrent :current="StoryClass.refs.current.value"
                  v-if="StoryClass.refs.current.value"/>
    <PopoutModal
        v-if="ui.view.modal.refs.current.value && ui.view.modal.current"
        :modal="ui.view.modal.current"
    />
    <div class="black-curtain" v-if="ui.curtain.ref.value"
         :style="ui.curtain.style.value"/>
    <div class="flex-col" id="notifyContainer"/>
  </div>
</template>

<style scoped>
.c-game-ui--fixed {
  display: flex;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: var(--z-fixed);
  justify-content: center;
  pointer-events: none;
}

#notifyContainer {
  top: 0;
  right: 0;
  position: absolute;
  margin: 5px;
}

.black-curtain {
  width: 100vw;
  height: 100vh;
  background-color: #000000;
  position: absolute;
  left: 0;
  top: 0;
  z-index: var(--z-modal-bg);
}
</style>