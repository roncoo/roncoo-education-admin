<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item label="登录账号">
            <el-input v-model="query.mobile" clearable/>
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
      <el-table-column align="center" label="序号" type="index" :width="60"/>
      <el-table-column label="登录账号" prop="mobile"/>
      <el-table-column label="用户昵称" prop="realName"/>
      <el-table-column label="所属角色">
        <template #default="scope">
          <el-tag v-for="(i, index) in scope.row.roleNameList" :key="index" style="margin: 4px">{{ i }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark"/>
      <el-table-column label="状态">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.statusId === 0 }">{{ getEnumObj('StatusIdEnum')[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort"/>
      <el-table-column label="操作" :width="320">
        <template #default="scope">
          <el-button plain type="primary" @click="openFormModal(scope.row)">编辑</el-button>
          <el-button plain type="warning" @click="openRoleModal(scope.row)">角色分配</el-button>
          <el-dropdown style="margin-left: 10px">
            <el-button> 更多操作
              <el-icon class="el-icon--right">
                <arrow-down/>
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button plain type="warning" @click="openPasswordModal(scope.row)">密码</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-if="scope.row.statusId === 0 " plain type="success" @click="handleStatus(scope.row)">启用</el-button>
                  <el-button v-if="scope.row.statusId === 1 " plain type="danger" @click="handleStatus(scope.row)">禁用</el-button>
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
    <form-modal ref="formRef" @refresh="handlePage"/>
    <password ref="passwordRef" @refresh="handlePage"/>
    <role-set ref="roleRef" v-if="roleVisible" @refresh="handleRole"/>
  </div>
</template>

<script setup lang="ts">
import {systemApi} from '@/api/system';
import Pagination from '@/components/Pagination/index.vue';
import {nextTick, reactive, ref} from "vue";
import useTable from "@/utils/table";
import FormModal from "./FormModel.vue";
import Password from "./Password.vue";
import RoleSet from "./RoleSet.vue";
import {getEnumObj} from "@/utils/base";

// 角色分配
const roleRef = ref();
const roleVisible = ref(false);
const openRoleModal = (item?: any) => {
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
const passwordRef = ref();
const openPasswordModal = (item?: any) => {
  passwordRef.value.onOpen(item)
}

// 添加/修改
const formRef = ref();
const openFormModal = (item?: any) => {
  formRef.value.onOpen(item)
}

// 基础功能
const {page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus} = reactive({
  ...useTable({
    page: systemApi.sysUserPage,
    delete: systemApi.sysUserDelete,
    status: systemApi.sysUserEdit
  })
})
</script>
