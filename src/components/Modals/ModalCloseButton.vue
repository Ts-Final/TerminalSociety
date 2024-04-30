<script setup lang="ts">

import PrimaryButton from "../small/PrimaryButton.vue";
</script>

<template>
  <PrimaryButton
      class="o-primary-btn--modal-close c-modal__close-btn"
  >
    &times;
  </PrimaryButton>
</template>

<style>
.o-primary-btn--modal-close {
  width: 1.5rem;
  height: 1.5rem;
  line-height: 1.2rem;
  padding: 0;
}

.c-modal__close-btn {
  position: absolute;
  top: 3px;
  right: 3px;
}
</style>