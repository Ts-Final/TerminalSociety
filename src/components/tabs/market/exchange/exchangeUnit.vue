<script setup lang="ts">
import {Company} from "../../../../core/GameDataBase/market/company.ts";
import {Resource} from "../../../../core/GameDataBase/resource.ts";
import {player} from "../../../../core/player.ts";
import {ref} from "vue";
import {Money} from "../../../../core/GameDataBase/market/money.ts";
import {Decimal} from "../../../../core/utils/break_infinity.ts";


const {index} = defineProps<{ index: number }>()
const bought = ref(0)
const toBuy = ref(0)

const e = {
  company: player.market.exchange[index].company,
  resource: player.market.exchange[index].resource,
  price: new Decimal(player.market.exchange[index].price),
  stock: player.market.exchange[index].stock,
  get bought() {
    return player.market.exchange[index].bought
  },
  set bought(value: number) {
    player.market.exchange[index].bought = value
    bought.value = value
  },
  get left() {
    return this.stock - this.bought
  }
}

function canBuy(to: any): boolean {
  if (typeof to !== "number") return false
  if (to > e.left) return false
  return Money.amount.gte(e.price.mul(to))
}

function canSell(to: any) {
  if (typeof to !== "number") return false
  return Resource(e.resource).amount.gte(to)
}

function buy(to: any) {
  if (typeof to !== "number") return
  if (!canBuy(to)) return
  Resource(e.resource).directProduce(to)
  Money.spend(e.price.mul(to))
}

function sell(to: any) {
  if (typeof to !== "number") return false
  if (!canBuy(to)) return
  Resource(e.resource).directCost(to)
  Money.earn(e.price.mul(to))
}
</script>

<template>
  <div class="exchange-unit style-border">
    <div class="exchange-name">
      <span style="font-size: 3rem" v-html="Resource(e.resource).parsed.charAt(0)"/>
    </div>
    <div class="exchange-data">
      <div>售方：{{ Company(e.company).name }}</div>
      <div>剩余数量：{{ e.stock - bought }}</div>
      <div>单价：{{ e.price.toResourceAmount() }}</div>
    </div>
    <input class="exchange-toBuy" v-model="toBuy" placeholder="购买数量">
    <div class="exchange-buttons" style="flex-grow: 1">
      <div :class="canBuy(toBuy) ? 'btn':'btn-disabled'"
           @click="buy(toBuy)">购买
      </div>
      <div :class="canSell(toBuy) ? 'btn':'btn-disabled'" class="border1-top"
           @click="sell(toBuy)">卖出
      </div>
    </div>
  </div>

</template>

<style scoped>
.exchange-unit {
  display: grid;
  padding-left: var(--exchange-padding-left);
  grid-template-columns: 1fr 2fr 100px 2fr;
  color: #b8dcee;
}
.exchange-toBuy {
  background-color: #00000000;
  color: #b8dcee;
  font-size: 1rem;

  text-align: center;
  border: none;
}

.exchange-data {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.exchange-buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  align-items: center;
}

.exchange-buttons > div {
  width: min(50%, 200px);
  text-align: center;
}
</style>