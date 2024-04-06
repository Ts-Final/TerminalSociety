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
  position: absolute;
  left: 0;
  top: 0;
  z-index: var(--z-topbar);
  align-items: center;
}

.sidebar-wrapper :last-child {
  border-bottom: 1px solid;
}

</style>