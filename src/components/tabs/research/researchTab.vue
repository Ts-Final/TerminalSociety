<script setup lang="ts">

import ResearchUnit from "./researchUnit.vue";
import ResourceAmounts from "../../small/resourceAmounts.vue";
import {Research} from "../../../core/GameDataBase/research.ts";
</script>

<template>
  <ResourceAmounts class="full-w"/>
  <div class="gameUnit-contain">
    <ResearchUnit :research="Research(0)" style="display: flex"/>
    <ResearchUnit v-for="rch in Research.all" :research="rch"/>
  </div>
</template>

<style scoped>
</style>