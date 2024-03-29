<script setup lang="ts">
import {ResourceTypes} from "../../../../core/GameDataBase/resource.ts";
import {parseResourceName} from "../../../../core/game-mechanics/parse.ts";
import {ref} from "vue";
import {player} from "../../../../core/player";

import {displayEnum} from "../../../../core/GameDataBase/display.ts";
import {gameLoop} from "../../../../core/gameUpdate/gameLoop.ts";

const {resKey} = defineProps<{ resKey: ResourceTypes }>()

const displayName = parseResourceName(resKey)

const basePrice = ref(0)

function update() {
  basePrice.value = player.market.basePrice[resKey]
}
gameLoop.displayHandlers[displayEnum.marketPrice].push(update)
</script>

<template>
  <div class="flex-row bpt-line border1-top">
    <p>{{ displayName }}</p>
    <p>{{ basePrice }}</p>
  </div>

</template>

<style scoped>

</style>