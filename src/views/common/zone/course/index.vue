<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-input v-model="query.courseName" placeholder="请输入课程名称" prefix-icon="Search" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="button_bar">
        <el-button type="primary" @click="openFormModal()">添加课程</el-button>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" row-key="id" class="drag-table">
      <el-table-column :min-width="130" label="课程信息">
        <template #default="scope">
          <img :alt="scope.row.courseViewResp.courseName" :src="scope.row.courseViewResp.courseLogo" style="float: left; height: 50px; width: auto; vertical-align: middle; border-radius: 5px" />
          <div style="float: left; margin-left: 10px">
            {{ scope.row.courseViewResp.courseName }}
            <br />
            <span v-if="scope.row.courseViewResp.isFree == 1">免费</span>
            <span v-if="scope.row.courseViewResp.isFree == 0">
              ￥{{ scope.row.courseViewResp.coursePrice }}<span style="text-decoration: line-through; margin-left: 10px">￥{{ scope.row.courseViewResp.rulingPrice }}</span>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :min-width="30" label="售卖">
        <template #default="scope">
          <span :class="{ 'c-special': scope.row.courseViewResp.isPutaway === 0 }">
            <enum-view :enum-name="'PutawayEnum'" :enum-value="scope.row.courseViewResp.isPutaway" />
          </span>
        </template>
      </el-table-column>
      <el-table-column :min-width="30" label="状态">
        <template #default="scope">
          <enum-view :enum-name="'StatusIdEnum'" :enum-value="scope.row.statusId" />
        </template>
      </el-table-column>
      <el-table-column :width="250" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button v-if="scope.row.statusId == 0" text type="primary" @click="handleStatus(scope.row)">启用</el-button>
          <el-button v-if="scope.row.statusId == 1" text type="primary" @click="handleStatus(scope.row)">禁用</el-button>
          <el-divider direction="vertical" />
          <el-button text type="primary" @click="handleDelete(scope.row, '确认要移除当前课程吗？')">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage" />
    <zone-course-form ref="formRef" @refresh="handlePage" />
  </div>
</template>
<script setup>
  import { reactive, ref } from 'vue'
  import { courseApi } from '@/api/course'
  import useTable from '@/utils/table'
  import Pagination from '@/components/Pagination/index.vue'
  import ZoneCourseForm from './ZoneCourseForm.vue'
  import EnumView from '@/components/Enum/View/index.vue'
  import { useRoute } from 'vue-router'
  const route = useRoute()
  // 添加/修改
  const formRef = ref()
  const openFormModal = (item = null) => {
    formRef.value.onOpen(item)
  }

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus } = reactive({
    ...useTable(
      {
        page: courseApi.zoneCoursePage,
        delete: courseApi.zoneCourseDelete,
        status: courseApi.zoneCourseEdit,
        sort: courseApi.zoneCourseSort
      },
      {
        zoneId: route.query.zoneId
      }
    )
  })
</script>
