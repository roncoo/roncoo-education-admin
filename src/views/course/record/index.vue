<template>
  <div class="app-container">
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
