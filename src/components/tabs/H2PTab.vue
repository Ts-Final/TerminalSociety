<script setup lang="ts">

import {GameDataBase} from "../../core/GameDataBase";
import {ref} from "vue";
import {player} from "../../core/player";

import {gameUpdateDisplays} from "../../core/gameUpdate/updateDisplay.ts";
import {displayEnum} from "../../core/GameDataBase/display.ts";
import {EventHub, GameEvent} from "../../core/gameUpdate/eventHub.ts";

const h2p = ref(1)
const h2pInfo = ref("")
const h2pTitle = ref("")
const onUpdate = ref(true)

function update() {
  h2p.value = player.how2play
  let h2pData = GameDataBase.How2Play.find(value => value.id === player.how2play)
  if (!h2pData) {
    return
  }
  h2pInfo.value = h2pData.info
  h2pTitle.value = h2pData.title
}

gameUpdateDisplays[displayEnum.h2p].push(update)

EventHub.addHandler(GameEvent.UPDATE_H2P, function () {
  onUpdate.value = false
  onUpdate.value = true
})
</script>

<template>
  <div class="h2p-wrapper" v-if="onUpdate">
    <div id="h2p-list">
      <div class="h2p-help-text">
        欢迎使用指引模块。<br>
        您可以在这里查阅一些和游戏机制有关的东西
        （比如部分教学内容，如果没有找到就是作者忘记写了（请务必通过各种渠道提醒作者）<br>
        左侧的文字可以按。
      </div>
      <div class="h2p-button" :class="{'none-display':!h2p.unlocked}"
           v-for="h2p in GameDataBase.How2Play.sort((v1,v2)=>v1.id-v2.id)"
           @click="player.how2play = h2p.id" :key="h2p.id">
        {{ h2p.title }}
      </div>
    </div>
    <div id="h2pContent">
      <div class="h2p-title">{{ h2pTitle }}</div>
      <div class="h2p-info" v-html="h2pInfo"></div>
    </div>
  </div>
</template>

<style scoped>
.h2p-wrapper {
  width: 100%;
  padding: 2px;
  margin: 0;
  height: 100%;
  display: flex;
  flex-direction: row;
  color: #7cdcf4;
  border-left: 1px solid #7cdcf4;
}

.h2p-help-text {
  width: calc(100% - 10px);
  padding: 5px;
  font-size: 0.9rem;
  text-align: left
}

/* h2p-button */
.h2p-button {
  text-align: center;
  cursor: pointer;
  height: 2rem;
  justify-content: center;
  display: flex;
  align-items: center;
}
.h2p-button:hover {
  box-shadow: #7cdcf4 0 0 0.3rem inset;
}

/* h2p-layout */
#h2p-list {
  display: flex;
  width: 15%;
  max-width: 180px;
  height: 100%;
  flex-direction: column;
  word-break: normal;

}

#h2pContent {
  width: 85%;
  height: 100%;
  border-left: 2px #7cdcf4 solid;
}

.h2p-title {
  top: 0;
  left: 0;
  width: 100%;
  padding-top: 15px;
  padding-bottom: 15px;
  text-align: center;
  font-size: 1.25rem;
}

.h2p-info {
  word-break: normal;
  text-align: left;
  padding-left: 5px;
}
</style>