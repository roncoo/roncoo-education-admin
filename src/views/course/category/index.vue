<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-button v-permission="'category:save'" type="primary" @click="openFormModal()">添加分类</el-button>
            <el-button @click="resetQuery()">刷新</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" :tree-props="{ children: 'childrenList' }" row-key="id">
      <el-table-column label="名称" prop="categoryName">
        <template #default="scope">
          <span>{{ scope.row.categoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="排序" prop="sort" />
      <el-table-column :width="100" label="状态">
        <template #default="scope">
          <enum-view :enum-name="'StatusIdEnum'" :enum-value="scope.row.statusId" />
        </template>
      </el-table-column>
      <el-table-column :width="300" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button v-permission="'category:save'" text type="primary" @click="openFormModal(null, scope.row.id)">添加</el-button>
          <el-divider direction="vertical" />
          <el-button v-permission="'category:edit'" text type="primary" @click="openFormModal(scope.row)">编辑</el-button>
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
                  <el-button v-permission="'category:edit'" v-if="scope.row.statusId == 0" text type="primary">启用</el-button>
                  <el-button v-permission="'category:edit'" v-if="scope.row.statusId == 1" text type="primary">禁用</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-permission="'category:delete'" text type="primary" @click="handleDelete(scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <category-form ref="formRef" @refresh="handlePage" />
  </div>
</template>
<script setup>
  import useTable from '@/utils/table'
  import { ref } from 'vue'
  import { courseApi } from '@/api/course'
  import CategoryForm from './CategoryForm.vue'
  import EnumView from '@/components/Enum/View/index.vue'

  // 添加/修改
  const formRef = ref()
  const openFormModal = (item = null, parentId = '') => {
    formRef.value.onOpen(item, parentId)
  }

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus } = useTable({
    page: courseApi.categoryList,
    delete: courseApi.categoryDelete,
    status: courseApi.categoryEdit
  })
</script>
