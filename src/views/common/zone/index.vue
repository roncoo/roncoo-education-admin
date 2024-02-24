<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item label="专区名称">
            <el-input v-model="query.zoneName" clearable />
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
      <el-table-column align="center" label="序号" type="index" width="60" />
      <el-table-column label="专区名称" prop="zoneName">
        <template #default="scope">
          <span>{{ scope.row.zoneName }}</span
          ><br />
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="zoneDesc">
        <template #default="scope">
          <span>{{ scope.row.zoneDesc }}</span
          ><br />
        </template>
      </el-table-column>
      <el-table-column :width="100" label="排序" prop="sort" />
      <el-table-column :width="100" label="状态">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.statusId === 0 }">{{ getEnumObj('StatusIdEnum')[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="210" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button plain type="success" @click="toCourse(scope.row.id)">课程</el-button>
          <el-dropdown>
            <el-button>
              更多操作
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button plain type="primary" @click="openFormModal(scope.row)">编辑</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-if="scope.row.statusId == 0" plain type="success" @click="handleStatus(scope.row)">启用</el-button>
                  <el-button v-if="scope.row.statusId == 1" plain type="danger" @click="handleStatus(scope.row)">禁用</el-button>
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
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage" />
    <form-model ref="formRef" @refresh="handlePage" />
  </div>
</template>
<script setup>
  import { reactive, ref } from 'vue'
  import { courseApi } from '@/api/course'
  import Pagination from '@/components/Pagination/index.vue'
  import useTable from '@/utils/table'
  import FormModel from './FormModel.vue'
  import { useRouter } from 'vue-router'
  import { getEnumObj } from '@/utils/base'

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
      status: courseApi.zoneEdit
    })
  })
</script>
