<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <enum-select v-model="query.appType" :enum-name="'AppTypeEnum'" :title="'请选择应用类型'" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="button_bar">
        <el-button v-permission="'sys:app:save'" type="primary" @click="openFormModal(null)">添加</el-button>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" row-key="id" class="drag-table">
      <el-table-column label="发布时间" prop="publishTime" />
      <el-table-column label="应用类型">
        <template #default="scope">
          <enum-view :enum-name="'AppTypeEnum'" :enum-value="scope.row.appType" />
        </template>
      </el-table-column>
      <el-table-column label="应用版本" prop="appVersion" />
      <el-table-column label="升级类型">
        <template #default="scope">
          <enum-view :enum-name="'UpdateForceEnum'" :enum-value="scope.row.updateForce" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="320">
        <template #default="scope">
          <el-button v-permission="'sys:app:edit'" text type="primary" @click="openFormModal(scope.row)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-dropdown>
            <el-button text type="primary"
              >更多操作
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleStatus(scope.row)">
                  <el-button v-if="scope.row.statusId === 1" v-permission="'sys:app:edit'" text type="primary">禁用</el-button>
                  <el-button v-if="scope.row.statusId === 0" v-permission="'sys:app:edit'" text type="primary">启用</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
              <el-dropdown-item>
                <el-button v-permission="'sys:app:delete'" text type="primary" @click="handleDelete(scope.row)">删除</el-button>
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
    <app-form ref="formRef" @refresh="handlePage" />
  </div>
</template>
<script setup>
  import { systemApi } from '@/api/system'
  import { ref } from 'vue'
  import useTable from '@/utils/table'
  import appForm from './AppForm.vue'
  import Pagination from '@/components/Pagination/index.vue'
  import EnumView from '@/components/Enum/View/index.vue'
  import EnumSelect from '@/components/Enum/Select/index.vue'

  // 添加/修改
  const formRef = ref()
  const openFormModal = (item) => {
    formRef.value.onOpen(item)
  }

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus } = useTable({
    page: systemApi.appPage,
    delete: systemApi.appDelete,
    status: systemApi.appEdit
  })
</script>
