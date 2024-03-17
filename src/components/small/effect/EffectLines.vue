<script setup lang="ts">
import {effect, Effect} from "../../../core/game-mechanics/effect.ts";

const {eff} = defineProps<{eff:effect}>()
</script>

<template>
  <div v-for="es in Effect.parseEffect(eff)" class="flex-avg">
    <div class="a">{{ es.target }}</div>
    <div v-if="es.type !== undefined">{{ Effect.parseType(es.type) }}</div>
    <div>{{ es.factor }}</div>
  </div>
</template>

<style scoped>
div {
  text-align: left;
}
</style>