<script setup lang="ts">
import {Resource} from "../../core/GameDataBase/resource.ts"
import {Ref} from "vue";
import {Decimal} from "../../core/utils/break_infinity.ts";

function divs() {
  let v:{
    amount:Ref<Decimal>,
    maximum: Ref<Decimal>,
    change: Ref<Decimal>,
    name: string
  }[] = []
  for (const res of Resource.all) {
    const {amount, maximum, change} = res.refs
    v.push({
      amount,
      maximum,
      change,
      name: res.parsed,
    })
  }
  return v
}

const v = divs()
</script>

<template>
  <div class="flex-row flex-nowrap space-around border1-bottom style-border-color"
       style="color: #b8dcee;margin-bottom: 5px">
    <div v-for="res in v">
      {{ res.name }}:{{ res.amount.value.toResourceAmount() }}
      ({{ res.change.value.toSecondChange(res.maximum.value)  }})
    </div>
  </div>
</template>

<style scoped>

</style>