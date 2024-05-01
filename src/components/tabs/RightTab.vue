<script setup lang="ts">
import {ui} from "../../core/game-mechanics/ui.ts";
</script>

<template>
  <div class="right-tab">
    <component
        :is="ui.tabs.current"
        v-if="ui.tabs.refs.current.value"
    />
  </div>

</template>

<style scoped>
.right-tab {
  left: var(--left-bar-width);
  position: relative;
  width: calc(100% - var(--left-bar-width));
  border-left: none;
  flex: 1 1;
  max-height: calc(100vh - 1.5rem);
}

.right-tab > div {
  animation: a-right-tab-op linear 0.1s;
  animation-fill-mode: both;
}
</style>