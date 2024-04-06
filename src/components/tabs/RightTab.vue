<script setup lang="ts">
import TaskTab from "./task/TaskTab.vue";
import ResourceTab from "./resource/ResourceTab.vue";

import {Tab} from "../../core/GameDataBase/tabs.ts";
import H2PTab from "./H2PTab.vue";
import ResearchTab from "./research/researchTab.vue";
import MarketTab from "./market/MarketTab.vue";
import EmployTab from "./employ/EmployTab.vue";
import OptionTab from "./options/OptionTab.vue";

const display = Tab.display

</script>

<template>
  <div class="right-tab">
    <ResourceTab v-if="display[0] == 0"/>

    <TaskTab v-else-if="display[0] == 1"/>
    <ResearchTab v-else-if="display[0] == 2"/>

    <MarketTab v-else-if="display[0] == 3"/>

    <EmployTab v-else-if="display[0] == 4"/>

    <H2PTab v-else-if="display[0] == 5"/>

    <OptionTab v-else-if="display[0] == 6"/>

  </div>

</template>

<style scoped>
.right-tab {
  left: var(--left-bar-width);
  position: relative;
  width: calc(100% - var(--left-bar-width));
  border-left: none;
  flex: 1 1
}

.right-tab > div {
  animation: a-right-tab-op linear 0.1s;
  animation-fill-mode: both;
}

@keyframes a-right-tab-op {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>