<script setup lang="ts">
import {TabClass} from "../../core/GameDataBase/tabs.ts";

const {tab} = defineProps<{ tab: TabClass }>()
const {unlocked, chosen, unlocks} = tab.refs
</script>

<template>
  <div class="sidebar-tab style-border-color" v-if="unlocked"
       :class="{'sidebar-no-subtab': !tab.hasSubTab, chosen:chosen}">
    <div class="sidebar-tab-name" style="border: none"
         @click="tab.show()">
      <span style="align-self: center;border:none">{{ tab.name }}</span>
    </div>
    <div class="sidebar-tab-sublist style-border" v-if="tab.hasSubTab">
      <div v-for="subTab in tab.subTabs">
        <span class="sidebar-subtab style-color style-border" v-if="unlocks[subTab.row+1]"
              @click="tab.show(subTab.row)">
          {{ subTab.name }}
        </span>
      </div>
    </div>
  </div>

</template>

<style scoped>
.sidebar-tab {
  border-top: 1px solid;
  border-right: 1px solid;
  width: 100%;
  color: #7cdcf4;
  height: var(--sidebar-tab-height);
  text-align: center;
  display: flex;
  justify-content: center;
  background-image: var(--bgi);
  position: relative;
  cursor: pointer;
  pointer-events: all;
}

.sidebar-tab-sublist {
  display: flex;
  flex-direction: row;

  position: absolute;
  left: 100%;
  width: var(--left-bar-width);
  opacity: 0;
  transition: all 0.2s linear;
  background-color: transparent;
  border: none;
  pointer-events: none;
}

.sidebar-tab-sublist div:not(:last-child) {
  border-right: none;
}

.sidebar-tab:hover .sidebar-tab-sublist {
  display: flex;
  opacity: 1;
  left: calc(var(--left-bar-width));
  padding-left: var(--sidebar-tab-tri);
  pointer-events: all;
}

.sidebar-tab-name {
  width: 100%;
  height: 100%;
  border: none;
  justify-content: center;
  display: flex;
}

.sidebar-subtab {
  min-height: var(--sidebar-tab-height);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-image: var(--bgi);
  width: 6rem;
}

.sidebar-tab::after {
  content: "";
  left: 100%;
  position: absolute;
  top: 0.5rem;
  width: 0;
  height: 0;
  transition: all 0.2s, 0.2s linear;

  border-bottom: 1rem transparent solid;
  border-top: 1rem transparent solid;
  border-left: 0 var(--border-color) solid;
}

.sidebar-tab::before {
  content: "";
  transition: all 0.15s linear;
  border-left: none;
  border-color: var(--border-color);
}

.chosen::before {
  content: "";
  border-left: 5px solid;
}

.sidebar-tab:hover::after {
  border-left-width: var(--sidebar-tab-tri)
}

.sidebar-no-subtab::after {
  display: none;
}
</style>