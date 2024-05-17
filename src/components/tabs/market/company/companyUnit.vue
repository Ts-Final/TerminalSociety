<script setup lang="ts">

import {CompanyClass} from "../../../../core/GameDataBase/market/company.ts";
import {Country} from "../../../../core/GameDataBase/situation/country.ts";

const {company} = defineProps<{ company: CompanyClass }>()

</script>

<template>
  <div class="gameUnit style-border flex-col">
    <div class="flex-row space-around">
      <div>{{ company.name }}</div>
      <div v-html="Country(company.country).parsed"></div>
    </div>
    <div class="flex-col">
      <div>可交易资源类型：</div>
      <div class="flex-row space-around">
        <span v-for="s in company.allResourceString"
              v-html="s"></span>
      </div>
    </div>
    <div class="gameUnit-popout flex-col style-border">
      <div>
        {{ company.des }}
      </div>
      <br>
      <div>
        增产系数：{{ company.advPow[0] }}~{{ company.advPow[1] }}
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>