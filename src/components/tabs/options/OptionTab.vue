<script setup lang="ts">
import {Tab} from "../../../core/GameDataBase/tabs.ts";
import OptionVisual from "./OptionVisual.vue";

const display = Tab.class.display
</script>

<template>

  <OptionVisual v-if="display[1] == 0"/>
</template>

<style scoped>

</style>