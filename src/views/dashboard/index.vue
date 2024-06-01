<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col v-if="hasPermission('stat:data')" :span="14">
        <stat-data />
      </el-col>
      <el-col :span="10">
        <el-card class="info">
          <template #header>特别说明</template>
          <div class="info-body">
            <div class="info-content">
              <div>1. 演示环境仅有查看功能，更多体验需本地部署</div>
              <div>2. 系统如何搭建部署？视频如何实现本地私有化？</div>
              <div>3. 作者提供有偿服务：18302045627(微信同号)</div>
              <div>4. 关注公众号，获取更多资料：SQL脚本、教程</div>
            </div>
            <img class="info-image" src="@/assets/images/weixin.jpg" alt="作者微信公众号" style="width: auto; height: 120px" />
          </div>
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
</script>
<style lang="scss" scoped>
  .info {
    padding: 15px;
    border-radius: 5px;
    font-size: 16px;
    .info-body {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .info-content {
      div {
        line-height: 30px;
      }
    }
  }
</style>
