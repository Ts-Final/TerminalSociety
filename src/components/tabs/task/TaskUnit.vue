<script setup lang="ts">
import {Task} from "../../../core/GameDataBase/task.ts";
import {player} from "../../../core/player";
import {ref} from "vue";

import {parseResourceName} from "../../../core/game-mechanics/parse.ts";
import {displayEnum} from "../../../core/GameDataBase/display.ts";
import {gameLoop} from "../../../core/gameUpdate/gameLoop.ts";

const {task} = defineProps<{task: Task}>()
const activated = ref(false)
const unlocked = ref(false)
function changeActivate() {
  player.task[task.id][0] = !player.task[task.id][0]
  update()
}
function update() {
  activated.value = player.task[task.id][0]
  unlocked.value = player.task[task.id][1]
}

gameLoop.displayHandlers[displayEnum.task].push(update)

</script>

<template>
  <div class="flex-col medium-size gameUnit style-border" v-if="unlocked">
    <div class="flex-row space-around">
      <span class="name" v-html="task.name"></span>
      <button type="button" @click="changeActivate" class="btn"
              :class="{'btn-ON':activated, 'btn-OFF':!activated}">
        <span v-if="activated">ON</span>
        <span v-else>OFF</span>
      </button>
    </div>
    <div class="border1-top" v-html="task.des"/>
    <div class="gameUnit-popout style-border">
      <div class="flex-row space-around">
        <div v-if="task.produce.length>0" style="margin-left: 2px">
          <div>资源生产：</div>
          <div v-for="rP in task.produce">{{ parseResourceName(rP[0]) }}：+{{ rP[1] }}/s</div>
        </div>
        <div v-if="task.cost.length>0" style="margin-left: 2px">
          <div>资源消耗：</div>
          <div v-for="rP in task.cost">{{ parseResourceName(rP[0]) }}：-{{ rP[1] }}/s</div>
        </div>
      </div>
      <p class="itl">{{ task.itl }}</p>
    </div>
  </div>

</template>

<style scoped>
.itl {
  font-style: italic;
  color: #b8dcee;
  margin: 0.5em;
}

p {
  margin: 0;
}

.btn {
  transition: all 0.2s linear;
  width: 50px;
  text-align: center;
  background: #00000000;
}

.btn-ON {
  color: #7cdcf4;
  border: #7cdcf4 1px solid;
}

.btn-OFF {
  color: #943430;
  border: #943430 1px solid;
}

.name {
  color: #b8dcee;
  font-size: 18px;
}
</style>