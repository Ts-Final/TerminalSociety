<script setup lang="ts">

import {Ref, ref} from "vue";
import {GameDataBase} from "../../core/GameDataBase";
import {randomElement} from "../../core/functions/random.ts";
import {NewsTick} from "../../core/GameDataBase/news/news.ts";
import {EventHub, GameEvent} from "../../core/gameUpdate/eventHub.ts";
import {displayEnum} from "../../core/GameDataBase/display.ts";
import {player} from "../../core/player";
import {gameLoop} from "../../core/gameUpdate/gameLoop.ts";


const span: Ref<HTMLSpanElement | undefined> = ref()
const contain: Ref<HTMLDivElement | undefined> = ref()

const enabled = ref(true)

/**
 * Length max: 10
 * 在news还不够多的时候先1吧
 */
const recentNews: NewsTick[] = []
const recentNewsMax = 1
let id: NodeJS.Timeout|undefined;

function changeNextNews() {
  if (span.value == undefined) {
    setTimeout(changeNextNews, 50)
    return
  }

  let nextNews = randomElement(GameDataBase.News.filter((x) => x.unlocked()))
  while (recentNews.includes(nextNews)) {
    nextNews = randomElement(GameDataBase.News.filter((x) => x.unlocked()))
  }
  recentNews.push(nextNews)
  while (recentNews.length > recentNewsMax) {
    recentNews.shift()
  }

  span.value.innerHTML = nextNews.content // set the content
  span.value.style["transitionDuration"] = "0s"
  span.value.style['transform'] = "translateX(0)"

  setTimeout(setDuration, 500)

}

function setDuration() {
  if (span.value == undefined || contain.value == undefined) {
    setTimeout(setDuration, 500)
    return
  }
  const scrollSpeed = 140 // px /s
  const duration = (span.value?.clientWidth + contain.value?.clientWidth) / scrollSpeed
  span.value.style["transform"] = "translateX(-100%)"

  span.value.style['transitionDuration'] = duration + "s"

  id = setTimeout(changeNextNews, duration * 1000)
}

changeNextNews()
EventHub.on(GameEvent.UPDATE_NEWS, changeNextNews)
gameLoop.displayHandlers[displayEnum.baseLayouts].push(function () {
  enabled.value = player.options.news
})
EventHub.on(GameEvent.OPTION_CHANGE,function (){
  enabled.value = player.options.news
  if (enabled.value && id) {
    clearTimeout(id)
    changeNextNews()
  }
})

</script>

<template>
  <div class="news" ref="contain" v-if="enabled">
    <span class="news-ticker" ref="span"></span>
  </div>
</template>

<style scoped>
.news {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 1.5rem;
  background-image: var(--bgi);
  display: flex;
  align-items: center;
}

.news-ticker {
  transition: transform linear;
  position: relative;
  color: #7cdcf4;
  pointer-events: none;
  padding-left: 100%;
  white-space: nowrap;

}
</style>