<script setup lang="ts">

import {onMounted, onUnmounted} from "vue";
import {GameStats} from "../../core/game-mechanics/gameStats.ts";

onMounted(() => GameStats.onModal = true)
onUnmounted(() => GameStats.onModal = false)
</script>

<template>
  <div class="modal flex-col">
    <slot name="header" class="modal-header">

    </slot>
    <slot name="content" class="modal-content">

    </slot>
  </div>
</template>

<style scoped>
.modal {
  z-index: var(--z-modal);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  max-width: 40%;
}
.modal-header {
  align-self: center;
  text-align: center;
}
.modal-content {
  padding-left: 5px;
  padding-right: 5px;
}
</style>