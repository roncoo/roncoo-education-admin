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
    </div>
    <el-table v-loading="page.loading" :data="page.list">
      <el-table-column :min-width="60" label="登录账号" prop="mobile" />
      <el-table-column :min-width="50" label="真实姓名" prop="realName" />
      <el-table-column :min-width="120" label="操作">
        <template #default="scope">
          {{ scope.row.operation }}
          <el-button v-if="scope.row.content" text type="primary" @click="handleView(scope.row)">
            <el-icon :size="20"><Document /></el-icon>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :min-width="120" label="请求接口" prop="path" />
      <el-table-column :min-width="60" label="登录IP" prop="loginIp" />
      <el-table-column :min-width="60" label="登录地址" prop="province">
        <template #default="scope"> {{ scope.row.province }} {{ scope.row.city }} </template>
      </el-table-column>
      <el-table-column :min-width="100" label="时间" prop="gmtCreate" />
    </el-table>
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage" />
    <log-view ref="formRef" />
  </div>
</template>
<script setup>
  import { reactive, ref } from 'vue'
  import { systemApi } from '@/api/system'
  import useTable from '@/utils/table'
  import Pagination from '@/components/Pagination/index.vue'
  import LogView from './LogView.vue'

  // 添加/修改
  const formRef = ref()
  const handleView = (item) => {
    formRef.value.onOpen(item)
  }

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery } = reactive({
    ...useTable({
      page: systemApi.sysLogPage
    })
  })
</script>
