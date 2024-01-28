<template>
  <el-main>
    <div class="main-container">
      <router-view v-slot="{Component, route}">
        <component :is="Component" :key="route.path"></component>
      </router-view>
    </div>
  </el-main>
</template>
<script setup lang="ts">

</script>

<style lang="less" scoped>
.el-main {
  margin-left: 200px;
  background: #f2f3f5;
  --el-main-padding: 20px 10px 10px;

  .main-container {
    background: #fff;
    min-height: calc(100vh - 130px);
    padding: 20px;
  }
}
</style>
