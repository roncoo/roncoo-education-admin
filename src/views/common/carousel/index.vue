<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
            <el-button plain type="success" @click="openFormModal()">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" border>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="图片">
        <template #default="scope">
          <img :alt="scope.row.carouselTitle" :src="scope.row.carouselImg" style="height:50px;"/>
        </template>
      </el-table-column>
      <el-table-column label="地址" prop="carouselUrl">
        <template #default="scope">
          <a :href="scope.row.carouselUrl" target="_blank">{{ scope.row.carouselUrl }}</a>
        </template>
      </el-table-column>
      <el-table-column :width="120" label="跳转方式">
        <template #default="scope">
          <span>{{ targetEnums()[scope.row.carouselTarget] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="排序" prop="sort"/>
      <el-table-column :width="100" label="状态">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.statusId === 0 }">{{ statusIdEnums()[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="200" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button plain type="primary" @click="openFormModal(scope.row)">编辑</el-button>
          <el-dropdown>
            <el-button> 更多操作
              <el-icon class="el-icon--right">
                <arrow-down/>
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
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
    <pagination :total="page.totalCount" :current-page="page.pageCurrent" :page-size="page.pageSize" @pagination="handlePage"/>
    <form-model ref="formRef" @onReload="handlePage"/>
  </div>
</template>
<script setup lang="ts">
import useTable from '@/utils/table';
import {reactive, ref} from 'vue';
import {systemApi} from '@/api/system'
import FormModel from './FormModel.vue';
import Pagination from "@/components/Pagination/index.vue";
import {statusIdEnums, targetEnums} from '@/utils/enum'

// 添加/修改
const formRef = ref();
const openFormModal = (item?: any) => {
  formRef.value.onOpen(item)
}


// 基础功能
const apis = reactive({
  page: systemApi.carouselPage,
  delete: systemApi.carouselDelete,
  status: systemApi.carouselEdit
})
const {page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus} = reactive({
  ...useTable(apis)
})
</script>
