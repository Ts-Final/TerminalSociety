<script setup lang="ts">

import ResourceAmounts from "../../../small/resourceAmounts.vue";
import ExchangeUnit from "./exchangeUnit.vue";
import {Money} from "../../../../core/GameDataBase/market/money.ts";
import {ExchangeHandler} from "../../../../core/GameDataBase/market/exchange.ts";

const {money} = Money.refs
const max = ExchangeHandler.ref
</script>

<template>
  <div class="flex-col full">
    <ResourceAmounts class="full-w flex-row"/>
    <div class="full-w center-text" style="margin: 5px;color: #7cdcf4">你拥有{{ money }}的资金。</div>
    <div class="exchanges-contain" v-if="max > 0">
      <ExchangeUnit :index="num" v-for="num in ExchangeHandler.range(max)"/>
    </div>
    <div v-if="max == 0" class="self-center style-color center-text">
      今天有点可惜……没获得可用的交易。明天再来看看吧。<br>
      （其实如果这里没有东西极大程度上是个bug，请务必反馈一下你遇到了这种情况）
    </div>
  </div>

</template>

<style scoped>
.exchanges-contain {
  max-width: 90%;
  left: 2%;
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
  --exchange-padding-left: 1rem
}

.exchanges-contain > div {
  width: calc(100% - 2px - var(--exchange-padding-left));
}
</style>