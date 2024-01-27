<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-button plain type="success" @click="openFormModal()">课程添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" :tree-props="{ children: 'periodViewRespList' }" border default-expand-all row-key="id">
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column :width="100" label="封面">
        <template #default="scope">
          <img :alt="scope.row.courseViewResp.courseName" :src="scope.row.courseViewResp.courseLogo"/>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="courseName">
        <template #default="scope">
          <span>{{ scope.row.courseViewResp.courseName }}</span><br>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="价格">
        <template #default="scope">
          <span v-if="scope.row.courseViewResp.isFree == 1">免费</span>
          <span v-if="scope.row.courseViewResp.isFree == 0">
            ￥{{ scope.row.courseViewResp.coursePrice }} <br><span style="text-decoration:line-through;">￥{{ scope.row.courseViewResp.rulingPrice }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="售卖">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.courseViewResp.isPutaway === 0 }">{{ putawayEnums()[scope.row.courseViewResp.isPutaway] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="排序" prop="sort"/>
      <el-table-column :width="100" label="状态">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.statusId === 0 }">{{ statusIdEnums()[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="250" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button plain type="primary" @click="openFormModal(scope.row)">排序</el-button>
          <el-button v-if="scope.row.statusId == 0" plain type="success" @click="handleStatus(scope.row)">启用</el-button>
          <el-button v-if="scope.row.statusId == 1" plain type="danger" @click="handleStatus(scope.row)">禁用</el-button>
          <el-button plain type="danger" @click="tableDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" :current-page="page.pageCurrent" :page-size="page.pageSize" @pagination="handlePage"/>
    <form-model ref="formRef" @onReload="handlePage"/>
  </div>
</template>
<script setup lang="ts">
import {reactive, ref} from 'vue';
import {courseApi} from '@/api/course'
import useTable from '@/utils/table.js';
import {putawayEnums, statusIdEnums} from "../../../../utils/enum";


// 添加/修改
const formRef = ref();
const openFormModal = (item?: any) => {
  formRef.value.onOpen(item)
}

// 基础功能
const apis = reactive({
  page: courseApi.zoneCoursePage,
  delete: courseApi.zoneCourseDelete,
  status: courseApi.zoneCourseEdit
})
const {page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus} = reactive({
  ...useTable(apis)
})
</script>
