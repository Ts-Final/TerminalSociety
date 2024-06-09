<script setup lang="ts">
import {closeModal, props} from "../../core/utils/modal.ts";
import ModalBase from "./ModalBase.vue";

const p = defineProps<props.content>()

const call = function () {
  closeModal()
  if (p.callback) p.callback()
}
</script>

<template>
  <ModalBase class="normal-content-modal">
    <div class="center-text" v-html="p.content"></div>
    <div class="confirm" @click="call">确认</div>
  </ModalBase>
</template>

<style scoped>
.normal-content-modal {
  padding-top: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 40vw;
}
.confirm {
  cursor: pointer;
  max-width: 150px;
  min-width: 100px;
  background-color:var(--color-good);
  color: var(--light-text-color);
  bottom: 3rem;
  text-align: center;
  position: absolute;
  font-weight: bold;
}
</style>