<script setup lang="ts">
import ModalCloseButton from "./ModalCloseButton.vue";

import {closeModal} from "../../core/utils/modal.ts";
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


.modal-wrapper {
  max-width: 60vw;
  max-height: 75vh;
  min-width: 20vw;
  min-height: 30vh;
  position: relative;
  border: 2px solid #7cdcf4;
  padding: 4px;
  background-image: var(--bgi);
}
</style>
<style>

.modal-title {
  display: inline-block;
  align-self: center;
  text-align: center;
  width: 100%;
  font-size: 1.6rem;
  font-weight: bold;
  padding: 0;
}
</style>
