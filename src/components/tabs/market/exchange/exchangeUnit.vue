<script setup lang="ts">
import {Company} from "../../../../core/GameDataBase/market/company.ts";
import {Resource} from "../../../../core/GameDataBase/resource.ts";
import {ExchangeObject} from "../../../../core/GameDataBase/market/exchange.ts";


const {exchange} = defineProps<{ exchange: ExchangeObject }>()
const {bought} = exchange.refs
const toBuy = exchange.toBuy
</script>

<template>
  <div class="gameUnit medium-size flex-col style-border">
    <div class="flex-row space-around">
      <div>{{ Company(exchange.company).name }}</div>
      <div>{{ Resource(exchange.resource).parsed }}</div>
    </div>
    <div class="flex-col border1-top">
      <div class="center-text">剩余数量：{{ exchange.amount - bought }}</div>
      <div class="center-text">单价：{{ exchange.price }}</div>
    </div>
    <div class="flex-row">
      <input class="style-border center-text" v-model="toBuy" placeholder="购买数量">
      <div class="flex-col center-text" style="flex-grow: 1">
        <div :class="exchange.canBuy(toBuy) ? 'btn':'btn-disabled'"
             @click="exchange.buy(toBuy)">购买
        </div>
        <div :class="exchange.canSell(toBuy) ? 'btn':'btn-disabled'" class="border1-top"
             @click="exchange.sell(toBuy)">卖出
        </div>
      </div>
    </div>

  </div>

</template>

<style scoped>
input {
  background-color: #00000000;
  color: #b8dcee;
  font-size: 1rem;
  max-width: 50%;
}
</style>