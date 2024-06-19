<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <enum-select v-model="query.loginClient" :enum-name="'LoginClientEnum'" :title="'请选择登录客户端'" />
          </el-form-item>
          <el-form-item>
            <enum-select v-model="query.loginType" :enum-name="'LoginTypeEnum'" :title="'请选择登录方式'" />
          </el-form-item>
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
      <el-table-column label="登录客户端">
        <template #default="scope">
          <enum-view :enum-name="'LoginClientEnum'" :enum-value="scope.row.loginClient" />
        </template>
      </el-table-column>
      <el-table-column label="登录方式">
        <template #default="scope">
          <enum-view :enum-name="'LoginTypeEnum'" :enum-value="scope.row.loginType" />
        </template>
      </el-table-column>
      <el-table-column label="操作系统" prop="os" />
      <el-table-column label="浏览器" prop="browser" />
      <el-table-column label="动作">
        <template #default="scope">
          <enum-view :enum-name="'LoginStatusEnum'" :enum-value="scope.row.loginStatus" />
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="gmtCreate" :min-width="100" />
    </el-table>
    <pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
  </div>
</template>
<script setup>
  import { usersApi } from '@/api/users'
  import EnumView from '@/components/Enum/View/index.vue'
  import useTable from '@/utils/table'
  import Pagination from '@/components/Pagination/index.vue'
  import EnumSelect from '@/components/Enum/Select/index.vue'

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery } = useTable({
    page: usersApi.logLoginPage
  })
</script>
