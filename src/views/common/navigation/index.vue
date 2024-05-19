<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-input v-model="query.navTitle" placeholder="请输入导航名称" prefix-icon="Search" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="button_bar">
        <el-button v-permission="'website:nav:save'" type="primary" @click="openFormModal()">添加导航</el-button>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" row-key="id" class="drag-table">
      <el-table-column :min-width="100" label="名称" prop="navTitle" />
      <el-table-column :min-width="100" label="导航地址" prop="navUrl">
        <template #default="scope">
          <el-link type="primary" :href="scope.row.navUrl" target="_blank">{{ scope.row.navUrl }}</el-link>
        </template>
      </el-table-column>
      <el-table-column :min-width="50" label="跳转方式">
        <template #default="scope">
          <enum-view :enum-name="'TargetEnum'" :enum-value="scope.row.navTarget" />
        </template>
      </el-table-column>
      <el-table-column :min-width="30" label="状态">
        <template #default="scope">
          <enum-view :enum-name="'StatusIdEnum'" :enum-value="scope.row.statusId" />
        </template>
      </el-table-column>
      <el-table-column :width="210" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button v-permission="'website:nav:edit'" text type="primary" @click="openFormModal(scope.row)">编辑</el-button>
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
                <el-dropdown-item @click="handleStatus(scope.row)">
                  <el-button v-if="scope.row.statusId == 0" v-permission="'website:nav:edit'" text type="primary">启用</el-button>
                  <el-button v-if="scope.row.statusId == 1" v-permission="'website:nav:edit'" text type="primary">禁用</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-permission="'website:nav:delete'" text type="primary" @click="handleDelete(scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
    <navigation-form ref="formRef" @refresh="handlePage" />
  </div>
</template>
<script setup>
  import useTable from '@/utils/table'
  import { ref } from 'vue'
  import { systemApi } from '@/api/system'
  import Pagination from '@/components/Pagination/index.vue'
  import NavigationForm from './NavigationForm.vue'
  import EnumView from '@/components/Enum/View/index.vue'

  // 添加/修改
  const formRef = ref()
  const openFormModal = (item) => {
    formRef.value.onOpen(item)
  }

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus } = useTable({
    page: systemApi.navPage,
    delete: systemApi.navDelete,
    status: systemApi.navEdit,
    sort: systemApi.navSort
  })
</script>
