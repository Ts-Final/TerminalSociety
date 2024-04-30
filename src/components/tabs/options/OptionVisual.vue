<script setup lang="ts">


import OptionUnit from "./optionUnit.vue";
import Slider from "../../small/slider.vue";
import {Options} from "../../../core/game-mechanics/options.ts";
import WordHelper from "../../small/wordHelper.vue";
import {Modal} from "../../../core/utils/modal.ts";

const visual = Options.visual
const {news, updateRate, laugh} = visual.refs
</script>

<template>
  <div class="full flex flex-avg">
    <div class="option-wrapper flex-col">
      <div class="flex-row flex-avg self-center">
        <OptionUnit
            @click="visual.newsEnabled = !visual.newsEnabled" class="btn">
          趣闻栏: {{ news ? "开启" : "关闭" }}
        </OptionUnit>
        <OptionUnit class="flex-col" style="justify-content: space-around">
          <span class="flex-row">
            加载时间间隔: {{ updateRate }}ms
            <WordHelper text="这是游戏渲染的时间间隔，调整此设置可以在卡顿的时候修改以减少卡顿。">
            </WordHelper>
          </span>
          <Slider
              :initial="visual.updateRate"
              :fn="(v) => visual.updateRate = v"
              :show-value="true"
              :choices="[33,50,100,200,400,500,1000]"/>
        </OptionUnit>
        <OptionUnit @click="visual.laugh = !visual.laugh"
                    :class="laugh? 'rainbow-text' : 'style-border'">
          <span v-if="laugh" class="rainbow-text">神奇小功能：开启</span>
          <span v-else>神奇小功能：关闭</span>
        </OptionUnit>
        <OptionUnit @click="Modal.VersionModal.show()">
          版本更新记录
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