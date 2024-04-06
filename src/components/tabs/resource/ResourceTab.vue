<script setup lang="ts">

import ResourceGeneralTab from "./ResourceGeneralTab.vue";
import ResourceDetailTab from "./ResourceDetailTab.vue";
import {Tab} from "../../../core/GameDataBase/tabs.ts";

const display = Tab.class.display
</script>

<template>
  <ResourceGeneralTab v-if="display[1] == 0"/>
  <ResourceDetailTab v-else-if="display[1] == 1"/>
</template>

<style scoped>

</style>