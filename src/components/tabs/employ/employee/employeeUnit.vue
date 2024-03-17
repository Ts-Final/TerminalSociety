<script setup lang="ts">

import {employeeWork, employeeWorkSkillToAffect} from "../../../../core/GameDataBase/employee/work.ts";
import {computed, ref} from "vue";
import {gameUpdateDisplays} from "../../../../core/gameUpdate/updateDisplay.ts";
import {displayEnum} from "../../../../core/GameDataBase/display.ts";
import EffectLines from "../../../small/effect/EffectLines.vue";
import {Progress} from "../../../../core/game-mechanics/progress.ts";
import {Employee} from "../../../../core/game-mechanics/employee.ts";

const {employee} = defineProps<{ employee: employeeWork }>()
const eff = employeeWorkSkillToAffect(employee, Progress.employee(employee.id).level)

const unlocked = ref(false)
const shown = computed(() => unlocked.value)
const level = ref(0)
const letters = ref(0)
const req = ref(0)

function update() {
  let employ = Progress.employee(employee.id)
  unlocked.value = employ.unlocked
  level.value = employ.level
  letters.value = employ.letters
  req.value = Employee.upgradeRequire(employ.level)
}

function onDragStart(e: DragEvent) {
  if (e.dataTransfer) {
    e.dataTransfer.setData('employ/employWork', employee.id.toString())
    e.dataTransfer.dropEffect = "copy"
  } else {
    setTimeout(() => onDragStart(e), 50)
  }
}

gameUpdateDisplays[displayEnum.employWork].push(update)
</script>

<template>
  <div class="gameUnit flex-col medium-size" style="border: 2px solid"
       v-if="shown " draggable="true" :class="`rarity-${employee.rarity}`"
       @dragstart="onDragStart">
    <div class="flex-row space-around">
      <div v-html="employee.name"/>
      <div v-if="employee.name2" v-html="employee.name2" class="op0.5"/>
    </div>
    <div class="border1-top flex-row space-around">
      <div>Lv.{{ level }}</div>
      <div>({{ letters }}/{{ req }})</div>
      <div v-if="letters >= req" class="employ-unit-btn"
           @click="Employee.upgradeEmployee(employee.id)">升级
      </div>
    </div>
    <div class="gameUnit-popout" style="border: 2px solid inherit;">
      <div>
        {{ employee.des }}
      </div>
      <br>
      <div class="flex-col">
        <EffectLines :eff="eff"/>
      </div>
    </div>

  </div>
</template>

<style scoped>
.employ-unit-btn {
  cursor: pointer;
  animation: a-employ-level-up 2s infinite ease-in-out;
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
    border-color: #f6f104
  }
  100% {
    border-color: #16cc3a
  }
}
</style>