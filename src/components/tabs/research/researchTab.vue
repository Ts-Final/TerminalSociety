<script setup lang="ts">

import ResearchUnit from "./researchUnit.vue";
import ResourceAmounts from "../../small/resourceAmounts.vue";
import {Research} from "../../../core/GameDataBase/research.ts";
</script>

<template>
  <ResourceAmounts class="full-w"/>
  <div class="full-w flex-wrap flex-row">
    <ResearchUnit v-for="rch in Research.all" :research="rch"/>
  </div>
</template>

<style scoped>
</style>