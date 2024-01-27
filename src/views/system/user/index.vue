<template>
  <div class="app-container">
    <el-form :model="query" class="filter-container" inline label-width="80px">
      <el-form-item class="filter-item" label="登录账号">
        <el-input v-model="query.mobile" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="resetQuery">刷新</el-button>
        <el-button plain type="success" @click="openFormModal()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="page.loading" :data="page.list" border>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="登录账号" prop="mobile"/>
      <el-table-column label="用户昵称" prop="realName"/>
      <el-table-column label="所属角色">
        <template #default="scope">
          <el-tag v-for="(i, index) in scope.row.roleNameList" :key="index" style="margin: 4px">{{ i }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark"/>
      <el-table-column label="状态">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.statusId === 0 }">{{ statusIdEnums()[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort"/>
      <el-table-column label="操作" width="240">
        <template #default="scope">
          <el-button plain type="warning" @click="handleAllocation(scope.row.id)">角色分配</el-button>
          <el-dropdown style="margin-left: 10px">
            <el-button> 更多操作<i class="el-icon-arrow-down"/></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button plain type="primary" @click="openFormModal(scope.row)">编辑</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button plain type="warning" @click="handleUpdatePassword(scope.row.id)">密码</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-if="scope.row.statusId === 0 " plain type="success" @click="handleStatus(scope.row)">启用</el-button>
                  <el-button v-if="scope.row.statusId === 1 " plain type="danger" @click="handleStatus(scope.row)">禁用</el-button>
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
    <form-modal ref="formRef" @onReload="handlePage"/>
</template>

<script setup lang="ts">
import {systemApi} from '@/api/system';
import Pagination from '@/components/Pagination/index.vue';
import {reactive, ref} from "vue";
import useTable from "@/utils/table";
import FormModal from "./FormModel.vue";
import {statusIdEnums} from "@/utils/enum";


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
