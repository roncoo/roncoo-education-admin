<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
            <el-button plain type="success" @click="openFormModal(null, '0')">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table :data="page.list" v-loading="page.loading" :tree-props="{ children: 'childrenList', hasChildren: 'hasChildren' }" border row-key="id">
      <el-table-column label="名称" min-width="250" prop="menuName">
        <template #default="scope">
          &nbsp;{{ scope.row.menuName }}
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template #default="scope">
          {{ getEnumObj('MenuTypeEnum')[scope.row.menuType] }}
        </template>
      </el-table-column>
      <el-table-column label="路径/组件" min-width="150" prop="menuUrl">
        <template #default="scope">
          {{ scope.row.path }}<br>
          {{ scope.row.component }}
        </template>
      </el-table-column>
      <el-table-column label="前端权限" min-width="100" prop="menuUrl">
        <template #default="scope">
          {{ scope.row.permission }}
        </template>
      </el-table-column>
      <el-table-column label="后端接口" min-width="150" prop="menuUrl">
        <template #default="scope">
          {{ scope.row.apis }}
        </template>
      </el-table-column>
      <el-table-column label="属性">
        <template #default="scope">
          <span v-if="scope.row.menuType==2 && scope.row.isShow">菜单</span>
          <span v-if="scope.row.menuType==2 && !scope.row.isShow">路由</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="statusId">
        <template #default="scope">
          <span :class="{ red: scope.row.statusId === 0 }">{{ getEnumObj('StatusIdEnum')[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort"/>
      <el-table-column label="操作" width="320">
        <template #default="scope">
          <el-button v-if="scope.row.menuType !== 3" plain type="success" @click="openFormModal(null,scope.row.id)">新增</el-button>
          <el-button plain type="primary" @click="openFormModal(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.statusId === 1" plain type="danger" @click="handleStatus(scope.row)">禁用</el-button>
          <el-button v-if="scope.row.statusId === 0" plain type="success" @click="handleStatus(scope.row)">启用</el-button>
          <el-button plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <form-model ref="formRef" @refresh="handlePage"/>
  </div>
</template>

<script setup lang="ts">
import useTable from '@/utils/table';
import {reactive, ref} from 'vue';
import FormModel from "./FormModel.vue";
import {systemApi} from '@/api/system';
import {getEnumObj} from "@/utils/base";

// 添加/修改
const formRef = ref();
const openFormModal = (item?: any, parentId?: string) => {
  formRef.value.onOpen(item, parentId)
}

// 基础功能
const apis = reactive({
  page: systemApi.sysMenuList,
  delete: systemApi.sysMenuDelete,
  status: systemApi.sysMenuEdit
})
const {page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus} = reactive({
  ...useTable(apis)
})
</script>