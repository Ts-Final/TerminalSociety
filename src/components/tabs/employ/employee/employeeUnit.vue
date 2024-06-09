<script setup lang="ts">

import {EmployeeWorkClass} from "../../../../core/GameDataBase/employee/work.ts";
import EffectLines from "../../../small/effect/EffectLines.vue";
import {Decimal} from "../../../../core/utils/break_infinity.ts";

const {employee} = defineProps<{ employee: EmployeeWorkClass }>()
const isClicked = [false]
function onClick() {
  if (isClicked[0]) {
    employee.check()
  } else {
    isClicked[0] = true
    setTimeout(() => isClicked[0] = false, 250)
  }
}
function onDragStart(e: DragEvent) {
  if (e.dataTransfer) {
    e.dataTransfer.setData('employ/employWork', employee.id.toString())
    e.dataTransfer.dropEffect = "copy"
  }
}

const {exp, level, unlocked, req} = employee.refs
</script>

<template>
  <div class="employee-unit" draggable="true"
       @click="onClick"
       :class="'rarity-' + employee.rarity"
       @dragstart="onDragStart">
    <div class="employee-advantages">
      <span v-for="i in employee.advantages" v-html="i"></span>
    </div>
    <div class="employee-exp">
      <span style="font-size: 1.5rem">{{level}}</span>
      <span style="font-size: 0.75rem">{{Decimal.div(exp, req).toPercent()}}</span>
    </div>
    <div class="employee-name">
      <span class="op0.7" style="font-size: 0.7rem" v-html="employee.name2"/>
      <span v-html="employee.name" />
    </div>
  </div>
</template>

<style scoped>
.employee-name {
  position: absolute;
  right: 5%;
  bottom: 5%;
  display: flex;
  flex-direction: column;
  text-align: right;
}
.employee-unit {
  height: 40vh;
  width: 22.8vh;
  margin-right: 50px;
  position: relative;
  border: 2px solid;

  background-image: url("/400-700.webp");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-color: transparent;
}
.employee-advantages {
  width: 90%;
  left: 5%;
  top: 5px;
  position: absolute;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2px;
}

.employee-exp {
  position: absolute;
  display: flex;
  justify-items: center;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  left: 5%;
  bottom: 5px;
}

@keyframes a-employ-level-up {
  0% {
    color: #7cdcf4;
  }
  50% {
    color: #ffffff;
  }
  100% {
    color: #7cdcf4;
  }
}

.rarity-1 {
  border-color: #16cc3a;;
}

.rarity-2 {
  border-color: #7cdcf4;
}

.rarity-3 {
  border-color: #370ecb;
}

.rarity-4 {
  border-color: #f6f104;
}

.rarity-5 {
  animation: a-rarity-5 4s infinite linear;
}

@keyframes a-rarity-5 {
  0% {
    border-color: #16cc3a;
  }
  25% {
    border-color: #7cdcf4;
  }
  50% {
    border-color: #370ecb;
  }
  75% {
    border-color: #f6f104;
  }
  100% {
    border-color: #16cc3a;
  }
}
</style>