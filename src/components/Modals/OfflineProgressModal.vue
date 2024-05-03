<script setup lang="ts">
import {props} from "../../core/utils/modal.ts";
import ModalBase from "./ModalBase.vue";

const change = defineProps<props.offlineChange>()
</script>

<template>
  <ModalBase>
    <template v-slot:header>
      离线进度
    </template>
    <div class="flex-col full-w align-center">
      <div>欢迎回来！这段时间大概有人在干活，虽然可能不多，以下是你不在的时间发生的东西：</div>
      <template v-if="change.resource">
        <br>
        <br>
        <div class="size-1.25rem">资源生产</div>
        <div class="full-w flex-row flex-wrap justify-center">
          <div v-for="res in change.resource" style="width: 33%" class="center-text">
            {{ res[0] }}: {{ res[1].toFullChange() }}
          </div>
        </div>
      </template>
      <template v-if="change.research">
        <div>研究进度</div>
        <div class="flex-row flex-wrap full-w">
          <div v-for="rch in change.research">
            {{ rch[0] }}: {{ typeof rch[1] == "boolean" ? "完成" : rch[1]  }}
          </div>
        </div>
      </template>
    </div>
  </ModalBase>

</template>

<style scoped>

</style>