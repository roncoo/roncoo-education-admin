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
            <upload-file :category-id="query.categoryId" @refresh="handlePage"/>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="table-container">
      <cascader-category :category-type="2" v-model:category-id="query.categoryId" @refresh="handlePage"/>
      <div class="table-main">
        <el-table v-loading="page.loading" :data="page.list" border>
          <el-table-column type="selection" :width="40"/>
          <el-table-column label="资源名称" prop="resourceName">
            <template #default="scope">
              <span>{{ scope.row.resourceName }}</span>
            </template>
          </el-table-column>
          <el-table-column :width="200" label="资源大小" prop="resourceSize">
            <template #default="scope">
              {{ transformSize(scope.row.resourceSize) }} |
              <span v-if="scope.row.resourceType < 3">时长：{{ formatTime(scope.row.videoLength) }}</span>
              <span v-else>{{ scope.row.docPage }} 页</span>
            </template>
          </el-table-column>
          <el-table-column :width="120" label="资源类型" prop="resourceType">
            <template #default="scope">
              <span>{{ getEnumObj('ResourceTypeEnum')[scope.row.resourceType] }}</span>
            </template>
          </el-table-column>
          <el-table-column :width="100" label="资源状态" prop="videoStatus">
            <template #default="scope">
              <span v-if="scope.row.resourceType<3">{{ getEnumObj('VideoStatusEnum')[scope.row.videoStatus] }}</span>
              <span v-else>成功</span>
            </template>
          </el-table-column>
          <el-table-column :width="100" label="平台" prop="vodPlatform">
            <template #default="scope">
              <span v-if="scope.row.resourceType<3">{{ getEnumObj('VodPlatformEnum')[scope.row.vodPlatform] }}</span>
              <span v-else>{{ getEnumObj('StoragePlatformEnum')[scope.row.storagePlatform] }}</span>
            </template>
          </el-table-column>
          <el-table-column :width="230" fixed="right" label="操作" prop="address">
            <template #default="scope">
              <el-button plain type="primary" @click="openFormModal(scope.row)">编辑</el-button>
              <el-button plain type="primary" @click="onPreview(scope.row)">预览</el-button>
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
      </div>
    </div>
    <form-model ref="formRef" @refresh="handlePage"/>
    <preview v-if="resource.visible" :resource-id="resource.resourceId"/>
  </div>
</template>

<script setup lang="ts">
import useTable from '@/utils/table';
import {reactive, ref} from 'vue';
import FormModel from './FormModel.vue';
import Preview from '@/components/Preview/index.vue';
import Pagination from "@/components/Pagination/index.vue";
import {courseApi} from "@/api/course";
import {formatTime, getEnumObj, transformSize} from "@/utils/base";
import CascaderCategory from "@/components/Cascader/Category/index.vue";
import UploadFile from '@/components/Upload/File/index.vue'

// 预览
const resource = reactive({
  visible: false,
  resourceId: ''
})
const onPreview = (item?: any) => {
  resource.visible = true
  resource.resourceId = item.id
}

// 添加/修改
const formRef = ref();
const openFormModal = (item?: any) => {
  formRef.value.onOpen(item)
}

// 基础功能
const {page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus} = reactive({
  ...useTable({
    page: courseApi.resourcePage,
    delete: courseApi.resourceDelete,
    status: courseApi.resourceEdit
  })
})
</script>
<style lang="less" scoped>

.table-container {
  display: flex;
}

.table-main {
  width: calc(100% - 240px);
  min-height: 400px;
}
</style>