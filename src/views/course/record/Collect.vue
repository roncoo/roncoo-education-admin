<template>
  <div class="collect">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" border>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="用户手机" min-width="20" prop="mobile"/>
      <el-table-column label="用户昵称" min-width="20" prop="nickname"/>
      <el-table-column label="收藏时间" min-width="30" prop="gmtCreate"/>
    </el-table>
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage"/>
  </div>
</template>
<script setup>
import useTable from '@/utils/table';
import {reactive} from 'vue';
import {courseApi} from '@/api/course'
import {useRoute} from 'vue-router/dist/vue-router';
import Pagination from '@/components/Pagination/index.vue';

const route = useRoute()
// 基础功能
const {page, handlePage, query, handleQuery, resetQuery} = reactive({
  ...useTable({
    page: courseApi.userCourseCollect,
  }, {courseId: route.query.courseId})
})
</script>