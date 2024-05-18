<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col v-if="hasPermission('stat:data')" :span="16">
        <stat-data />
      </el-col>
      <el-col :span="8">
        <el-card class="info">
          <template #header>特别说明</template>
          <p>1. 演示环境仅提供查看功能，更多功能需本地部署</p>
          <p>2. 系统如何搭建部署？视频如何实现本地私有化？</p>
          <p>3. 作者提供有偿指导服务：18302045627(微信同号)</p>
        </el-card>
      </el-col>
    </el-row>

    <div v-if="hasPermission('stat:login')">
      <stat-login />
    </div>
    <div v-if="hasPermission('stat:vod')">
      <stat-vod />
    </div>
  </div>
</template>
<script setup>
  import StatVod from './StatVod.vue'
  import StatLogin from './StatLogin.vue'
  import StatData from './StatData.vue'
  import { hasPermission } from '@/utils/permission.js'

  console.log(123)
</script>
<style lang="scss" scoped>
  .info {
    padding: 15px;
    border-radius: 5px;
    font-size: 16px;
  }
</style>
