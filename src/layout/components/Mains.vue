<template>
  <el-main>
    <div class="main-content" :class="{ 'content-collapse': sidebarStore.collapse }">
      <router-view v-slot="{ Component , route}">
        <component :is="Component" :key="route.path"></component>
      </router-view>
    </div>
  </el-main>
</template>
<script lang="ts" setup>
import {useSidebarStore} from '@/store/modules/sidebar'

const sidebarStore = useSidebarStore()
</script>

<style lang="less" scoped>

</style>
