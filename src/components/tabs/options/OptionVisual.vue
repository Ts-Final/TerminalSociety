<script setup lang="ts">


import OptionUnit from "./optionUnit.vue";
import {player} from "../../../core/player";
import {ref} from "vue";
import {EventHub, GameEvent} from "../../../core/gameUpdate/eventHub.ts";
import Slider from "../../small/slider.vue";
import {Options} from "../../../core/game-mechanics/options.ts";
import WordHelper from "../../small/wordHelper.vue";

const news = ref(true)

function update() {
  news.value = player.options.news
}

EventHub.on(GameEvent.OPTION_CHANGE, update)

const updateRate = ref(Options.updateRate)
const newsEnabled = ref(Options.newsEnabled);
const laugh = ref(Options.laugh)

</script>

<template>
  <div class="full flex flex-avg">
    <div class="option-wrapper flex-col">
      <div class="flex-row flex-avg self-center">
        <OptionUnit
            @click="Options.newsEnabled = !newsEnabled;
              newsEnabled = Options.newsEnabled" class="btn">
          趣闻栏: {{ newsEnabled ? "开启" : "关闭" }}
        </OptionUnit>
        <OptionUnit class="flex-col" style="justify-content: space-around">
          <span class="flex-row">
            加载时间间隔: {{ updateRate }}ms
            <WordHelper text="这是游戏渲染的时间间隔，调整此设置可以在卡顿的时候修改以减少卡顿。">
            </WordHelper>
          </span>
          <Slider
              :initial="Options.updateRate"
              :fn="(v) => {Options.updateRate = v; updateRate = v}"
              :show-value="true"
              :choices="[33,50,100,200,400,500,1000]"/>
        </OptionUnit>
        <OptionUnit @click="Options.laugh = !Options.laugh;laugh = !laugh"
                    :class="laugh? 'rainbow-text' : 'style-border'">
          <span v-if="laugh" class="rainbow-text">神奇小功能：开启</span>
          <span v-else>神奇小功能：关闭</span>
        </OptionUnit>
      </div>
    </div>
  </div>
</template>

<style scoped>
.option-wrapper {
  width: 75%;
  align-self: center;
  position: relative;
  top: -15%;
  flex-direction: column;
  display: flex;
}
</style>