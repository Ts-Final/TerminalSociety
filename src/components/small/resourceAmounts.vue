<script setup lang="ts">
import {computed} from "vue";
import {Resources} from "../../core/GameDataBase/resource.ts"
import {Numbers} from "../../core/functions/Numbers.ts";

/*const resAmount: Ref<{ [key in ResourceTypes]: number }> = ref({
  energy: 0,
  iron: 0,
  coal: 0,
  water: 0,
  copper: 0,
  air: 0,
})
const resChange: Ref<{ [key in ResourceTypes]: number }> = ref({
  energy: 0,
  iron: 0,
  coal: 0,
  water: 0,
  copper: 0,
  air: 0,
})

function update() {
  resAmount.value.energy = player.resource.energy.amount
  resAmount.value.iron = player.resource.iron.amount
  resAmount.value.air = player.resource.air.amount
  resAmount.value.copper = player.resource.copper.amount
  resAmount.value.water = player.resource.water.amount
  resAmount.value.coal = player.resource.coal.amount

  // these are ugly as a fuck, but i dont have a better way to write that
  resChange.value.energy = player.resource.energy.change
  resChange.value.iron = player.resource.iron.change
  resChange.value.air = player.resource.air.change
  resChange.value.copper = player.resource.copper.change
  resChange.value.water = player.resource.water.change
  resChange.value.coal = player.resource.coal.change

}

function divs() {
  let v = []
  for (const resKey in resAmount.value) {
    const key = resKey as ResourceTypes
    if (player.resource[resKey].amount >= player.resource[resKey].maximum) {
      // 满了
      v.push(parseResourceName(key) +
          ": " + resAmount.value[key] + "(Max)")
    } else {
      v.push(parseResourceName(key) + ": " +
          Numbers.formatInt(resAmount.value[key]) + "(" +
          Numbers.formatInt(resChange.value[key]) + "/s)")
    }
  }
  return v
}

gameLoop.displayHandlers[displayEnum.baseLayouts].push(update)*/
function divs() {
  let v = []
  for (const res of Resources.all) {
    const {amount, maximum, change} = res.useBase()
    v.push({
      amount,
      maximum,
      change,
      name: res.parsed,
      changes: computed(() =>
          amount.value < maximum.value ?
              Numbers.formatInt(change.value,false,0) + `/s` : `Max`)
    })
  }
  return v
}

const v = divs()
</script>

<template>
  <div class="flex-row flex-nowrap space-around"
       style="color: #b8dcee;margin-bottom: 5px;border-bottom: #7cdcf4 1px solid">
    <div v-for="res in v">
      {{ res.name }}:{{ res.amount }}
      ({{ res.changes.value.replace(`"`,'') }})
    </div>
  </div>
</template>

<style scoped>

</style>