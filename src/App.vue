<script setup lang="ts">

import "./base.css"
import RightTab from "./components/tabs/RightTab.vue";
import Sidebar from "./components/sidebar/Sidebar.vue";
import News from "./components/small/news.vue";
</script>

<template>
  <div class="full app-wrapper">
    <News />
    <RightTab/>
    <Teleport to="body">
      <Sidebar/>
    </Teleport>
  </div>
</template>

<style>
body, :root, #app {
  background-image: linear-gradient(60deg, #0d1418 0%, #11161b 100%);
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
  font-family: sans-serif;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  left: 0;
  flex-wrap: nowrap;
}

#notifyContainer {
  top: 0;
  right: 0;
  z-index: 100;
  position: absolute;
  margin: 5px;
}

:root {
  --left-bar-width: 8rem;
  --z-topbar: 10;
  --z-modal: 20;
  --bgi:linear-gradient(60deg, #0d1418 0%, #11161b 100%);
  --border-color: #7cdcf4;
  --sidebar-tab-height: 2.5rem;
  --sidebar-tab-tri: 1.5rem;
  --news-height: 2rem;
  --medium-width: 220px;
  --text-color: #7cdcf4;
}
</style>