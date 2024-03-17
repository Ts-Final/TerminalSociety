<script setup lang="ts">
import {Research, researchToEffect} from "../../../core/GameDataBase/research.ts";
import {player} from "../../../core/player";
import {ref} from "vue";
import {calcLevelTime} from "../../../core/game-mechanics/research.ts";
import {parseResourceName} from "../../../core/game-mechanics/parse.ts";
import {gameUpdateDisplays} from "../../../core/gameUpdate/updateDisplay.ts";
import {displayEnum} from "../../../core/GameDataBase/display.ts";
import EffectLines from "../../small/effect/EffectLines.vue";
import {Progress} from "../../../core/game-mechanics/progress.ts";

const {research} = defineProps<{ research: Research }>()
const activated = ref(false)
const unlocked = ref(false)
const level = ref(0)
const started = ref(0)
const finished = ref(false)

let timeToUpg = ref(0)
const percent = ref('0')
const shown = ref(false)
const onUpdate = ref(true)

function changeActivate() {
  player.research[research.id][0] = !player.research[research.id][0]
  activated.value = !activated.value
}

function update() {
  if (level.value < player.research[research.id][3]) {
    onUpdate.value = false
    onUpdate.value = true
  }
  finished.value = Progress.research(research.id).level >= research.maxLevel
  timeToUpg.value = calcLevelTime(research)
  percent.value = 100 * started.value / timeToUpg.value + "%"
  shown.value = unlocked.value && !finished.value

  if (player.dev) {
    shown.value = !finished.value
  }
}

gameUpdateDisplays[displayEnum.research].push(update)

</script>

<template>
  <div class="flex-col medium-size blue-border gameUnit" v-if="shown">
    <div class="show">
      <div class="res-detail-first-row">
        <span class="name">{{ research.name }}</span>
        <button type="button" @click="changeActivate" class="btn"
                :class="{'btn-ON':activated, 'btn-OFF':!activated}">
          <span v-if="activated">ON</span>
          <span v-else>OFF</span>
        </button>
      </div>
      <div class="second-row">
        <div class="progress-wrapper">
          <div class="progress"/>
        </div>
      </div>
      <div class="third-row" style="display: flex;justify-content: space-around">
        <div>Lv. {{ level }}</div>
        <div>本级用时：{{ timeToUpg }}s</div>
      </div>
      <div class="third-row">
        {{ research.des }}
      </div>
    </div>
    <div class="gameUnit-popout blue-border" v-if="onUpdate">
      <div v-if="research.cost.length > 0" style="color: #7cdcf4">
        <div>资源消耗：</div>
        <div v-for="rP in research.cost">{{ parseResourceName(rP[0]) }}：{{ rP[1] }}/s</div>
      </div>
      <br v-if="research.cost.length >0 && research.effect.length > 0">
      <div v-if="research.effect.length >0" style="color: #7cdcf4">
        <div v-if="research.maxLevel > 1">下一级研究效果：</div>
        <div v-else>研究效果：</div>
        <EffectLines :eff="researchToEffect(research,level)"/>
      </div>
      <br>
      <p class="itl">{{ research.itl }}</p>
    </div>
  </div>
</template>

<style scoped>
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

.res-detail-first-row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.name {
  color: #b8dcee;
  font-size: 18px;
}

.second-row {
  display: flex;
  flex-direction: row;

}

.progress-wrapper {
  margin: 2px;
  border: 2px solid #7cdcf4;
  padding: 2px;
  height: 0.75rem;
  width: 100%;
}

.progress {
  height: 100%;
  background: #7cdcf4;
  width: v-bind(percent);
}

.third-row {
  width: 100%;
  padding: 2px;
  color: #b8dcee;

}

.itl {
  font-style: italic;
  color: #b8dcee;
  margin: 0;
}

</style>