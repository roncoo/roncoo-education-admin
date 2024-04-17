<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-input v-model="query.roleName" placeholder="请输入角色名称" prefix-icon="Search" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="button_bar">
        <el-button v-permission="'sys:role:save'" type="primary" @click="openFormModal(null)">添加角色</el-button>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list">
      <el-table-column label="角色名称" prop="roleName" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="状态">
        <template #default="scope">
          <enum-view :enum-name="'StatusIdEnum'" :enum-value="scope.row.statusId" />
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" />
      <el-table-column label="操作" width="320">
        <template #default="scope">
          <el-button v-permission="'sys:role:edit'" text type="primary" @click="openFormModal(scope.row)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button v-permission="'sys:role:menu:set'" text type="primary" @click="handSetMenu(scope.row)">分配菜单</el-button>
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
                  <el-button v-permission="'sys:role:edit'" v-if="scope.row.statusId === 1" text type="primary">禁用</el-button>
                  <el-button v-permission="'sys:role:edit'" v-if="scope.row.statusId === 0" text type="primary">启用</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
              <el-dropdown-item>
                <el-button v-permission="'sys:role:delete'" text type="primary" @click="handleDelete(scope.row)">删除</el-button>
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage" />
    <role-form ref="formRef" @refresh="handlePage" />
    <menu-set ref="menuRef" v-if="menuVisible" @refresh="handleMenu"></menu-set>
  </div>
</template>
<script setup>
  import { systemApi } from '@/api/system'
  import { nextTick, reactive, ref } from 'vue'
  import useTable from '@/utils/table'
  import RoleForm from './RoleForm.vue'
  import MenuSet from './MenuSet.vue'
  import Pagination from '@/components/Pagination/index.vue'
  import EnumView from '@/components/Enum/View/index.vue'

  // 设置菜单
  const menuRef = ref()
  const menuVisible = ref(false)
  const handSetMenu = (item) => {
    menuVisible.value = true
    nextTick(() => {
      menuRef.value.onOpen(item)
    })
  }
  const handleMenu = () => {
    menuVisible.value = false
  }
  // 添加/修改
  const formRef = ref()
  const openFormModal = (item) => {
    formRef.value.onOpen(item)
  }

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus } = reactive({
    ...useTable({
      page: systemApi.sysRolePage,
      delete: systemApi.sysRoleDelete,
      status: systemApi.sysRoleEdit
    })
  })
</script>
