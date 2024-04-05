<template>
  <div class="comment">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-input v-model="query.commentText" placeholder="请输入评论内容" prefix-icon="Search" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list">
      <el-table-column label="用户手机" min-width="20" prop="mobile" />
      <el-table-column label="用户昵称" min-width="20" prop="nickname" />
      <el-table-column label="内容" prop="commentText" />
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button type="primary" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage" />
  </div>
</template>
<script setup>
  import { reactive } from 'vue'

  import { courseApi } from '@/api/course'
  import { useRoute } from 'vue-router/dist/vue-router'
  import Pagination from '@/components/Pagination/index.vue'
  import useTable from '@/utils/table'

  const route = useRoute()
  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery, handleDelete } = reactive({
    ...useTable(
      {
        page: courseApi.userCourseComment,
        delete: courseApi.courseCommentDelete
      },
      { courseId: route.query.courseId }
    )
  })
</script>
