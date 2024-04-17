<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-input v-model="query.zoneName" placeholder="请输入专区名称" prefix-icon="Search" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="button_bar">
        <el-button v-permission="'zone:save'" type="primary" @click="openFormModal()">添加专区</el-button>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" row-key="id" class="drag-table">
      <el-table-column :min-width="100" label="专区名称" prop="zoneName">
        <template #default="scope">
          <span>{{ scope.row.zoneName }}</span
          ><br />
        </template>
      </el-table-column>
      <el-table-column :min-width="100" label="描述" prop="zoneDesc">
        <template #default="scope">
          <span>{{ scope.row.zoneDesc }}</span
          ><br />
        </template>
      </el-table-column>
      <el-table-column :min-width="50" label="状态">
        <template #default="scope">
          <enum-view :enum-name="'StatusIdEnum'" :enum-value="scope.row.statusId" />
        </template>
      </el-table-column>
      <el-table-column :width="220" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button v-permission="'zone:manage'" text type="primary" @click="toCourse(scope.row.id)">课程</el-button>
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
                  <el-button v-permission="'zone:edit'" text type="primary" @click="openFormModal(scope.row)">编辑</el-button>
                </el-dropdown-item>
                <el-dropdown-item @click="handleStatus(scope.row)">
                  <el-button v-permission="'zone:edit'" v-if="scope.row.statusId == 0" text type="primary">启用</el-button>
                  <el-button v-permission="'zone:edit'" v-if="scope.row.statusId == 1" text type="primary">禁用</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-permission="'zone:delete'" text type="primary" @click="handleDelete(scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage" />
    <zone-form ref="formRef" @refresh="handlePage" />
  </div>
</template>
<script setup>
  import { reactive, ref } from 'vue'
  import { courseApi } from '@/api/course'
  import Pagination from '@/components/Pagination/index.vue'
  import useTable from '@/utils/table'
  import ZoneForm from './ZoneForm.vue'
  import { useRouter } from 'vue-router'
  import EnumView from '@/components/Enum/View/index.vue'

  // 进入专区课程列表
  const router = useRouter()
  const toCourse = (zoneId) => {
    router.push({ path: '/common/zone/course', query: { zoneId } })
  }

  // 添加/修改
  const formRef = ref()
  const openFormModal = (item) => {
    formRef.value.onOpen(item)
  }

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus } = reactive({
    ...useTable({
      page: courseApi.zonePage,
      delete: courseApi.zoneDelete,
      status: courseApi.zoneEdit,
      sort: courseApi.zoneSort
    })
  })
</script>
