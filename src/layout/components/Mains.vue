<template>
  <el-scrollbar>
    <div class="main-content" :class="{ 'content-collapse': sidebarStore.collapse }">
      <router-view v-slot="{ Component , route}">
        <component :is="Component" :key="route.path"></component>
      </router-view>
    </div>
  </el-scrollbar>
</template>
<script setup>
import {useSidebarStore} from '@/store/modules/sidebar'

const sidebarStore = useSidebarStore()
</script>
