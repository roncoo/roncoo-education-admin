<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list">
      <el-table-column label="手机号码" prop="mobile" />
      <el-table-column label="登录IP" prop="loginIp" />
      <el-table-column label="登录地址" prop="province">
        <template #default="scope"> {{ scope.row.province }} {{ scope.row.city }} </template>
      </el-table-column>
      <el-table-column label="操作系统" prop="os" />
      <el-table-column label="浏览器" prop="browser" />
      <el-table-column label="登录时间" prop="gmtCreate" />
      <el-table-column label="登录状态">
        <template #default="scope">
          <enum-view :enum-name="'LoginStatusEnum'" :enum-value="scope.row.loginStatus" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
  </div>
</template>
<script setup>
  import { usersApi } from '@/api/users'
  import EnumView from '@/components/Enum/View/index.vue'
  import useTable from '@/utils/table'
  import Pagination from '@/components/Pagination/index.vue'

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery } = useTable({
    page: usersApi.logLoginPage
  })
</script>
