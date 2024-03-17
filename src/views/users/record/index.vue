<template>
  <div class="app-container">
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
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  const route = useRoute()
  const activeName = ref(route.query.activeName)
  // 切换
  const handleClick = (target) => {
    activeName.value = target.props.name
  }
</script>
