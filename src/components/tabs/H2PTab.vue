<script setup lang="ts">
import {How2Play, How2PlayClass} from "../../core/GameDataBase/how2play.ts";
import {Modal} from "../../core/utils/modal.ts";


const {title, info, all} = How2PlayClass.refs
</script>

<template>
  <div class="h2p-wrapper style-border-color style-color">
    <div id="h2p-list">
      <div class="h2p-help-text">
        欢迎使用指引模块。<br>
        您可以在这里查阅一些和游戏机制有关的东西
        （比如部分教学内容，如果没有找到就是作者忘记写了（请务必通过各种渠道提醒作者）<br>
        左侧的文字可以按。
        <div class="h2p-modal-btn"
             @click="Modal.BasicPlayModal.show({})">基础玩法介绍</div>
      </div>
      <div class="h2p-button"
           @click="How2Play(h2p).show()" v-for="h2p in all"
           :key="How2Play(h2p).id">
        {{ How2Play(h2p).name }}
      </div>
    </div>
    <div id="h2pContent">
      <div class="h2p-title" v-html="title"></div>
      <div class="h2p-info" v-html="info"></div>
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
  border-left: 1px solid ;
}

.h2p-help-text {
  width: calc(100% - 10px);
  padding: 5px;
  font-size: 0.9rem;
  text-align: left
}
.h2p-modal-btn {
  width: 100%;
  border: 2px solid;
  cursor: pointer;
  text-align: center;
  padding-top: 3px;
  padding-bottom: 3px;
}

/* h2p-button */
.h2p-button {
  text-align: center;
  cursor: pointer;
  height: 2rem;
  justify-content: center;
  align-items: center;
}

.h2p-button:hover {
  box-shadow: var(--border-color) 0 0 0.3rem inset;
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
  border-left: 2px var(--border-color) solid;
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