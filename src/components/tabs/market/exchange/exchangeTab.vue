<script setup lang="ts">

import ResourceAmounts from "../../../small/resourceAmounts.vue";
import ExchangeUnit from "./exchangeUnit.vue";
import {Money} from "../../../../core/GameDataBase/market/money.ts";
import {ExchangeHandler} from "../../../../core/GameDataBase/market/exchange.ts";

const onUpdate = ExchangeHandler.onUpdate

const {money} = Money.refs
const all = ExchangeHandler.allObjects()
</script>

<template>
  <div class="flex-col full" v-if="onUpdate">
    <ResourceAmounts class="full-w flex-row"/>
    <div class="full-w center-text" style="margin: 5px;color: #7cdcf4">你拥有{{ money }}的资金。</div>
    <div class="full-w flex-row flex-wrap" v-if="all.length > 0">
      <ExchangeUnit :exchange="obj" v-for="obj in all"/>
    </div>
    <div v-if="all.length == 0" class="self-center style-color center-text">
      今天有点可惜……没获得可用的交易。明天再来看看吧。<br>
      （其实如果这里没有东西极大程度上是个bug，请务必反馈一下你遇到了这种情况）
    </div>
  </div>

</template>

<style scoped>

</style>