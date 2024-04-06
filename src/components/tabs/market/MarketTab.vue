<script setup lang="ts">

import BasePriceTab from "./basePrice/basePriceTab.vue";
import CompanyTab from "./company/companyTab.vue";
import ExchangeTab from "./exchange/exchangeTab.vue";
import UpgradeTab from "./upgrade/upgradeTab.vue";
import {Tab} from "../../../core/GameDataBase/tabs.ts";

const display = Tab.class.display
</script>

<template>
  <BasePriceTab v-if="display[1] == 0"/>
  <ExchangeTab v-else-if="display[1] == 1"/>
  <CompanyTab v-else-if="display[1] == 2"/>
  <UpgradeTab v-else-if="display[1] == 3"/>
</template>

<style scoped>

</style>