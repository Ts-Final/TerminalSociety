<script setup lang="ts">
import {Employee, EmployeeWorkClass} from "../../../../core/GameDataBase/employee/work.ts";
import {computed, ref} from "vue";
import {Decimal} from "../../../../core/utils/break_infinity.ts";
import CalcEffects from "../../../small/effect/calcEffects.vue";
import {Effect} from "../../../../core/game-mechanics/effect.ts";

const {checking} = Employee.class.refs
const employee = computed(() =>
    Employee(checking.value ?? 0)
)
const {level, exp, req, regain} = employee.value.refs
const percent = computed(() => {
  const p =
      Decimal.div(employee.value.exp, employee.value.upgradeRequire).mul(250).add(30).toString()
  return `${p}px 0 24px -30px`
    }
)
const Progress = ref()
</script>

<template>
  <div class="employee-checking style-border-color"
       :class="checking != undefined ? 'employee-checking-activated': ''">
    <div class="employee-checking-upper">
      <div class="employee-checking-img"/>
      <div class="employee-checking-inf">
        <div class="employee-checking-names">
          <div style="font-size: 1.5rem" v-html="employee.name"/>
          <div style="font-size: 0.7rem" v-html="employee.name2"/>
        </div>
        <div class="employee-checking-exp">
          <div class="employee-checking-exp-1">
            <div><span style="font-size: 0.75rem">Lv.</span>{{ level }}/50</div>
            <div style="font-size: 0.8rem">{{exp}}/{{req}}</div>
          </div>
          <div class="progress" ref="Progress"></div>
        </div>
        <div style="margin-top: 30px" class="flex-col">
          <span class="self-center size-1.25rem">能力</span>
          <CalcEffects :effects="Effect.calcEffectMap(...employee.toEffect())" />
        </div>
      </div>
    </div>
    <div style="position:relative;flex-grow: 1">
      <div class="full-w center-text size-1.25rem">描述/故事</div>
      <div class="employee-des" v-html="employee.des"/>
    </div>
  </div>
</template>

<style scoped>
.employee-des {
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 4px;
  height: calc(100% - 3rem);
}
.progress {
  border: 2px solid var(--border-color);
  height: 10px;
  width: 250px;
  box-shadow: inset v-bind(percent) #ffffff;
}
.employee-checking-exp-1 {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.employee-checking-exp {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

}
.employee-checking-names {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  text-align: right;
}
.employee-checking-inf {
  position: absolute;
  right: 10px;
  top: 5px;
  width: 50%;
}

.employee-checking-upper {
  height: 60%;
  width: 100%;
  position: relative;
}

.employee-checking-img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url("/400-700.webp");
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: left center;
  background-color: transparent;
}

.employee-checking {
  height: 65vh;
  top: 15vh;
  position: absolute;
  width: 40vw;
  left: 100%;
  transition: all 0.2s;
  background-image: var(--bgi);
  display: flex;
  flex-direction: column;
}

</style>