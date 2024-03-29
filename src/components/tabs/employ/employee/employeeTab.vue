<script setup lang="ts">

import EmployeeUnit from "./employeeUnit.vue";
import {GameDataBase} from "../../../../core/GameDataBase";
import {EventHub, GameEvent} from "../../../../core/gameUpdate/eventHub.ts";
import {ref} from "vue";
import {player} from "../../../../core/player";
import CalcEffects from "../../../small/effect/calcEffects.vue";
import {effect, Effect} from "../../../../core/game-mechanics/effect.ts";
import {employeeWorkSkillToAffect} from "../../../../core/GameDataBase/employee/work.ts";
import {Employee} from "../../../../core/game-mechanics/employee.ts";
import {Progress} from "../../../../core/game-mechanics/progress.ts";

const onUpdate = ref(true)

function update() {
  onUpdate.value = false
  setTimeout(()=> onUpdate.value = true,10)
}

EventHub.on(GameEvent.CHANGE_EMPLOYEE,update)

function prevent(e: Event) {
  e.preventDefault()
}

const equip = {
  onDrop(e: DragEvent) {
    if (e.dataTransfer) {
      Employee.equip(Number(e.dataTransfer.getData("employ/employWork")))
    } else {
      setTimeout(() => equip.onDrop(e), 50)
    }
  },
  employees() {
    return GameDataBase.Employees.work.filter(
        (e) => player.employee.work[e.id][1])
  }
}
const notEquip = {
  onDrop(e: DragEvent) {
    if (e.dataTransfer) {
      Employee.unEquip(Number(e.dataTransfer.getData("employ/employWork")))
    } else {
      setTimeout(() => equip.onDrop(e), 50)
    }
  },
  employees() {
    return GameDataBase.Employees.work.filter(
        (e) => !player.employee.work[e.id][1])
  }
}

function employeeEffects() {
  let e :effect[] = []
  for (const employ of equip.employees()) {
    e.push(employeeWorkSkillToAffect(employ,Progress.employee(employ.id).level))
  }
  return e
}

</script>

<template>
  <div class="flex-row full">
    <div class="employee-equipped flex-col" v-if="onUpdate"
         @drop="equip.onDrop"
         @dragenter="prevent"
         @dragover="prevent">
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
    </div>
  </div>
</template>

<style scoped>
.employee-equipped {
  border-right: 1px solid var(--border-color);
  flex: 1 1;
  color: #7cdcf4;
}

.employee-all {
  flex: 7 5;
}
</style>