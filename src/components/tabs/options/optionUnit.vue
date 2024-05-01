<script setup lang="ts">

</script>

<template>
  <div class="option-unit style-border style-color self-center">
    <slot></slot>
  </div>
</template>

<style scoped>
.option-unit {
  width: 250px;
  height: 100px;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
}
</style>
