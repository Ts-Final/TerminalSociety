<script setup lang="ts">

import EmployeeTab from "./employee/employeeTab.vue";
import {Tab} from "../../../core/GameDataBase/tabs.ts";
const display = Tab.class.display
</script>

<template>
  <EmployeeTab v-if="display[1] == 0"/>
</template>

<style scoped>

</style>