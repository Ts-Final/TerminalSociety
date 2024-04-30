<script setup lang="ts">
import {UpgradeClass} from "../../../../core/GameDataBase/market/upgrade.ts";
import {parseResourceName} from "../../../../core/GameDataBase/resource.ts";
import {Country} from "../../../../core/GameDataBase/situation/country.ts";


const {upgrade} = defineProps<{ upgrade: UpgradeClass }>()
const {bought, unlocked, canBuy} = upgrade.refs


</script>

<template>
  <div class="gameUnit flex-col medium-size style-border" v-if="!bought&& unlocked">
    <div class="flex-row space-around">
      <div>{{ upgrade.name }}</div>
      <div class="op0.5" v-html="Country(upgrade.country).parsed"></div>
    </div>
    <div class="border1-top">
      {{ upgrade.des }}
    </div>
    <div class="self-center"
         :class="
         {
           'btn': canBuy,
          'btn-disabled':!canBuy,
           'text-disabled':!canBuy
         }"
         @click="upgrade.purchase()"
         :title="canBuy ? '': '东西不够...' ">购买
    </div>
    <div class="gameUnit-popout flex-col style-border">
      <div class="flex-col" v-if="upgrade.costResource.length > 0">
        <div>需求资源：</div>
        <div v-for="cost in upgrade.costResource">
          {{ parseResourceName(cost[0]) }}:{{ cost[1] }}
        </div>
      </div>
      <div class="flex-col center-text" v-if="upgrade.costMoney != 0">
        <div>需求资金：{{ upgrade.costMoney }}</div>
      </div>
    </div>
  </div>

</template>

<style scoped>
</style>