<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item label="手机号码">
            <el-input v-model="query.mobile" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" border>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="手机号码" prop="mobile"/>
      <el-table-column label="用户头像">
        <template #default="scope">
          <img :alt="scope.row.nickname" :src="scope.row.userHead" style="height:50px;"/>
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" prop="nickname"/>
      <el-table-column label="用户年龄" prop="userAge"/>
      <el-table-column label="用户性别">
        <template #default="scope">
          <span>{{ userSexEnums[scope.row.userSex] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark"/>
      <el-table-column :min-width="120" label="注册时间" prop="gmtCreate"/>
      <el-table-column label="状态">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.statusId === 0 }">{{ statusIdEnums()[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="220" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button plain type="success" @click="userRecord(scope.row)">数据</el-button>
          <el-dropdown>
            <el-button>更多操作
              <el-icon class="el-icon--right">
                <arrow-down/>
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button plain type="primary" @click="openFormModal(scope.row)">编辑</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-if=" scope.row.statusId == 0" plain type="success" @click="handleStatus(scope.row)">启用</el-button>
                  <el-button v-if="scope.row.statusId == 1" plain type="warning" @click="handleStatus(scope.row)">禁用</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" :current-page="page.pageCurrent" :page-size="page.pageSize" @pagination="handlePage"/>
    <form-modal ref="formRef" @onReload="handlePage"/>
  </div>
</template>
<script setup lang="ts">
import useTable from '@/utils/table';
import {onMounted, reactive, ref} from 'vue';

import {usersApi} from '@/api/users'
import {getEnumObj} from '@/utils/base';
import {useRouter} from "vue-router";
import Pagination from "@/components/Pagination/index.vue";
import FormModal from "./FormModel.vue";

// 添加/修改
const formRef = ref();
const openFormModal = (item?: any) => {
  formRef.value.onOpen(item)
};

// 查看数据
const userRecord = function (row: any) {
  useRouter().push({path: '/users/record', query: {userId: row.id}});
}

// 枚举
const statusIdEnums = ref([]);
const userSexEnums = ref([]);
onMounted(() => {
  statusIdEnums.value = getEnumObj('StatusIdEnum');
  userSexEnums.value = getEnumObj('UserSexEnum');
});

// 基础功能
const apis = reactive({
  page: usersApi.usersPage,
  delete: usersApi.usersDelete,
  status: usersApi.usersEdit
})
const {page, handlePage, query, handleQuery, resetQuery, handleStatus} = reactive({
  ...useTable(apis)
})
</script>
