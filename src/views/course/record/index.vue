<template>
  <div class="app-container">
    <div class="container-header">
      <div class="header-info">
        <img :src="currentCourseInfo.courseLogo" :alt="currentCourseInfo.courseName" style="height: 120px; width: auto; border-radius: 10px" />
        <div class="info">
          <div class="info-title">{{ currentCourseInfo.courseName }}</div>
          <div class="info-name">讲师：{{ currentCourseInfo.lecturerName }}</div>
          <div class="info-name">销售价：￥{{ currentCourseInfo.coursePrice }}</div>
          <div class="info-name">上架状态：售卖</div>
        </div>
      </div>
    </div>
    <div style="height: 20px"></div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-if="currentCourseInfo.coursePrice > 0" label="售卖记录" name="order">
        <record-order v-if="activeName === 'order'" />
      </el-tab-pane>
      <el-tab-pane label="学习记录" name="course">
        <record-course v-if="activeName === 'course'" />
      </el-tab-pane>
      <el-tab-pane label="评论记录" name="comment">
        <record-comment v-if="activeName === 'comment'" />
      </el-tab-pane>
      <el-tab-pane label="收藏记录" name="collect">
        <record-collect v-if="activeName === 'collect'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
  import RecordOrder from './Order.vue'
  import RecordComment from './Comment.vue'
  import RecordCollect from './Collect.vue'
  import RecordCourse from './Course.vue'
  import { onMounted, ref } from 'vue'
  import { courseApi } from '@/api/course.js'
  import { useRoute } from 'vue-router'
  const route = useRoute()

  const activeName = ref('course')

  onMounted(() => {
    // 课程信息
    handleCourseInfo()
  })

  // 课程信息
  const currentCourseInfo = ref({})
  const handleCourseInfo = async () => {
    currentCourseInfo.value = await courseApi.courseView({ id: route.query.courseId })
    if (currentCourseInfo.value.coursePrice > 0) {
      activeName.value = 'order'
    }
  }

  // 切换
  const handleClick = (target) => {
    activeName.value = target.props.name
  }
</script>
<style lang="scss" scoped>
  .container-header {
    display: flex;
    justify-content: space-between;
    .header-info {
      display: flex;
      .info {
        margin-left: 20px;
        line-height: 30px;
        .info-name {
          color: #999;
        }
      }
    }

    .header-button {
      float: right;
    }
  }
</style>
