<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="info">
          <template #header>数据统计</template>
          <el-row>
            <el-col :span="6">
              <router-link to="/common/order">
                <el-statistic title="今天订单数" :value="statData.todayOrder" />
              </router-link>
            </el-col>
            <el-col :span="6">
              <router-link to="/common/order">
                <el-statistic title="今天收入" precision="2" :value="statData.todayMoney" :prefix="'￥'" />
              </router-link>
            </el-col>
            <el-col :span="6">
              <router-link to="/common/order">
                <el-statistic title="昨天订单数" :value="statData.yesterdayOrder" />
              </router-link>
            </el-col>
            <el-col :span="6">
              <router-link to="/common/order">
                <el-statistic title="昨天收入" :precision="2" :value="statData.yesterdayMoney" :prefix="'￥'" />
              </router-link>
            </el-col>
          </el-row>
          <br />
          <el-row>
            <el-col :span="6">
              <router-link to="/users/list">
                <el-statistic title="总用户数" :value="statData.userSum" />
              </router-link>
            </el-col>
            <el-col :span="6">
              <router-link to="/course/list">
                <el-statistic title="总课程数" :value="statData.courseSum" />
              </router-link>
            </el-col>
            <el-col :span="6">
              <router-link to="/common/order">
                <el-statistic title="总订单数" :value="statData.orderSum" />
              </router-link>
            </el-col>
            <el-col :span="6">
              <router-link to="/common/order">
                <el-statistic title="总收入" precision="2" :value="statData.orderMoney" :prefix="'￥'" />
              </router-link>
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
  import { onMounted, ref } from 'vue'
  import { statApi } from '@/api/dashboard.js'

  const statData = ref({})

  onMounted(() => {
    statApi.data().then((res) => {
      statData.value = res
    })
  })
</script>
<style lang="scss" scoped>
  .info {
    padding: 15px;
    border-radius: 5px;
    font-size: 16px;
  }
</style>
