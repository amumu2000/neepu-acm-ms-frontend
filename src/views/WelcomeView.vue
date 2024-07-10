<template>
  <Welcome></Welcome>
  <div style="display: flex;justify-content: center" v-if="isLogin">
    <el-button type="danger" @click="enter">
      进入系统
    </el-button>
  </div>
  <Copyright></Copyright>
</template>

<style>

</style>
<script setup lang="ts">
import Welcome from "@/components/Welcome.vue";
import Copyright from "@/components/Copyright.vue";
import {useUserStore} from "@/stores/User.js";
import {storeToRefs} from "pinia";
import router from "@/router";

const {isLogin} = storeToRefs(useUserStore())
const enter = () => {
  router.push('/home')
}
</script>