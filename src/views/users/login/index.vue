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
    <el-table v-loading="page.loading" :data="page.list" border>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="手机号码" prop="moblie"/>
      <el-table-column label="登录IP" prop="loginIp"/>
      <el-table-column label="登录地址" prop="province">
        <template #default="scope">
          {{ scope.row.province }} {{ scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column label="操作系统" prop="os"/>
      <el-table-column label="浏览器" prop="browser"/>
      <el-table-column label="登录时间" prop="gmtCreate"/>
      <el-table-column label="登录状态">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.loginStatus === 0 }">{{ getEnumObj('LoginStatusEnum')[scope.row.loginStatus] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" :current-page="page.pageCurrent" :page-size="page.pageSize" @pagination="handlePage"/>
  </div>
</template>
<script setup lang="ts">
import {reactive} from 'vue';
import {usersApi} from '@/api/users'
import {getEnumObj} from '@/utils/base';
import useTable from "@/utils/table";
import Pagination from "@/components/Pagination/index.vue";

// 基础功能
const {page, handlePage, query, handleQuery, resetQuery} = reactive({
  ...useTable({
    page: usersApi.logLoginPage,
  })
})
</script>
