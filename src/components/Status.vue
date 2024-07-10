<script setup lang="ts">

import {onMounted, ref} from "vue";

let props = defineProps<{
  status_code: number;
  status_text: string;
}>()
let theme = ref("")
onMounted(() => {
  theme.value = "theme" + props.status_code.toString()
})
</script>

<template>
  <div class="status_wrap">
    <div :class="'status_logo '+theme"></div>
    <div>{{ props.status_text }}</div>
  </div>
</template>

<style scoped lang="less">
.status_wrap {
  display: flex;
  align-items: center;
}

.status_logo {
  width: 10px;
  height: 10px;
  margin-right: 5px;
  border-radius: 50%;
}

.theme0 {
  background: radial-gradient(circle,
  white 0%, white 30%,
  #f44336 30%, #f44336 100%);
}

.theme1 {
  background: radial-gradient(circle,
  white 0%, white 30%,
  #8bc34a 30%, #8bc34a 100%);
}

.theme2 {
  background: radial-gradient(circle,
  white 0%, white 30%,
  #64b5f6 30%, #64b5f6 100%);
}
</style>