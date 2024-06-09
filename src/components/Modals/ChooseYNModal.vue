<script setup lang="ts">

import ModalBase from "./ModalBase.vue";
import {closeModal, props} from "../../core/utils/modal.ts";
const p = defineProps<props.chooseYN>()
const Y = function () {
  closeModal()
  p.fulfill()
}
const N = function () {
  closeModal()
  p.reject()
}
</script>

<template>
  <ModalBase class="YN-modal">
    <div class="modal-header" v-if="p.title" v-html="p.title"></div>
    <div v-html="p.content"></div>
    <div class="YN-buttons" style="color: var(--light-text-color)">
      <div class="choose-Y" v-html="p.onY ?? '确认'" @click="Y()"/>
      <div class="choose-N" v-html="p.onN ?? '拒绝'" v-if="p.bad != 1" @click="N()"/>
      <div class="choose-N-bad" v-html="p.onN ?? '拒绝'" v-if="p.bad == 1" @click="N()"/>
    </div>
  </ModalBase>
</template>

<style scoped>
.YN-modal {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.choose-Y {
  cursor: pointer;
  background-color: var(--color-good);
  border: 2px solid transparent;
}
.choose-N {
  cursor: pointer;
  background-image: var(--bgi);
  border: 2px solid var(--light-text-color);

}
.choose-N-bad {
  cursor: pointer;
  background-color: var(--color-bad);
  border: 2px solid #f00;
  color: #b8dcee;
}
.YN-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;

}
.YN-buttons > div {
  max-width: 8rem;
  min-width: 5rem;
  text-align: center;
}

</style>