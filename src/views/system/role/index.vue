<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="query.roleName" clearable/>
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
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="角色名称" prop="roleName"/>
      <el-table-column label="备注" prop="remark"/>
      <el-table-column label="状态">
        <template #default="scope">
          <span :class="{'c-danger': scope.row.statusId === 0}">{{ statusIdEnums()[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort"/>
      <el-table-column label="操作" width="360">
        <template #default="scope">
          <el-button plain type="primary" @click="openFormModal(scope.row)">编辑</el-button>
          <el-button plain type="warning" @click="handleSettRow(scope.row)">分配菜单</el-button>
          <el-button v-if="scope.row.statusId ===1 " plain type="danger" @click="handleStatus(scope.row)">禁用</el-button>
          <el-button v-if="scope.row.statusId ===0 " plain type="success" @click="handleStatus(scope.row)">启用</el-button>
          <el-button plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" :current-page="page.pageCurrent" :page-size="page.pageSize" @pagination="handlePage"/>
    <form-modal ref="formRef" @onReload="handlePage"/>
  </div>
</template>

<script setup lang="ts">
import {systemApi} from '@/api/system.js'
import {reactive, ref} from 'vue';
import useTable from '@/utils/table.js';
import {statusIdEnums} from "@/utils/enum";
import FormModal from "./FormModel.vue";
import Pagination from "@/components/Pagination/index.vue";

// 添加/修改
const formRef = ref();
const openFormModal = (item?: any) => {
  formRef.value.onOpen(item)
}

// 基础功能
const apis = reactive({
  page: systemApi.sysRolePage,
  delete: systemApi.sysRoleDelete,
  status: systemApi.sysRoleEdit
})
const {page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus} = reactive({
  ...useTable(apis)
})
</script>
