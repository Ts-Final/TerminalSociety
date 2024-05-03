<script setup lang="ts">
import {Resource} from "../../../core/GameDataBase/resource.ts";
import {ResourceTypeList} from "../../../core/constants.ts";
import {Decimal} from "../../../core/utils/break_infinity.ts";
import {Ref} from "vue";

function divs():{
  amount: Ref<Decimal>,
  maximum: Ref<Decimal>,
  change: Ref<Decimal>,
  max_record: Ref<Decimal>,
  name: string
}[] {
  let v = []
  for (const res of ResourceTypeList) {
    const {amount, maximum, change, max_record} = Resource(res).refs
    const name = Resource(res).parsed
    v.push({
      amount,
      max_record:max_record,
      maximum,
      change,
      name,
    })
  }
  return v
}

const v = divs()
</script>

<template>
  <div class="res-general-wrapper">
    <div class="RGT border-list">
      <div class="RGT-line style-border">
        <p>资源类型</p>
        <p>当前数量</p>
        <p>上限</p>
        <p>变化/s</p>
        <p>最大</p>
      </div>
      <div class="RGT-line style-border no-top-border" v-for="res in v">
        <p>{{ res.name }}</p>
        <p>{{ res.amount.value.toResourceAmount() }}</p>
        <p>{{ res.maximum.value.toResourceAmount() }}</p>
        <p>{{ res.change.value.toResourceAmount() }}</p>
        <p>{{ res.max_record.value.toResourceAmount() }}</p>
      </div>
    </div>
  </div>

</template>

<style scoped>
.RGT {
  display: flex;
  position: relative;
  flex-direction: column;
  width: 75%;
  margin: auto;
  color: #7cdcf4;
  top: -15%;
}

.RGT-line {
  display: inline-grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-flow: row;
  text-align: center;
}

.res-general-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
