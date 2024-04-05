<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-input v-model="query.courseName" placeholder="请输入课程信息" prefix-icon="Search" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list">
      <el-table-column label="封面" min-width="20" prop="courseLogo">
        <template #default="scope">
          <img :alt="scope.row.courseName" :src="scope.row.courseLogo" style="width: auto; height: 50px" />
        </template>
      </el-table-column>
      <el-table-column label="课程名称" min-width="20" prop="courseName" />
      <el-table-column label="学习进度" prop="courseProgress">
        <template #default="scope">
          <el-progress :percentage="scope.row.courseProgress" :stroke-width="15" :text-inside="true" />
        </template>
      </el-table-column>
      <el-table-column label="开始学习时间" min-width="30" prop="gmtCreate" />
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button type="primary" @click="openStudyRecord(scope.row)">明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage" />
    <study ref="studyRef" />
  </div>
</template>
<script setup>
  import useTable from '@/utils/table'
  import { reactive, ref } from 'vue'
  import { usersApi } from '@/api/users'
  import Pagination from '@/components/Pagination/index.vue'
  import Study from './Study.vue'
  import { useRoute } from 'vue-router/dist/vue-router'
  const route = useRoute()
  // 查看
  const studyRef = ref()
  const openStudyRecord = (item) => {
    studyRef.value.onOpen(item)
  }
  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery } = reactive({
    ...useTable(
      {
        page: usersApi.userCoursePage
      },
      { userId: route.query.userId }
    )
  })
</script>
