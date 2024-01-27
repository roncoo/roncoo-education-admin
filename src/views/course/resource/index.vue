<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item label="资源名称">
            <el-input v-model="query.resourceName" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
            <uploader-btn :plain="false" btn-text="上传" class="mgl10" icon="" mode="async"/>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" border>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="资源名称" prop="resourceName">
        <template #default="scope">
          <span>{{ scope.row.resourceName }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="200" label="资源大小" prop="resourceSize">
        <template #default="scope">
          {{ formatSize(scope.row.resourceSize) }} |
          <span v-if="scope.row.resourceType < 3">时长：{{ formatTime(scope.row.videoLength) }}</span>
          <span v-else>{{ scope.row.docPage }} 页</span>
        </template>
      </el-table-column>
      <el-table-column :width="120" label="资源类型" prop="resourceType">
        <template #default="scope">
          <span>{{ resourceTypeEnums()[scope.row.resourceType] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="资源状态" prop="videoStatus">
        <template #default="scope">
          <span v-if="scope.row.resourceType<3">{{ videoStatusEnums()[scope.row.videoStatus] }}</span>
          <span v-else>成功</span>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="平台" prop="vodPlatform">
        <template #default="scope">
          <span v-if="scope.row.resourceType<3">{{ vodPlatformEnums()[scope.row.vodPlatform] }}</span>
          <span v-else>{{ storagePlatformEnums()[scope.row.storagePlatform] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="80" label="排序" prop="sort"/>
      <el-table-column :width="80" label="状态">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.statusId === 0 }">{{ statusIdEnums()[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="210" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button plain type="primary" @click="openFormModal(scope.row)">编辑
          </el-button>
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
    <pagination :total="page.totalCount" :current-page="page.pageCurrent" :page-size="page.pageSize" @pagination="handlePage"/>
    <form-model ref="formRef" @onReload="handlePage"/>
  </div>
</template>

<script setup lang="ts">
import useTable from '@/utils/table';
import {reactive, ref} from 'vue';
import FormModel from './FormModel.vue';
import Pagination from "@/components/Pagination/index.vue";
import {resourceTypeEnums, statusIdEnums, storagePlatformEnums, videoStatusEnums, vodPlatformEnums} from '@/utils/enum'
import {courseApi} from "@/api/course";
import {formatSize, formatTime} from "@/utils/base";

// 添加/修改
const formRef = ref();
const openFormModal = (item?: any) => {
  formRef.value.onOpen(item)
}

// 基础功能
const apis = reactive({
  page: courseApi.resourcePage,
  delete: courseApi.resourceDelete,
  status: courseApi.resourceEdit
})
const {page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus} = reactive({
  ...useTable(apis)
})
</script>