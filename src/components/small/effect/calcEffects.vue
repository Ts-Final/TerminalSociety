<script setup lang="ts">

import {Effect} from "../../../core/game-mechanics/effect.ts";
import {Numbers} from "../../../core/./utils/Numbers.ts";

const {effects} = defineProps<{ effects: { [p: string]: number } }>()

let research = 0
let resource = {} as { [p: string]: { [x: string]: number } }

(function () {
  for (const [key, value] of Object.entries(effects)) {
    if (key.includes(',')) {
      let resKey = key.split(',')[0]
      let type = key.split(',')[1]
      if (resKey in resource) {
        if (type in resource[resKey]) {
          resource[resKey][type] = Numbers.round(value + resource[resKey][type])
        } else {
          resource[resKey][type] = value
        }
      } else {
        resource[resKey] = {}
        resource[resKey][type] = value
      }
    } else if (key == 'research') {
      research = Numbers.round(research + value)
    }
  }
})()
</script>

<template>
  <div class="flex-col calc-effects center-text">
    <div v-for="key in Object.keys(resource)" class="flex-row flex-avg">
      <div v-html="Effect.parseTarget(key)"/>
      <div class="flex-col">
        <div v-for="type in Object.keys(resource[key])" class="flex-row">
          <div>{{ Effect.parseType(type) }}</div>
          <div> {{ Numbers.formatInt(resource[key][type], ['maxMult', 'pro'].includes(type)) }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="research > 0" class="flex-avg flex-row space-around center-text">
      <div>研究</div>
      <div>+{{ Numbers.formatInt(research, true) }}</div>
    </div>

  </div>

</template>

<style scoped>
.calc-effects {
  color: #7cdcf4;
}
</style>