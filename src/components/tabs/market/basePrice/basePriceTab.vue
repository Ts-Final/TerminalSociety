<script setup lang="ts">
import {Resources} from "../../../../core/GameDataBase/resource.ts";
</script>

<template>
  <div class="full flex-row" style="justify-content: center;">
    <div class="flex-col table style-border">
      <div class="flex-row bpt-line">
        <p>资源类型</p>
        <p>基础价格/1</p>
      </div>
      <div class="flex-row bpt-line border1-top" v-for="res in Resources.all">
        <p>{{res.parsed}}</p>
        <p>{{res.basePrice}}</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.table {
  width: 75% !important;
  align-self: center;
  position: relative;;
  top: -10%;
}

.bpt-line {
  display: inline-grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: row;
  text-align: center;
  color: #b8dcee;
}
</style>