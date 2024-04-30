<script setup lang="ts">

import Modal from "./ModalBase.vue";
import {Numbers} from "../../core/./utils/Numbers.ts";

const {seconds} = defineProps<{seconds: number}>()
</script>

<template>
  <Modal>
    <template v-slot:header>离线收益计算</template>
    <template>
      在你离开的时间里我们没干活。所以现在我们回来加急干（笑）<br>
      总共过去了{{Numbers.formatInt(seconds)}}秒，所以别急，先喝口水休息吧。
    </template>
  </Modal>

</template>

<style scoped>

</style>