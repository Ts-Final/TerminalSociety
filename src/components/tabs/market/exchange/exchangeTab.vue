<script setup lang="ts">

import ResourceAmounts from "../../../small/resourceAmounts.vue";
import ExchangeUnit from "./exchangeUnit.vue";
import {Money} from "../../../../core/GameDataBase/market/money.ts";
import {ExchangeHandler} from "../../../../core/GameDataBase/market/exchange.ts";

const onUpdate = ExchangeHandler.onUpdate

const {money} = Money.refs

</script>

<template>
  <div class="flex-col full" v-if="onUpdate">
    <ResourceAmounts class="full-w flex-row"/>
    <div class="full-w center-text" style="margin: 5px;color: #7cdcf4">你拥有{{ money }}的资金。</div>
    <div class="full-w flex-row flex-wrap">
      <ExchangeUnit :exchange="obj" v-for="obj in ExchangeHandler.allObjects()"/>
    </div>
  </div>

</template>

<style scoped>

</style>