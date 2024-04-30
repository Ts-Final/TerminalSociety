<script setup lang="ts">

import PopoutModal from "./Modals/PopoutModal.vue";
import Sidebar from "./sidebar/Sidebar.vue";
import {ui} from "../core/game-mechanics/ui.ts";
</script>

<template>
  <div id="ui-fixed" class="c-game-ui--fixed">
    <Sidebar />
    <PopoutModal
        v-if="ui.view.modal.refs.current.value && ui.view.modal.current"
        :modal="ui.view.modal.current"
    />
    <div class="flex-col" id="notifyContainer" />
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
  z-index: 5;
  justify-content: center;
  pointer-events: none;
}
#notifyContainer {
  top: 0;
  right: 0;
  z-index: 100;
  position: absolute;
  margin: 5px;
}
</style>