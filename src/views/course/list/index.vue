<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item label="课程名称">
            <el-input v-model="query.courseName" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
            <el-button plain type="success" @click="openFormModal()">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" border>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column :width="120" label="封面">
        <template #default="scope">
          <img :alt="scope.row.courseName" :src="scope.row.courseLogo"/>
        </template>
      </el-table-column>
      <el-table-column label="名称/分类-讲师" prop="courseName">
        <template #default="scope">
          <span><a :href="'/course/'+scope.row.id" target="_blank"> {{ scope.row.courseName }}</a></span><br>
          <span>{{ scope.row.categoryName }} - 【{{ scope.row.lecturerName }}】</span>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="价格">
        <template #default="scope">
          <span v-if="scope.row.isFree == 1">免费</span>
          <span v-if="scope.row.isFree == 0">
            ￥{{ scope.row.coursePrice }} <br><span style="text-decoration:line-through;">￥{{ scope.row.rulingPrice }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="购买/学习" prop="countBuy">
        <template #default="scope">
          <span>{{ scope.row.countBuy }} / {{ scope.row.countStudy }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="80" label="排序" prop="courseSort"/>
      <el-table-column :width="80" label="售卖">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.isPutaway === 0 }">{{ putawayEnums()[scope.row.isPutaway] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="80" label="状态">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.statusId === 0 }">{{ statusIdEnums()[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="280" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button plain type="success" @click="courseRecord(scope.row)">数据</el-button>
          <el-button plain type="success" @click="courseChapter(scope.row)">章节</el-button>
          <el-dropdown>
            <el-button> 更多操作
              <el-icon class="el-icon--right">
                <arrow-down/>
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button plain type="primary" @click="openFormModal(scope.row)">编辑</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-if="scope.row.statusId == 0" plain type="success" @click="handleStatus(scope.row)">启用</el-button>
                  <el-button v-if="scope.row.statusId == 1" plain type="danger" @click="handleStatus(scope.row)">禁用</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" :current-page="page.pageCurrent" :page-size="page.pageSize" @pagination="handlePage"/>
    <form-model ref="formRef" @refresh="handlePage"/>
  </div>
</template>

<script setup lang="ts">
import useTable from '@/utils/table';
import {reactive, ref} from 'vue';
import FormModel from './FormModel.vue';
import Pagination from "@/components/Pagination/index.vue";
import {putawayEnums, statusIdEnums} from '@/utils/enum'
import {courseApi} from "@/api/course";

// 添加/修改
const formRef = ref();
const openFormModal = (item?: any) => {
  formRef.value.onOpen(item)
}

// 基础功能
const apis = reactive({
  page: courseApi.coursePage,
  delete: courseApi.courseDelete,
  status: courseApi.courseEdit
})
const {page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus} = reactive({
  ...useTable(apis)
})
</script>
