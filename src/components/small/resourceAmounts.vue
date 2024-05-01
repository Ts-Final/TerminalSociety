<script setup lang="ts">
import {Resources} from "../../core/GameDataBase/resource.ts"

function divs() {
  let v = []
  for (const res of Resources.all) {
    const {amount, maximum, change, changes} = res.refs
    v.push({
      amount,
      maximum,
      change,
      name: res.parsed,
      changes,
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
      ({{ res.changes.value.replace(`"`, '') }})
    </div>
  </div>
</template>

<style scoped>

</style>