<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-button plain type="success" @click="openFormModal(editForm)">章添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" :tree-props="{ children: 'periodViewRespList' }" border default-expand-all row-key="id">
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="章节名称" prop="chapterName">
        <template #default="scope">
          <span>{{ scope.row.chapterName }}</span>
          <span>{{ scope.row.periodName }}</span>
          <span v-if="scope.row.resourceViewResp"> 【{{ getEnumObj('ResourceTypeEnum')[scope.row.resourceViewResp.resourceType] }}：{{ scope.row.resourceViewResp.resourceName }} |
            <span v-if="scope.row.resourceViewResp.resourceType<3">{{ transformSize(scope.row.resourceViewResp.videoLength) }}</span>
            <span v-else>{{ scope.row.resourceViewResp.docPage }} 页</span> 】
          </span>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="排序" prop="sort"/>
      <el-table-column :width="100" label="收费">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.isFree === 0 }">{{ getEnumObj('FreeEnum')[scope.row.isFree] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="300" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button v-if="scope.row.periodName" plain type="primary" @click="openFormPeriodModal(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.chapterName" plain type="primary" @click="openFormModal(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.chapterName" plain type="success" @click="openFormPeriodModal(null, scope.row.chapterId)">节添加</el-button>
          <el-dropdown>
            <el-button> 更多操作
              <el-icon class="el-icon--right">
                <arrow-down/>
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
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
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage"/>
    <form-model ref="formRef" @refresh="handlePage"/>
    <period ref="formPeriodRef" @refresh="handlePage"/>
  </div>
</template>
<script setup lang="ts">
import {reactive, ref} from 'vue';
import Pagination from "@/components/Pagination/index.vue";
import useTable from "@/utils/table";
import {courseApi} from "@/api/course";
import {getEnumObj, transformSize} from "@/utils/base";
import FormModel from "./FormModel.vue";
import Period from "./Period.vue";

// 节添加修改
const formPeriodRef = ref();
const openFormPeriodModal = (item?: any, chapterId?: number) => {
  formPeriodRef.value.onOpen(item, chapterId)
}

// 添加/修改
const formRef = ref();
const openFormModal = (item?: any) => {
  formRef.value.onOpen(item)
}

// 基础功能
const {page, handlePage, query, handleDelete, handleStatus} = reactive({
  ...useTable({
    page: courseApi.courseChapterPage,
    delete: courseApi.courseChapterDelete,
    status: courseApi.courseChapterEdit
  })
})
</script>
