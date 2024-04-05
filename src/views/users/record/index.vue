<template>
  <div class="app-container">
    <el-descriptions title="用户信息" :column="5">
      <el-descriptions-item label="">
        <img :alt="usersInfo.nickname" :src="usersInfo.userHead" style="height: 40px; width: auto; border-radius: 50%; vertical-align: middle" />
        <span style="margin-left: 10px">
          {{ usersInfo.nickname }}
          <span v-if="usersInfo.remark"> 【{{ usersInfo.remark }}】</span>
        </span>
      </el-descriptions-item>
      <el-descriptions-item label="用户手机"> {{ usersInfo.mobile }} </el-descriptions-item>
      <el-descriptions-item label="用户年龄"> {{ usersInfo.userAge }} 岁</el-descriptions-item>
    </el-descriptions>
    <div style="height: 20px"></div>
    <el-descriptions title="数据统计" :column="4">
      <el-descriptions-item label="购买课程数:"> 3223 </el-descriptions-item>
      <el-descriptions-item label="消费总金额:"> ￥3223 </el-descriptions-item>
      <el-descriptions-item label="学习课程数:"> 3223 </el-descriptions-item>
      <el-descriptions-item label="学习总时长:"> 3223 </el-descriptions-item>
    </el-descriptions>
    <div style="height: 20px"></div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="课程记录" name="course">
        <users-course v-if="activeName === 'course'" />
      </el-tab-pane>
      <el-tab-pane label="账户记录" name="account">
        <users-account v-if="activeName === 'account'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
  import UsersCourse from './Course.vue'
  import UsersAccount from './Account.vue'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { usersApi } from '@/api/users.js'
  import { getEnumList, getEnumObj } from '@/utils/base.js'
  const route = useRoute()
  const activeName = ref(route.query.activeName)
  // 切换
  const handleClick = (target) => {
    activeName.value = target.props.name
  }

  /**
   * @description: 获取用户信息
   */
  const usersInfo = ref({})
  onMounted(async () => {
    usersInfo.value = await usersApi.usersView({ id: route.query.userId })
  })
</script>
