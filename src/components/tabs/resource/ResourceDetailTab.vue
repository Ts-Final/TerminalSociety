<script setup lang="ts">
import {Ref, ref} from "vue";
import {parseResourceName, Resource} from "../../../core/GameDataBase/resource.ts";
import {ResourceTypeList, ResourceTypes} from "../../../core/constants.ts";
import {Decimal} from "../../../core/utils/break_infinity.ts";

function changeChosen(key: ResourceTypes) {
  chosen.value = key
}

const chosen: Ref<ResourceTypes> = ref("energy")
</script>

<template>
  <div class="res-detail-wrapper">
    <div class="res-detail-top">
      <div class="res-detail-btn" v-for="resKey in ResourceTypeList"
           :key="resKey" @click="changeChosen(resKey)"
           :class="{chosen:Resource(chosen).name === resKey}"
           v-html="parseResourceName(resKey as ResourceTypes)">
      </div>
    </div>
    <div class="res-detail flex-avg">
      <div class="res-detail-list  left-border right-border">
        <div class="res-detail-first-row">生产加成</div>
        <div v-for="aff in Resource(chosen).refs.affects.pro.value.source" class="res-detail-row">
          <div v-html="aff[0]"></div>
          <div>+{{ Decimal.toPercent(aff[1]) }}</div>
        </div>
      </div>
      <div class="res-detail-list right-border">
        <div class="res-detail-first-row">消耗减少</div>
        <div v-for="aff in Resource(chosen).refs.affects.consume.value.source" class="res-detail-row">
          <div v-html="aff[0]"></div>
          <div>-{{ Decimal.toPercent(aff[1]) }}</div>
        </div>
      </div>
      <div class="res-detail-list right-border">
        <div class="res-detail-first-row">最大（加算）</div>
        <div v-for="aff in Resource(chosen).refs.affects.maxAdd.value.source" class="res-detail-row">
          <div v-html="aff[0]"></div>
          <div>+{{ Decimal.toResourceAmount(aff[1]) }}</div>
        </div>
      </div>
      <div class="res-detail-list right-border">
        <div class="res-detail-first-row">最大（乘算）</div>
        <div v-for="aff in Resource(chosen).refs.affects.maxMult.value.source" class="res-detail-row">
          <div v-html="aff[0]"></div>
          <div>+{{ Decimal.toPercent(aff[1]) }}</div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.res-detail-wrapper {
  width: 100%;
  top: 0;
  left: 0;
  margin: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.res-detail-top {
  top: 0;
  width: 90%;
  left: 0;
  display: flex;
  margin: 5%;
}

.res-detail-btn {
  border: 2px #7cdcf4 solid;
  text-align: center;
  color: #7cdcf4;
  flex-grow: 1;
}

.chosen {
  border-color: #c35ee7;
}

.res-detail {
  display: flex;
  flex-direction: row;
  width: 100%;
  color: #7cdcf4;
  height: 90%;

}

.left-border {
  border-left: 1px solid #7cdcf4;
}

.right-border {
  border-right: 1px solid #7cdcf4;
}

.res-detail-first-row {
  border: #7cdcf4 2px solid;
  text-align: center;
  width: 100%;
}

.res-detail-list {
  flex-direction: column;
  flex-grow: 1;
}

.res-detail-row {
  display: flex;
  flex-direction: row;
}

.res-detail-row > div {
  width: 50%;
  padding: 2px;
}

.res-detail-row > div:first-child {
  text-align: left;
}

.res-detail-row > div:not(:first-child) {
  text-align: right;
}
</style>