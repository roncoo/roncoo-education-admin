<template>
  <el-main>
    <router-view v-slot="{ Component , route}">
      <component :is="Component" :key="route.path"></component>
    </router-view>
  </el-main>
</template>
<script setup lang="ts">
import {useSidebarStore} from '@/store/modules/sidebar'

const sidebarStore = useSidebarStore()
</script>

<style lang="less" scoped>
.el-main {
  margin-left: 200px;
}
</style>
