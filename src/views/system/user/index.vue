<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-input v-model="query.mobile" placeholder="请输入登录账号" prefix-icon="Search" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="button_bar">
        <el-button v-permission="'sys:user:save'" type="primary" @click="openFormModal()">添加账号</el-button>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" row-key="id" class="drag-table">
      <el-table-column label="登录账号" prop="mobile" />
      <el-table-column label="用户昵称" prop="realName" />
      <el-table-column label="所属角色">
        <template #default="scope">
          <el-tag v-for="(i, index) in scope.row.roleNameList" :key="index" style="margin: 4px">{{ i }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="状态">
        <template #default="scope">
          <enum-view :enum-name="'StatusIdEnum'" :enum-value="scope.row.statusId" />
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="320">
        <template #default="scope">
          <el-button v-permission="'sys:user:edit'" text type="primary" @click="openFormModal(scope.row)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button v-permission="'sys:user:role:set'" text type="primary" @click="openRoleModal(scope.row)">角色分配</el-button>
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
                  <el-button v-permission="'sys:user:password'" text type="primary" @click="openPasswordModal(scope.row)">密码</el-button>
                </el-dropdown-item>
                <el-dropdown-item @click="handleStatus(scope.row)">
                  <el-button v-permission="'sys:user:edit'" v-if="scope.row.statusId === 0" text type="primary">启用</el-button>
                  <el-button v-permission="'sys:user:edit'" v-if="scope.row.statusId === 1" text type="primary">禁用</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-permission="'sys:user:delete'" text type="primary" @click="handleDelete(scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage" />
    <user-form ref="formRef" @refresh="handlePage" />
    <password ref="passwordRef" @refresh="handlePage" />
    <role-set ref="roleRef" v-if="roleVisible" @refresh="handleRole" />
  </div>
</template>

<script setup>
  import { systemApi } from '@/api/system'
  import Pagination from '@/components/Pagination/index.vue'
  import { nextTick, ref } from 'vue'
  import useTable from '@/utils/table'
  import UserForm from './UserForm.vue'
  import Password from './Password.vue'
  import RoleSet from './RoleSet.vue'
  import EnumView from '@/components/Enum/View/index.vue'

  // 角色分配
  const roleRef = ref()
  const roleVisible = ref(false)
  const openRoleModal = (item) => {
    roleVisible.value = true
    nextTick(() => {
      roleRef.value.onOpen(item)
    })
  }
  const handleRole = () => {
    roleVisible.value = false
    handlePage()
  }

  // 密码重置
  const passwordRef = ref()
  const openPasswordModal = (item) => {
    passwordRef.value.onOpen(item)
  }

  // 添加/修改
  const formRef = ref()
  const openFormModal = (item) => {
    formRef.value.onOpen(item)
  }

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus } = useTable({
    page: systemApi.sysUserPage,
    delete: systemApi.sysUserDelete,
    status: systemApi.sysUserEdit,
    sort: systemApi.sysUserSort
  })
</script>
