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
            <!-- 上传组件 -->
            <!--            <upload-vod :category-id="'0'" @refresh="handlePage"/>-->
            <upload-file @refresh="handlePage"/>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="table-container">
      <div class="table-catalog">
        <div class="table-catalog-title">
          <span>资源目录</span>
          <el-button text link @click="openFormCatalog" style="margin-left: 70px">
            <el-icon>
              <CirclePlus/>
            </el-icon>
          </el-button>
        </div>
        <el-tree
            :data="treeData"
            :props="{ value: 'id',label: 'categoryName',  children: 'childrenList' }"
            node-key="id"
        >
          <template #default="{ node, data }">
            <span><el-icon><Folder/></el-icon></span>
            <span class="table-catalog-name">{{ data.categoryName }}</span>
          </template>
        </el-tree>
      </div>
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
      </div>
    </div>
    <form-model ref="formRef" @refresh="handlePage"/>
    <form-catalog ref="catalogRef" @refresh="handleCatalog"/>
  </div>
</template>

<script setup lang="ts">
import useTable from '@/utils/table';
import {onMounted, reactive, ref} from 'vue';
import FormModel from './FormModel.vue';
import Pagination from "@/components/Pagination/index.vue";
import {courseApi} from "@/api/course";
import {formatTime, getEnumObj, transformSize} from "@/utils/base";
import FormCatalog from "./FormCatalog.vue";
import UploadFile from '@/components/Upload/File/index.vue'

// 上传回调，保存资源


// 添加/修改文件夹
const catalogRef = ref();
const openFormCatalog = (item?: any) => {
  catalogRef.value.onOpen(item)
}

// 列出文件夹
const treeData = ref()
onMounted(() => {
  handleCatalog()
})
const handleCatalog = () => {
  courseApi.categoryList({categoryType: 1}).then((res: any) => {
    treeData.value = res
  })
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
<style lang="less">

.table-catalog {
  float: left;
  display: block;
  min-height: calc(100vh - 180px);
  margin: 0 auto;
  width: 200px;
  border: 1px solid #EBEEF5;

  .table-catalog-title {
    cursor: default;
    padding: 10px 20px;
  }

  .table-catalog-name {
    margin-left: 5px;
  }
}

.table-main {
  float: left;
  width: calc(100% - 240px);
  min-height: 400px;
}
</style>