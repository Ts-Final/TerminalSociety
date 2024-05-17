<script setup lang="ts">
import SidebarTab from "./SidebarTab.vue";
import {Tab} from "../../core/GameDataBase/tabs.ts";
</script>

<template>
  <div class="sidebar-wrapper">
    <SidebarTab
        v-for="tab in Tab.all"
        :tab="tab"
    />
  </div>

</template>

<style scoped>
.sidebar-wrapper {
  width: var(--left-bar-width);
  margin: 0;
  position: fixed;
  left: 0;
  top: 0;
  align-items: center;
}

.sidebar-wrapper div:last-child {
  border-bottom: 1px solid;
  border-color: var(--border-color);
}

</style>