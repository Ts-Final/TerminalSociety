<script setup lang="ts">
import {TabClass} from "../../core/GameDataBase/tabs.ts";

const {tab} = defineProps<{ tab: TabClass }>()
const {unlocked,chosen, unlocks} = tab.refs


</script>

<template>
  <div class="sidebar-tab" v-if="unlocked"
       :class="{'sidebar-no-subtab': !tab.hasSubTab, chosen:chosen}">
    <div class="sidebar-tab-name" style="border: none"
         @click="tab.show()">
      <span style="align-self: center;border:none">{{ tab.name }}</span>
    </div>
    <div class="sidebar-tab-sublist" v-if="tab.hasSubTab">
      <div v-for="subTab in tab.subTabs">
        <div class="sidebar-subtab style-color" v-if="unlocks[subTab.row+1]"
             @click="tab.show(subTab.row)">
          {{ subTab.name }}
        </div>
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
  border-color: #7cdcf4;
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
  flex-direction: column;

  position: absolute;
  left: 100%;
  width: var(--left-bar-width);
  opacity: 0;
  transition: all 0.2s linear;
  background-image: inherit;
  pointer-events: none;
}

.sidebar-tab-name {
  width: 100%;
  height: 100%;
  border: none;
  justify-content: center;
  display: flex;
}

.sidebar-tab:hover .sidebar-tab-sublist {
  display: flex;
  opacity: 1;
  left: calc(var(--left-bar-width) + var(--sidebar-tab-tri));
  pointer-events: all;
}

.sidebar-subtab {
  min-height: var(--sidebar-tab-height);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid;
  cursor: pointer;
}

.sidebar-tab::after {
  content: "";
  border-color: #7cdcf4;
  left: 100%;
  position: absolute;
  top: 0.5rem;
  width: 0;
  height: 0;
  transition: all 0.2s linear;

  border-bottom: 1rem transparent solid;
  border-top: 1rem transparent solid;
  border-left: 0 #7cdcf4 solid;
}

.sidebar-tab::before {
  content: "";
  transition: all 0.15s linear;
  border-left: none;
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