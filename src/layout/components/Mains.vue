<template>
  <el-main>
    <div class="main-container" :class="{ 'dashboard-main': route.path === '/dashboard' }">
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.path"></component>
      </router-view>
    </div>
  </el-main>
</template>

<script setup>
  import { useRoute } from 'vue-router'

  const route = useRoute()
</script>

<style lang="scss" scoped>
  .el-main {
    min-width: 0;
    background: var(--admin-canvas);
    --el-main-padding: 15px;
    transition: margin-right 0.5s;

    .main-container {
      background: var(--admin-surface);
      min-height: calc(100vh - 90px);
      padding: 24px;
      border: 1px solid var(--admin-line);
      border-radius: 12px;
      box-shadow: var(--admin-shadow);
      overflow: hidden;

      &.dashboard-main {
        padding: 0;
        background: transparent;
        border: 0;
        box-shadow: none;
      }
    }
  }
</style>
