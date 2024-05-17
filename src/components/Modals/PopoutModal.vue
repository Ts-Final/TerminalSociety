<script setup lang="ts">
import {Modal} from "../../core/./utils/modal.ts";
import {ref} from "vue";
import {EventHub} from "../../core/eventHub.ts";
import {different} from "../../core/./utils/different.ts";

const {modal} = defineProps<{ modal: Modal }>()
const positionStyle = ref({})
let lastUpdateWindowSize = {
  x: 0,
  y: 0,
}
const e = ref()

function updatePositionStyles() {
  if (!modal || !e.value) return;
  const w = e.value.offsetWidth, h = e.value.offsetHeight;
  positionStyle.value = {
    left: `${Math.round(innerWidth / 2 - w / 2)}px`,
    top: `${Math.round(innerHeight / 2 - h / 2)}px`,
    transform: "none",
  };
}

function hide() {
  if (!modal.isOpen) return;
  Modal.hide();
}

function update() {
  let v = {
    x: innerWidth,
    y: innerHeight,
  }
  if (different(v, lastUpdateWindowSize)) {
    updatePositionStyles()
  }
  lastUpdateWindowSize = v;
}

EventHub.on('closeModal', hide, Modal)
EventHub.on("update", update, Modal)
EventHub.on("update", updatePositionStyles, Modal)
</script>

<template>
  <div ref="e"
       class="modal" :style="positionStyle"
  >
    <component
        :is="modal.component"
        v-bind="modal.props"
        @close="hide"
    />
  </div>

</template>

<style scoped>
.modal {
  display: block;
  position: fixed;
  color: var(--color-text);
  max-height: 80vh;
  min-height: 60vh;
  max-width: 70vw;
  min-width: 60vw;
  pointer-events: auto;
  padding: 5px;
  z-index: var(--z-modal);

}
</style>