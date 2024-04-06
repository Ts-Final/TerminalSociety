import {createApp} from 'vue'
import App from './App.vue'
import "./styles/index.ts"
import {init} from "./core/init.ts";
import {GameUI} from "./core/game-mechanics/gameUI.ts";

init()

createApp(App).mount('#app')

GameUI.finishInitialize()
// console.log(version)