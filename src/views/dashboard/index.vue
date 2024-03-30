<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="info">
          <template #header>数据统计</template>
          <el-row>
            <el-col :span="6">
              <el-statistic title="今天订单数" :value="3223" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="今天收入" :value="3223" :prefix="'￥'" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="总订单数" :value="3223" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="总收入" :value="3223" :prefix="'￥'" />
            </el-col>
          </el-row>
          <br />
          <el-row>
            <el-col :span="6">
              <el-statistic title="今天新增用户" :value="3223" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="今天活跃用户" :value="3223" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="总用户数" :value="3223" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="总支付人数" :value="3223" />
            </el-col>
          </el-row>
        </el-card>
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
