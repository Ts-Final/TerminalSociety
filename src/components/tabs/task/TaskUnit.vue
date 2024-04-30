<script setup lang="ts">
import {TaskClass} from "../../../core/GameDataBase/task.ts";


import {parseResourceName} from "../../../core/GameDataBase/resource.ts";

const {Task} = defineProps<{Task: TaskClass }>()
const {unlocked, activated} = Task.refs

</script>

<template>
  <div class="flex-col medium-size gameUnit style-border" v-if="unlocked">
    <div class="flex-row space-around">
      <span class="name" v-html="Task.name"></span>
      <button type="button" @click="Task.trigger" class="btn"
              :class="{'btn-ON':activated, 'btn-OFF':!activated}">
        <span v-if="activated">ON</span>
        <span v-else>OFF</span>
      </button>
    </div>
    <div class="border1-top" v-html="Task.des"/>
    <div class="gameUnit-popout style-border">
      <div class="flex-row space-around">
        <div v-if="Task.produce.length>0" style="margin-left: 2px">
          <div>资源生产：</div>
          <div v-for="rP in Task.produce">{{ parseResourceName(rP[0]) }}：+{{ rP[1] }}/s</div>
        </div>
        <div v-if="Task.cost.length>0" style="margin-left: 2px">
          <div>资源消耗：</div>
          <div v-for="rP in Task.cost">{{ parseResourceName(rP[0]) }}：-{{ rP[1] }}/s</div>
        </div>
      </div>
      <p class="itl">{{ Task.itl }}</p>
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