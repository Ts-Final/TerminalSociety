<script setup lang="ts">
import {EventHub, GameEvent} from "../../core/eventHub.ts";
import ModalCloseButton from "./ModalCloseButton.vue";

function closeModal() {
  EventHub.dispatch(GameEvent.CLOSE_MODAL)
}

</script>

<template>
  <div class="modal-wrapper">
    <div class="modal-header" v-if="$slots.header">
      <ModalCloseButton @click="closeModal"/>
      <span class="modal-title">
        <slot name="header"/>
      </span>
    </div>

    <slot/>
  </div>
</template>

<style scoped>
.modal-header {
  margin-top: 5px;
  margin-bottom: 5px;
  width: 100%;
  text-align: center;
}

.modal-title {
  display: inline-block;
  align-self: center;
  text-align: center;
  width: 100%;
  font-size: 1.6rem;
  font-weight: bold;
  padding: 0;
}

.modal-wrapper {
  max-width: 60vw;
  max-height: 75vh;
  min-width: 40vw;
  min-height: 50vh;
  position: relative;
}
</style>