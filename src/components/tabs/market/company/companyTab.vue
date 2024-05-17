<script setup lang="ts">

import CompanyUnit from "./companyUnit.vue";
import {Company} from "../../../../core/GameDataBase/market/company.ts";
</script>

<template>
  <div class="full-w gameUnit-contain">
    <CompanyUnit :company="company" v-for="company in Company.all"/>
  </div>
</template>

<style scoped>

</style>