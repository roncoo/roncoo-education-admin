<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-button @click="resetQuery()">刷新</el-button>
            <el-button v-permission="'sys:menu:save'" plain type="success" @click="openFormModal(null, '0')">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table :data="page.list" v-loading="page.loading" :tree-props="{ children: 'childrenList', hasChildren: 'hasChildren' }" border row-key="id">
      <el-table-column label="名称" min-width="60" prop="menuName">
        <template #default="scope"> &nbsp;{{ scope.row.menuName }} </template>
      </el-table-column>
      <el-table-column label="类型" min-width="50">
        <template #default="scope">
          <el-tag v-if="scope.row.menuType === 2 && !scope.row.isShow">路由</el-tag>
          <span v-else>{{ getEnumObj('MenuTypeEnum')[scope.row.menuType] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路径/组件" prop="menuUrl">
        <template #default="scope">
          <el-tag v-if="scope.row.path">{{ scope.row.path }}</el-tag>
          <br />
          {{ scope.row.component }}
        </template>
      </el-table-column>
      <el-table-column label="前端权限/后端接口" prop="menuUrl">
        <template #default="scope">
          <el-tag v-if="scope.row.permission">{{ scope.row.permission }}</el-tag>
          <br />
          {{ scope.row.apis }}
        </template>
      </el-table-column>
      <el-table-column label="排序" min-width="50" prop="sort" />
      <el-table-column label="状态" min-width="50">
        <template #default="scope">
          <span :class="{ red: scope.row.statusId === 0 }">{{ getEnumObj('StatusIdEnum')[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template #default="scope">
          <el-button v-permission="'sys:menu:save'" v-if="scope.row.menuType !== 3" plain type="success" @click="openFormModal(null, scope.row.id)">新增</el-button>
          <el-button v-permission="'sys:menu:edit'" plain type="primary" @click="openFormModal(scope.row)">编辑</el-button>
          <el-dropdown>
            <el-button>
              更多操作
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-permission="'sys:menu:edit'">
                  <el-button v-if="scope.row.statusId === 1" plain type="danger" @click="handleStatus(scope.row)">禁用</el-button>
                  <el-button v-if="scope.row.statusId === 0" plain type="success" @click="handleStatus(scope.row)">启用</el-button>
                </el-dropdown-item>
                <el-dropdown-item v-permission="'sys:menu:delete'">
                  <el-button plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <form-model ref="formRef" @refresh="handlePage" />
  </div>
</template>

<script setup>
  import useTable from '@/utils/table'
  import { reactive, ref } from 'vue'
  import FormModel from './FormModel.vue'
  import { systemApi } from '@/api/system'
  import { getEnumObj } from '@/utils/base'

  // 添加/修改
  const formRef = ref()
  const openFormModal = (item, parentId) => {
    formRef.value.onOpen(item, parentId)
  }

  // 基础功能
  const { page, handlePage, query, resetQuery, handleDelete, handleStatus } = reactive({
    ...useTable({
      page: systemApi.sysMenuList,
      delete: systemApi.sysMenuDelete,
      status: systemApi.sysMenuEdit
    })
  })
</script>
