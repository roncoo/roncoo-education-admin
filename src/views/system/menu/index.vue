<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-input v-model="query.menuName" placeholder="请输入菜单名称" prefix-icon="Search" clearable />
          </el-form-item>
          <el-form-item>
            <el-button @click="resetQuery()">刷新</el-button>
            <el-button v-permission="'sys:menu:save'" type="success" @click="openFormModal(null, '0')">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table :data="page.list" v-loading="page.loading" :tree-props="{ children: 'childrenList', hasChildren: 'hasChildren' }" row-key="id">
      <el-table-column label="名称" min-width="60" prop="menuName">
        <template #default="scope">
          <span v-if="scope.row.menuIcon"><icon :name="scope.row.menuIcon" class="menu-icon" /> </span> &nbsp;{{ scope.row.menuName }}
        </template>
      </el-table-column>
      <el-table-column label="类型" min-width="50">
        <template #default="scope">
          <el-tag v-if="scope.row.menuType === 2 && !scope.row.isShow">路由</el-tag>
          <enum-view v-else :enum-name="'MenuTypeEnum'" :enum-value="scope.row.menuType" />
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
          <enum-view :enum-name="'StatusIdEnum'" :enum-value="scope.row.statusId" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template #default="scope">
          <el-button v-permission="'sys:menu:save'" v-if="scope.row.menuType !== 3" text type="primary" @click="openFormModal(null, scope.row.id)">新增</el-button>
          <el-divider direction="vertical" />
          <el-button v-permission="'sys:menu:edit'" text type="primary" @click="openFormModal(scope.row)">编辑</el-button>
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
                  <el-button v-permission="'sys:menu:edit'" v-if="scope.row.statusId === 0" text type="primary">启用</el-button>
                  <el-button v-permission="'sys:menu:edit'" v-if="scope.row.statusId === 1" text type="primary">禁用</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-permission="'sys:menu:delete'" text type="primary" @click="handleDelete(scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <menu-form ref="formRef" @refresh="handlePage" />
  </div>
</template>

<script setup>
  import useTable from '@/utils/table'
  import { reactive, ref } from 'vue'
  import MenuForm from './MenuForm.vue'
  import { systemApi } from '@/api/system'
  import EnumView from '@/components/Enum/View/index.vue'

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
