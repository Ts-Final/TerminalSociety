<script setup lang="ts">

import {ref} from "vue";
import {NewsHandler} from "../../core/GameDataBase/news/news.ts";


const span = ref()
const contain = ref()

NewsHandler.changeNextNews(span, contain)
const {enabled} = NewsHandler.refs

</script>

<template>
  <div class="news style-border" ref="contain" v-if="enabled">
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
  border-width: 0 0 1px 0;
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