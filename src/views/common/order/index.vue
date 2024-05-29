<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-input v-model="query.orderNo" placeholder="根据订单号搜索" prefix-icon="Search" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="query.mobile" placeholder="根据手机号码搜索" prefix-icon="Search" />
          </el-form-item>
          <el-form-item>
            <enum-select v-model="query.orderStatus" :enum-name="'OrderStatusEnum'" :title="'请选择支付方式'" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()">查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list">
      <el-table-column :min-width="180" label="商品信息">
        <template #default="scope">
          <img :alt="scope.row.courseViewVO.courseName" :src="scope.row.courseViewVO.courseLogo" style="float: left; height: 50px; width: 90px; vertical-align: middle; border-radius: 5px" />
          <div style="float: left; margin-left: 10px">
            {{ scope.row.courseViewVO.courseName }}
            <br />
            <span v-if="scope.row.courseViewVO.isFree == 1">免费</span>
            <span v-if="scope.row.courseViewVO.isFree == 0">
              ￥{{ scope.row.courseViewVO.coursePrice }}<span style="text-decoration: line-through; margin-left: 10px">￥{{ scope.row.courseViewVO.rulingPrice }}</span>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :min-width="80" label="订单号">
        <template #default="scope">
          {{ scope.row.orderNo }}
        </template>
      </el-table-column>
      <el-table-column :min-width="50" label="用户手机" prop="mobile" />
      <el-table-column :min-width="50" label="实付金额">
        <template #default="scope">
          <span> ￥{{ scope.row.coursePrice }} </span>
        </template>
      </el-table-column>
      <el-table-column :min-width="80" label="支付方式/时间">
        <template #default="scope">
          <enum-view :enum-name="'PayTypeEnum'" :enum-value="scope.row.payType" />
          <br />
          <span v-if="scope.row.orderStatus === 2">{{ scope.row.payTime }}</span>
          <span v-else>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column :min-width="50" label="订单状态">
        <template #default="scope">
          <enum-view :enum-name="'OrderStatusEnum'" :enum-value="scope.row.orderStatus" />
        </template>
      </el-table-column>
      <el-table-column :min-width="50" label="客户/备注" prop="remarkCus">
        <template #default="scope">
          {{ scope.row.remarkCus }}<br />
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column :width="100" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button v-permission="'order:remark'" text type="primary" @click="openFormModal(scope.row)">写备注</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
    <order-form ref="formRef" @refresh="handlePage" />
  </div>
</template>
<script setup>
  import useTable from '@/utils/table'
  import { ref } from 'vue'
  import { usersApi } from '@/api/users'
  import Pagination from '@/components/Pagination/index.vue'
  import OrderForm from './OrderForm.vue'
  import EnumView from '@/components/Enum/View/index.vue'
  import EnumSelect from '@/components/Enum/Select/index.vue'

  // 添加/修改
  const formRef = ref()
  const openFormModal = (item) => {
    formRef.value.onOpen(item)
  }

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery } = useTable({
    page: usersApi.orderInfoPage
  })
</script>
