<template>
  <el-main>
    <div class="main-container">
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.path"></component>
      </router-view>
    </div>
  </el-main>
</template>

<script setup></script>

<style lang="scss" scoped>
  .el-main {
    background: #f2f3f5;
    --el-main-padding: 20px 10px 10px;
    transition: margin-right 0.5s;

    .main-container {
      background: #fff;
      min-height: calc(100vh - 130px);
      padding: 20px;
      overflow: hidden;
    }
  }
</style>
