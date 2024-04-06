<script setup lang="ts">
import {Money} from "../../../../core/GameDataBase/market/money.ts";
import {Upgrades} from "../../../../core/GameDataBase/market/upgrade.ts";

import UpgradeUnit from "./upgradeUnit.vue";
import ResourceAmounts from "../../../small/resourceAmounts.vue";
const {money} = Money.refs
</script>

<template>
  <div class="full flex-col">
    <ResourceAmounts class="full-w flex-row"/>
    <div class="full-w center-text" style="margin: 5px;color: #7cdcf4">你拥有{{ money }}的资金。</div>
    <div class="full-w flex-row flex-wrap">
      <UpgradeUnit :upgrade="upgrade" v-for="upgrade in Upgrades.all"/>
    </div>
  </div>

</template>

<style scoped>

</style>