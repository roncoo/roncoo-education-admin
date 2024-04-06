<template>
  <div class="course">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-input v-model="query.mobile" placeholder="根据手机号码搜索" prefix-icon="Search" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list">
      <el-table-column label="手机号码" min-width="20" prop="mobile" />
      <el-table-column label="用户昵称" min-width="20" prop="nickname" />
      <el-table-column label="学习进度" prop="courseProgress">
        <template #default="scope">
          <el-progress :percentage="scope.row.courseProgress" :stroke-width="15" :text-inside="true" />
        </template>
      </el-table-column>
      <el-table-column label="开始学习时间" min-width="30" prop="gmtCreate" />
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button text type="primary" @click="openStudyRecord(scope.row)">明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage" />
    <study ref="formRef" />
  </div>
</template>
<script setup>
  import useTable from '@/utils/table'
  import { reactive, ref } from 'vue'
  import { courseApi } from '@/api/course'
  import Study from './Study.vue'
  import Pagination from '@/components/Pagination/index.vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  // 明显
  const formRef = ref()
  const openStudyRecord = (item) => {
    formRef.value.onOpen(item)
  }

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery } = reactive({
    ...useTable(
      {
        page: courseApi.userCourseRecord
      },
      { courseId: route.query.courseId }
    )
  })
</script>
