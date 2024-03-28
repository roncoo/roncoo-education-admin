<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="info">
          <template #header>更新日志：v14.0.0-RELEASE</template>
          <p>1. 管理后台升级并优化：Vue3 + Element-Plus + Vite + Axios + Pinia</p>
          <p>2. 门户系统升级并优化：Nuxt3 + Element-Plus + Vite + Axios + Pinia</p>
          <p>3. 增加余额支付、文档学习、视频学习控制等功能，并修复bug若干</p>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="info">
          <template #header>特别说明</template>
          <p>1. 演示环境仅提供查看功能，本地部署能体验更多功能</p>
          <p>2. 可提供有偿指导服务：请联系作者：18302045627（微信同号）</p>
          <p>3. 点播平台：领课云可以私有化部署，请联系作者：18302045627（微信同号）</p>
        </el-card>
      </el-col>
    </el-row>

    <div v-permission="'stat:login'">
      <stat-login />
    </div>
    <div v-permission="'stat:vod'">
      <stat-vod />
    </div>
  </div>
</template>
<script setup>
  import StatVod from './StatVod.vue'
  import StatLogin from './StatLogin.vue'
</script>
<style lang="scss" scoped>
  .info {
    padding: 15px;
    border-radius: 5px;
    font-size: 16px;
  }
</style>
