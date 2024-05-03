<script setup lang="ts">

import ModalBase from "./ModalBase.vue";
import {props} from "../../core/utils/modal.ts";
import {computed, watchEffect} from "vue";
import {EventHub, GameEvent} from "../../core/eventHub.ts";

const {max_ticks, tickR, finished, time} = defineProps<props.offline>()

watchEffect(() => {
  if (finished.value) EventHub.ui.dispatch(GameEvent.CLOSE_MODAL)
})

const passed = (function (x: number) {
  const days = Math.floor(x / (1000 * 60 * 60 * 24));
  const hours = Math.floor((x % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((x % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((x % (1000 * 60)) / 1000);
  return `经过了：${days}天 ${hours}小时${minutes}分${seconds}秒`;
})(time)

const percent = computed(() => {
  return (tickR.value / max_ticks) * 100 + "%"
})
</script>

<template>
  <ModalBase :show-close="false">
    <template v-slot:header>离线收益计算</template>
    <div class="flex-col space-around align-center" style="min-height: 50vh">
      <div>
        在你离开的时间里我们没干活。所以现在我们回来加急干（笑）
        <br>
        {{ passed }}，所以别急，先喝口水休息吧。<br>
        <span v-if="time >= 30 * 24 * 60 * 60 * 1000">
        确实很久。所以你是否还记得那一缕风从耳边吹过——你还记得那是否是风吗？
      </span>
      </div>
      <div>
        进度：{{ tickR }}/{{ max_ticks }}
      </div>
      <div>
        剩余时长：我也不知道
      </div>
      <div class="progress-wrapper">
        <div class="progress"/>
      </div>
    </div>

  </ModalBase>
</template>

<style scoped>
.progress-wrapper {
  width: 80%;
  align-self: center;
  height: 8px;
  margin-top: 8px;
  padding: 2px;

}

.progress {
  height: 100%;
  background: #7cdcf4;
  width: v-bind(percent);
}
</style>