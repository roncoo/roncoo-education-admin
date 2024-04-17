<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-input v-model="query.carouselUrl" placeholder="请输入地址" prefix-icon="Search" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询 </el-button>
            <el-button @click="resetQuery()"> 重置 </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="button_bar">
        <el-button v-permission="'website:carousel:save'" type="primary" @click="openFormModal()">添加轮播</el-button>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" row-key="id" class="drag-table">
      <el-table-column :min-width="120" label="图片">
        <template #default="scope">
          <img :alt="scope.row.carouselTitle" :src="scope.row.carouselImg" style="height: 50px; width: auto" />
        </template>
      </el-table-column>
      <el-table-column :min-width="120" label="地址" prop="carouselUrl">
        <template #default="scope">
          <a :href="scope.row.carouselUrl" target="_blank">{{ scope.row.carouselUrl }}</a>
        </template>
      </el-table-column>
      <el-table-column :min-width="50" label="跳转方式">
        <template #default="scope">
          <enum-view :enum-name="'TargetEnum'" :enum-value="scope.row.carouselTarget" />
        </template>
      </el-table-column>
      <el-table-column :min-width="30" label="状态">
        <template #default="scope">
          <enum-view :enum-name="'StatusIdEnum'" :enum-value="scope.row.statusId" />
        </template>
      </el-table-column>
      <el-table-column :width="210" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button v-permission="'website:carousel:edit'" text type="primary" @click="openFormModal(scope.row)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-dropdown>
            <el-button text type="primary">
              更多操作
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button v-permission="'website:carousel:edit'" v-if="scope.row.statusId == 0" text type="primary" @click="handleStatus(scope.row)"> 启用 </el-button>
                  <el-button v-permission="'website:carousel:edit'" v-if="scope.row.statusId == 1" text type="primary" @click="handleStatus(scope.row)"> 禁用 </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-permission="'website:carousel:delete'" text type="primary" @click="handleDelete(scope.row)"> 删除 </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
    <carousel-form ref="formRef" @refresh="handlePage" />
  </div>
</template>
<script setup>
  import useTable from '@/utils/table'
  import { reactive, ref } from 'vue'
  import { systemApi } from '@/api/system'
  import CarouselForm from './CarouselForm.vue'
  import Pagination from '@/components/Pagination/index.vue'
  import EnumView from '@/components/Enum/View/index.vue'

  // 添加/修改
  const formRef = ref()
  const openFormModal = (item) => {
    formRef.value.onOpen(item)
  }

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus } = reactive({
    ...useTable({
      page: systemApi.carouselPage,
      delete: systemApi.carouselDelete,
      status: systemApi.carouselEdit,
      sort: systemApi.carouselSort
    })
  })
</script>
