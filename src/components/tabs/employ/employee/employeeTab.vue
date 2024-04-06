<script setup lang="ts">

import EmployeeUnit from "./employeeUnit.vue";
import CalcEffects from "../../../small/effect/calcEffects.vue";
import {Effect} from "../../../../core/game-mechanics/effect.ts";
import {Employee} from "../../../../core/GameDataBase/employee/work.ts";

const {onUpdate} = Employee.class.useBase()


function prevent(e: Event) {
  e.preventDefault()
}

const equip = {
  onDrop(e: DragEvent) {
    if (e.dataTransfer) {
      Employee(Number(e.dataTransfer.getData("employ/employWork"))).equip()
    } else {
      setTimeout(() => equip.onDrop(e), 50)
    }
  },
  employees() {
    return Employee.class.allEquipped
  }
}
const notEquip = {
  onDrop(e: DragEvent) {
    if (e.dataTransfer) {
      Employee(Number(e.dataTransfer.getData("employ/employWork"))).unEquip()
    } else {
      setTimeout(() => equip.onDrop(e), 50)
    }
  },
  employees() {
    return Employee.class.allUnequipped
  }
}

function employeeEffects() {
  return Employee.class.allEquipped.map(x => x.toEffect())
}

</script>

<template>
  <div class="flex-row full">
    <div class="employee-equipped flex-col" v-if="onUpdate"
         @drop="equip.onDrop"
         @dragenter="prevent"
         @dragover="prevent">
      <div class="self-center">上岗人数：{{ equip.employees().length }}/{{ Employee.class.maxEquipCount }}</div>
      <CalcEffects :effects="Effect.calcFromEffects(...employeeEffects())"/>
      <div class="flex-col self-center">
        <EmployeeUnit :employee="employee"
                      v-for="employee in equip.employees()"/>
      </div>
      <div v-if="equip.employees().length == 0"
           class="self-center center-text" style="top: 40%;position:relative;">
        将你的雇员拖动到这里<br>以启用加成
      </div>
    </div>
    <div class="employee-all" v-if="onUpdate"
         @drop="notEquip.onDrop"
         @dragenter="prevent"
         @dragover="prevent">
      <div class="gameUnit-contain flex-row">
        <EmployeeUnit :employee="employee"
                      v-for="employee in notEquip.employees()"/>
      </div>
      <div v-if="Employee.class.allUnlocked.length == 0"
           class="self-center center-text style-color" style="top: 40%;position:relative;">
        你还没有雇员哦。去招募吧！
      </div>
      <div v-else-if="notEquip.employees().length == 0"
           class="self-center center-text style-color" style="top: 40%;position:relative">
        你的雇员全部都上岗了。
      </div>
    </div>
  </div>
</template>

<style scoped>
.employee-equipped {
  border-right: 1px solid var(--border-color);
  border-left: 1px solid var(--border-color);
  flex: 2 2;
  color: #7cdcf4;
}

.employee-all {
  flex: 7 5;
}
</style>