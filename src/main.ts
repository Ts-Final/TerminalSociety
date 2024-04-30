import {createApp} from 'vue'
import App from './App.vue'
import "./styles/index.ts"
import {init} from "./core/init.ts";
import {ui} from "./core/game-mechanics/ui.ts";

init()

createApp(App).mount('#app')

ui.init.finishInitialize()
// console.log(version)