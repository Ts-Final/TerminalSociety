<script setup lang="ts">

import Modal from "./Modal.vue";

const {seconds} = defineProps<{seconds: number}>()
</script>

<template>
  <Modal>
    <template v-slot:header>离线收益计算</template>
    <template v-slot:content>
      在你离开的时间里我们没干活。所以现在我们回来加急干（笑）
    </template>
  </Modal>

</template>

<style scoped>

</style>