<script setup lang="ts">

import {computed} from "vue";

const props = defineProps<{ enabled?: boolean }>()
const enabled = props.enabled ?? true

const classObject = computed(() => {
  return {
    'o-primary-btn--disabled': enabled
  }
})
</script>

<template>
  <button
      class="o-primary-btn"
      :class="classObject"
  >
    <slot />
  </button>
</template>

<style scoped>
.o-primary-btn--disabled {
  background-color: #a3a3a3;
  border-color: var(--color-bad);
  cursor: default;
}

.o-primary-btn--disabled:hover {
  background-color: var(--color-bad);
}
.o-primary-btn {
  height: 1.5rem;
  width: 1.5rem;
  font-family: sans-serif;
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-text);
  background-color: black;
  border: 2px solid var(--color-accent);
  border-radius: var(--border-radius, 0.4rem);
  transition-duration: 0.2s;
  cursor: pointer;
  text-align: center;
}

.o-primary-btn:hover {
  color: black;
  background-color: var(--color-text);
}
</style>