<script setup lang="ts">

import ModalBase from "./ModalBase.vue";
import {ref} from "vue";
import {EventHub} from "../../core/eventHub.ts";
import {player} from "../../core/player.ts";
import {ui} from "../../core/game-mechanics/ui.ts";
import {GameStorage} from "../../core/game-mechanics/GameStorage.ts";

const name = ref(player.customName)
const fading = ref(false)

function submit() {
  fading.value = true
  player.customName = name.value == "" ? "芸" : name.value
  setTimeout(() => {
    EventHub.dispatch('closeModal')
    ui.curtain.hide()
  }, 5e3)
  GameStorage.save(false)
}

ui.curtain.show({})

</script>

<template>
  <ModalBase class="your-name-modal" :class="{fading:fading}">
    <div>
      你回来了。
      <br>
      还记得你是谁吗？
    </div>
    <div>请注意：确定后本次游戏无法修改！</div>
    <input class="name-input center-text" v-if="!fading"
           placeholder="想想吧。你是否记得呢？" v-model="name" @keydown.enter="submit">
    <input class="name-input center-text" v-model="name" v-if="fading"
           style="user-select: none;cursor:none;pointer-events: none">

    <div class="self-center size-0.8rem" v-if="name == '' && !fading">留空则会使用默认：“芸”。</div>
    <div class="self-center size-0.8rem" v-if="name == '芸'">你很喜欢这个名字？随你便吧。</div>
    <div class="self-center size-0.8rem" v-if="fading && name == ''"
         style="color: #f00">回忆我的故事……见证我的消逝。欢迎你。
    </div>
    <div class="name-submit" @click="submit">确认</div>
  </ModalBase>
</template>

<style scoped>
.your-name-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  text-align: center;
}

.name-input {
  color: #7cdcf4;
  width: 80%;
  background-color: transparent;
  border-width: 0;
  border-bottom: 1px solid #7cdcf4;
}

.name-submit {
  cursor: pointer;
  width: 50%;
  align-self: center;
  height: 2rem;
  border: 2px solid #7cdcf4;
}

.fading {
  animation: a-op-up 5s linear reverse;
  animation-fill-mode: both;
}
</style>