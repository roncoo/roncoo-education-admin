<template>
  <div class="app-container">
    <el-descriptions title="用户信息" :column="3">
      <el-descriptions-item label="">
        <img :alt="usersInfo.nickname" :src="usersInfo.userHead" style="height: 40px; width: auto; border-radius: 50%; vertical-align: middle" />
        <span style="margin-left: 10px">
          {{ usersInfo.nickname }}
          <span v-if="usersInfo.remark"> 【{{ usersInfo.remark }}】</span>
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="用户手机"> {{ usersInfo.mobile }} </el-descriptions-item>
      <el-descriptions-item label="用户年龄"> {{ usersInfo.userAge }} 岁</el-descriptions-item>
      <el-descriptions-item label="账号余额"> ￥{{ usersInfo.usersAccountViewResp?.availableAmount }}</el-descriptions-item>
    </el-descriptions>
    <div style="height: 20px"></div>
    <el-descriptions title="数据统计" :column="4">
      <el-descriptions-item label="购买课程数:"> {{ orderInfoStat.courseBuySum }} </el-descriptions-item>
      <el-descriptions-item label="消费总金额:"> ￥{{ orderInfoStat.courseBuyMoney }} </el-descriptions-item>
      <el-descriptions-item label="学习课程数:"> {{ userCourseStat.courseStudySum }} </el-descriptions-item>
      <el-descriptions-item label="学习总时长:"> {{ formatTimeTotal(userCourseStat.courseStudyDuration) }} </el-descriptions-item>
    </el-descriptions>
    <div style="height: 20px"></div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="购买记录" name="order">
        <users-order v-if="activeName === 'order'" />
      </el-tab-pane>
      <el-tab-pane label="学习记录" name="course">
        <users-course v-if="activeName === 'course'" />
      </el-tab-pane>
      <el-tab-pane label="账户记录" name="account">
        <users-account v-if="activeName === 'account'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
  import UsersOrder from './Order.vue'
  import UsersCourse from './Course.vue'
  import UsersAccount from './Account.vue'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { usersApi } from '@/api/users'
  import { courseApi } from '@/api/course.js'
  import { formatTimeTotal } from '@/utils/base.js'
  const route = useRoute()
  const activeName = ref(route.query.activeName)
  // 切换
  const handleClick = (target) => {
    activeName.value = target.props.name
  }

  const usersInfo = ref({})
  const orderInfoStat = ref({})
  const userCourseStat = ref({})
  onMounted(() => {
    // 获取用户信息
    usersApi.usersView({ id: route.query.userId }).then((res) => {
      usersInfo.value = res
    })
    // 获取订单统计
    usersApi.orderInfoStat({ userId: route.query.userId }).then((res) => {
      orderInfoStat.value = res
    })
    // 获取课程统计
    courseApi.userStudyStat({ userId: route.query.userId }).then((res) => {
      userCourseStat.value = res
    })
  })
</script>
