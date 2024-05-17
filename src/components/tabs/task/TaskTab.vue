<script setup lang="ts">
import TaskUnit from "./TaskUnit.vue";
import ResourceAmounts from "../../small/resourceAmounts.vue";
import {Task} from "../../../core/GameDataBase/task.ts";
</script>

<template>
  <ResourceAmounts class="full-w flex-row"/>
  <div class="full-w gameUnit-contain">
    <TaskUnit :task="task" v-for="task in Task.all" :key="task.id"/>
  </div>
</template>

<style scoped>

</style>