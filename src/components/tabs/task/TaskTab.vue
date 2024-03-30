<script setup lang="ts">
import TaskUnit from "./TaskUnit.vue";
import {GameDataBase} from "../../../core/GameDataBase";
import ResourceAmounts from "../../small/resourceAmounts.vue";

</script>

<template>
  <ResourceAmounts class="full-w flex-row" />
  <div class="full-w flex-row flex-wrap">
    <TaskUnit :Task="task" v-for="task in GameDataBase.Tasks.all" :key="task.id"/>
  </div>
</template>

<style scoped>

</style>