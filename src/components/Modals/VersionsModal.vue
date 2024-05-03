<script setup lang="ts">

import ModalBase from "./ModalBase.vue";
import {Versions} from "../../core/GameDataBase/versions.ts";

const reversed = Versions.sort((a, b) => b.id - a.id)
</script>

<template style="font-family: sans-serif">
  <ModalBase class="credits-modal" :show-close="true">
    <template v-slot:header>
      版本更新记录
    </template>

    <div class="overflow-y-scroll credits-modal-body">
      <div >
        <div v-for="version in reversed" style="text-align: center">
          <p class="self-center size-1.25rem" v-html="version.name" />
          <p class="self-center">{{ new Date(version.date).toDateString() }}</p>
          <div class="full-w flex-col" style="text-align: left">
            <div v-for="slice in version.description" v-html="slice"></div>
          </div>
          <br>
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<style scoped>
.credits-modal {
  min-width: 50vw;
  min-height: 70vh;
}
.credits-modal-body {
  max-height: calc(70vh - 2rem - 10px);
}
</style>