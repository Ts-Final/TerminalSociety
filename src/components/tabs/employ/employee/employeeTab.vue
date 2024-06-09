<script setup lang="ts">

import EmployeeUnit from "./employeeUnit.vue";
import CalcEffects from "../../../small/effect/calcEffects.vue";
import {Effect} from "../../../../core/game-mechanics/effect.ts";
import {Employee, EmployeeWorkClass} from "../../../../core/GameDataBase/employee/work.ts";
import {computed} from "vue";
import EmployeeCheck from "./EmployeeCheck.vue";

const {onUpdate, equipCount, unlockCount, checking} = Employee.class.refs


function prevent(e: Event) {
  e.preventDefault()
}

const events = {
  equip(e: DragEvent) {
    if (e.dataTransfer) {
      Employee(Number(e.dataTransfer.getData("employ/employWork"))).equip()
    }
  },
  unEquip(e: DragEvent) {
    if (e.dataTransfer) {
      Employee(Number(e.dataTransfer.getData("employ/employWork"))).unEquip()
    }
  }
}

function employeeEffects() {
  return Employee.class.allEquipped.map(x => x.toEffect())
}

function EquippedEffects(count: number) {
  const v: EmployeeWorkClass[] = []
  const employees = Employee.class.allEquipped
  for (let i = 0; i < count; i++) {
    v.push(employees[i])
  }
  return v.map(x => x.toEffect())
}

/*
* Using the useless "count" here is aimed to trigger reactivity when
* equipped/unlocked changes
* */
const computes = {
  effects(count: number) {
    return this.equippedEWs(count).map(x => x.toEffect())
  },
  equippedEWs(count: number) {
    return Employee.class.allEquipped
        .sort((a, b) => (a.id - count) - (b.id - count))
  },
  unequippedEWs(count: number) {
    return Employee.class.unlockedAndUnequipped
        .sort((a, b) => (a.id - count) - (b.id - count))
  }
}
const effects = computed(() => {
  const eff = computes.effects(equipCount.value)
  const eff1 = eff.flat()
  return Effect.calcEffectMap(...eff1)
})
function NCheckOnClick() {
  if (checking.value != undefined) {
    Employee.class.unCheck()
  }
}
</script>

<template>
  <div class="employee-wrapper style-color">
    <div class="flex-col style-border-color" style="border-right: 2px solid" @click="NCheckOnClick">
      <div class="self-center">上岗人数：{{ equipCount }}/{{ Employee.class.maxEquipCount }}</div>
      <CalcEffects :effects="effects" v-if="onUpdate"/>
    </div>
    <div class="employee-units" @click="NCheckOnClick">
      <div class="employee-inner"
           @dragover="prevent" @drop="events.equip" @dragenter="prevent">
        <div>
          <span class="unchooseable">当前在岗</span>
          <span style="position:absolute;right: 5px">双击任意一位员工以查看详细信息</span>
        </div>
        <div class="employee-row" v-if="onUpdate">
          <EmployeeUnit :employee="ew" v-for="ew in computes.equippedEWs(equipCount)"/>
        </div>
      </div>
      <div class="employee-inner"
           @dragover="prevent" @drop="events.unEquip" @dragenter="prevent">
        <div class="unchooseable">休息中</div>
        <div class="employee-row" v-if="onUpdate">
          <EmployeeUnit :employee="ew" v-for="ew in computes.unequippedEWs(unlockCount)"/>
        </div>
      </div>
    </div>
    <employeeCheck/>
  </div>
</template>

<style scoped>
.employee-checking-activated {
  box-shadow: 0 0 5vh 20vh rgba(13, 24, 49, 0.63),
  0 0 100vh 100vw #0d141855;
  left: calc(100% - 50vw);
  border: 2px solid;
  border-radius: 4px;
}
.employee-wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 5fr;
}

.employee-row {
  display: flex;
  flex-direction: row;
  height: calc(100% - 3rem);
}

.employee-inner {
  display: flex;
  flex-direction: column;

}

.employee-units {
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-gap: 50px;
}
</style>