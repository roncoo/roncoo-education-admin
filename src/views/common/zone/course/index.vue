<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item label="课程名称">
            <el-input v-model="query.courseName" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
            <el-button plain type="success" @click="openFormModal()">课程添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" :tree-props="{ children: 'periodViewRespList' }" border default-expand-all row-key="id">
      <el-table-column align="center" label="序号" type="index" width="60" />
      <el-table-column :width="100" label="封面">
        <template #default="scope">
          <img :alt="scope.row.courseViewResp.courseName" :src="scope.row.courseViewResp.courseLogo" />
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="courseName">
        <template #default="scope">
          <span>{{ scope.row.courseViewResp.courseName }}</span
          ><br />
        </template>
      </el-table-column>
      <el-table-column :width="100" label="价格">
        <template #default="scope">
          <span v-if="scope.row.courseViewResp.isFree == 1">免费</span>
          <span v-if="scope.row.courseViewResp.isFree == 0">
            ￥{{ scope.row.courseViewResp.coursePrice }} <br /><span style="text-decoration: line-through">￥{{ scope.row.courseViewResp.rulingPrice }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="售卖">
        <template #default="scope">
          <span :class="{ 'c-special': scope.row.courseViewResp.isPutaway === 0 }">{{ getEnumObj('PutawayEnum')[scope.row.courseViewResp.isPutaway] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="排序" prop="sort" />
      <el-table-column :width="100" label="状态">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.statusId === 0 }">{{ getEnumObj('StatusIdEnum')[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="250" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button plain type="primary" @click="openFormModal(scope.row)">排序</el-button>
          <el-button v-if="scope.row.statusId == 0" plain type="success" @click="handleStatus(scope.row)">启用</el-button>
          <el-button v-if="scope.row.statusId == 1" plain type="danger" @click="handleStatus(scope.row)">禁用</el-button>
          <el-button plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage" />
    <form-model ref="formRef" @refresh="handlePage" />
  </div>
</template>
<script setup>
  import { reactive, ref } from 'vue'
  import { courseApi } from '@/api/course'
  import useTable from '@/utils/table'
  import { getEnumObj } from '@/utils/base'
  import Pagination from '@/components/Pagination/index.vue'
  import FormModel from './FormModel.vue'

  // 添加/修改
  const formRef = ref()
  const openFormModal = (item = null) => {
    formRef.value.onOpen(item)
  }

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus } = reactive({
    ...useTable({
      page: courseApi.zoneCoursePage,
      delete: courseApi.zoneCourseDelete,
      status: courseApi.zoneCourseEdit
    })
  })
</script>
