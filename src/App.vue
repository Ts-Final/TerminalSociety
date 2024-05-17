<script setup lang="ts">

import "./base.css"
import RightTab from "./components/tabs/RightTab.vue";
import News from "./components/small/news.vue";
import GameUIFixed from "./components/GameUIFixed.vue";
import {ui} from "./core/game-mechanics/ui.ts";
</script>

<template>
  <div class="full app-wrapper">

    <template v-if="ui.init.ref.value">
      <News/>
      <RightTab/>
    </template>

    <GameUIFixed/>
  </div>
</template>

<style>
body, :root, #app {
  background-image: linear-gradient(60deg, #0d1418 0%, #11161b 100%);
  margin: 0;
  overflow: hidden;
}

* {
  font-family: sans-serif;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  left: 0;
  width: 100vw;
  height: 100vh;
  flex-wrap: nowrap;
}


:root {
  --left-bar-width: 7rem;
  --z-fixed: 5;
  --z-modal-bg: 9;
  --z-modal: 10;

  --bgi: linear-gradient(60deg, #0d1418 0%, #11161b 100%);
  --border-color: #7cdcf4;
  --sidebar-tab-height: 2.5rem;
  --sidebar-tab-tri: 1.5rem;
  --news-height: 2rem;
  --medium-width: 220px;
  --text-color: #7cdcf4;
  --background-base: #000000;
  --border-width: 2px;
  --border-radius: 2px
}

:root {
  /* Don't change this instance of --color-text or any of its values in other themes to not be hex; it's parsed as hex
    elsewhere to provide theme-dependent color gradients */
  --color-text: #7cdcf4;
  --color-text-inverted: #83230b;
  --color-base: #f2f2f2;
  --color-disabled: #a3a3a3;
  --color-accent: #4980cc;
  --color-good: #5ac467;
  --color-good-dark: #127a20;
  --color-good-paused: #e3e638;
  --color-bad: #b84b5f;
  --color-gh-purple: #8957e5;
  --color-notification: red;
  --color-overlay: rgba(30, 30, 50, 70%);

  /*
  --color-antimatter: #2196f3;
  --color-infinity: #b67f33;
  --color-eternity: #b341e0;
  --color-dilation: #64dd17;
  --color-reality: #0ba00e;
  --color-reality-light: #d5ffd7;
  --color-reality-dark: #0a790c;
  --color-celestials: #5151ec;
  --color-prestige--accent: white;

  --color-teresa--base: #5151ec;
  --color-teresa--accent: white;

  --color-effarig--base: #d13737;

  --color-enslaved--base: #f1aa7f;

  --color-v--base: #ead584;

  --color-ra--base: #9575cd;
  --color-ra-pet--teresa: #8596ea;
  --color-ra-pet--effarig: #ea8585;
  --color-ra-pet--enslaved: #f1aa7f;
  --color-ra-pet--v: #ead584;
  --color-ra-pet--ra: #9575cd;
  --color-ra-pet--laitela: white;
  --color-ra-pet--pelle: crimson;

  --color-laitela--base: white;
  --color-laitela--accent: black;

  --color-pelle--base: #dc143c;
  --color-pelle--secondary: #00bcd4;

  !*Custom Stuff Starts Here*!

  --color-mending: #cc2988;
  --color-mending-dark: #57113a;
  --color-mending-light: #f0dde8;

  --color-destroyer--base: rgb(18, 190, 243);
  --color-kohler--base: #c93991;
  --color-kohler--accent: #31071c;*/

}
</style>