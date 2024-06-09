<script setup lang="ts">
import {Effect, effectShort} from "../../../core/game-mechanics/effect.ts";

const {eff} = defineProps<{ eff: effectShort[] }>()
</script>

<template>
  <div v-for="es in eff" class="flex-avg">
    <div class="a">{{ Effect.parseTarget(es.target) }}</div>
    <div v-if="es.type !== undefined">{{ Effect.parseType(es.type) }}</div>
    <div>{{ Effect.parseFactor(es) }}</div>
  </div>
</template>

<style scoped>
div {
  text-align: left;
}
</style>