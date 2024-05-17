<script setup lang="ts">
import {TaskClass} from "../../../core/GameDataBase/task.ts";


import {Resource} from "../../../core/GameDataBase/resource.ts";

const {task} = defineProps<{ task: TaskClass }>()
const {unlocked, activated} = task.refs

</script>

<template>
  <div class="flex-col gameUnit style-border" v-if="unlocked">
    <div class="grid-1-3 full-h">
      <div v-if="task.produce.length !== 0" class="center-text align-center flex-col">
        <span style="font-size: 3rem" v-html="Resource(task.produce[0][0]).parsed.charAt(0)"/>
      </div>
      <div class="task-right">
        <div class="flex-row space-around full-w">
          <span class="name" v-html="task.name" />
          <button type="button" @click="task.trigger" class="btn"
                  :class="{'btn-ON':activated, 'btn-OFF':!activated}">
            <span v-if="activated">ON</span>
            <span v-else>OFF</span>
          </button>
        </div>
        <div class="border1-top size-0.9rem full-w" v-html="task.des"></div>
      </div>
    </div>

    <div class="gameUnit-popout style-border">
      <div class="flex-row space-around">
        <div v-if="task.produce.length>0" style="margin-left: 2px">
          <div>资源生产：</div>
          <div v-for="rP in task.produce">{{ Resource(rP[0]).parsed }}：+{{ rP[1] }}/s</div>
        </div>
        <div v-if="task.cost.length>0" style="margin-left: 2px">
          <div>资源消耗：</div>
          <div v-for="rP in task.cost">{{ Resource(rP[0]).parsed }}：-{{ rP[1] }}/s</div>
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
  max-height: 1.5rem;
  pointer-events: all;
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
.task-right {
  display: flex;
  flex-direction: column;
  align-items: start;
}
</style>