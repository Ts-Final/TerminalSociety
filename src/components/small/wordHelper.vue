<script setup lang="ts">

const {text} = defineProps<{ text: string }>()
</script>

<template>
  <div class="word-help-wrapper">
    (?)
    <div class="word-help-popout" v-html="text" />
  </div>
</template>

<style scoped>

.word-help-wrapper {
  width: 1rem;
  height: 1rem;

  background-color: #191919;
  font-size: 0.75rem;
  cursor: pointer;
  position: relative;
}

.word-help-popout {
  opacity: 0;
  position: absolute;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out;
  max-width: 15rem;
  min-width: 10rem;
  font-size: 0.9rem;
  background-image: var(--bgi);
  left: 50%;
  transform: translate(1rem, -50%);
  border: 2px solid #7cdcf4;
  border-radius: 8px;
  top: 100%;
  padding: 5px;
}
.word-help-popout ::before {
  border-left: 1rem;

}

.word-help-wrapper:hover .word-help-popout {
  opacity: 1;
}
</style>