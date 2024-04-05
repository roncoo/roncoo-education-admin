<template>
  <div class="app-container">
    <el-descriptions title="课程信息" :column="4">
      <el-descriptions-item label="课程ID"> 3223 </el-descriptions-item>
    </el-descriptions>
    <div style="height: 20px"></div>
    <el-descriptions title="数据统计" :column="5">
      <el-descriptions-item label="购买用户数:"> 3223 </el-descriptions-item>
      <el-descriptions-item label="收入总金额:"> 3223 </el-descriptions-item>
      <el-descriptions-item label="评论次数:"> 3223 </el-descriptions-item>
      <el-descriptions-item label="评论用户数:"> 3223 </el-descriptions-item>
      <el-descriptions-item label="收藏用户数:"> 3223 </el-descriptions-item>
    </el-descriptions>
    <div style="height: 20px"></div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="课程记录" name="course">
        <course-course v-if="activeName === 'course'" />
      </el-tab-pane>
      <el-tab-pane label="课程评论" name="comment">
        <course-comment v-if="activeName === 'comment'" />
      </el-tab-pane>
      <el-tab-pane label="课程收藏" name="collect">
        <course-collect v-if="activeName === 'collect'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
  import CourseComment from './Comment.vue'
  import CourseCollect from './Collect.vue'
  import CourseCourse from './Course.vue'
  import { ref } from 'vue'

  const activeName = ref('course')
  // 切换
  const handleClick = (target) => {
    activeName.value = target.props.name
  }
</script>
