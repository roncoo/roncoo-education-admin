<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item label="订单号">
            <el-input v-model="query.orderNo" clearable/>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="query.mobile" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()">查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" border>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column :width="180" label="订单号">
        <template #default="scope">
          {{ scope.row.orderNo }}
        </template>
      </el-table-column>
      <el-table-column label="课程信息">
        <template #default="scope">
          {{ scope.row.courseViewVO.courseName }}
        </template>
      </el-table-column>
      <el-table-column :width="150" label="手机号码" prop="mobile"/>
      <el-table-column :width="160" label="支付方式/时间">
        <template #default="scope">
          <span>{{ payTypeEnumEnums[scope.row.payType] }}</span>
          <br>
          <span v-if="scope.row.orderStatus === 2">{{ scope.row.payTime }}</span>
          <span v-else>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="订单状态">
        <template #default="scope">
          <span>{{ orderStatusEnums()[scope.row.orderStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="价格">
        <template #default="scope">
          <span v-if="scope.row.coursePrice == 0">免费</span>
          <span v-else>
            ￥{{ scope.row.coursePrice }} <br><span style="text-decoration:line-through;">￥{{ scope.row.rulingPrice }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="客户/备注" prop="remarkCus">
        <template #default="scope">
          {{ scope.row.remarkCus }}<br>
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column :width="100" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button plain type="primary" @click="openFormModal(scope.row)">备注</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" :current-page="page.pageCurrent" :page-size="page.pageSize" @pagination="handlePage"/>
    <form-modal ref="formRef" @onReload="handlePage"/>
  </div>
</template>
<script setup lang="ts">
import useTable from '@/utils/table';
import {reactive, ref} from 'vue';
import {usersApi} from '@/api/users';
import Pagination from "@/components/Pagination/index.vue";
import FormModal from "./FormModel.vue";


// 添加/修改
const formRef = ref();
const openFormModal = (item?: any) => {
  formRef.value.onOpen(item)
}

// 基础功能
const apis = reactive({
  page: usersApi.orderInfoPage
})
const {page, handlePage, query, handleQuery, resetQuery} = reactive({
  ...useTable(apis)
})
</script>
