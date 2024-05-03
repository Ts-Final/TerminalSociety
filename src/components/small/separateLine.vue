<script lang="ts" setup>

const {} = defineProps<{ width: number }>()
</script>

<template>
  <div class="bpt-line"></div>
</template>

<style scoped>
.bpt-line {
  width: 100%;
  min-width: 100%;
  max-height: v-bind(width) px;
  color: #888888;

}

</style>
