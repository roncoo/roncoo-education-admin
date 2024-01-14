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

<style lang="scss" scoped>
.main-content {
  position: relative;
  margin-left: 200px;
  padding-top: 90px;
  -webkit-transition: left 0.3s ease-in-out;
  transition: margin-left 0.3s ease-in-out;

  &.content-collapse {
    margin-left: 64px;
  }
}
</style>
