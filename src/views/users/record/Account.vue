<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
            <el-button type="success" @click="openConsumeRecord()"> 余额操作 </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" border>
      <el-table-column align="center" label="序号" type="index" width="60" />
      <el-table-column label="时间" prop="gmtCreate" />
      <el-table-column label="消费类型" prop="consumeType">
        <template #default="scope">
          <enum-view :enum-name="'ConsumeTypeEnum'" :enum-value="scope.row.consumeType" />
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="consumeAmount">
        <template #default="scope">
          <span v-if="scope.row.consumeType === 1">-</span>
          <span v-if="scope.row.consumeType === 2">+</span>
          {{ scope.row.consumeAmount }}
        </template>
      </el-table-column>
      <el-table-column label="余额" prop="balanceAmount" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="订单号" prop="orderNo" />
    </el-table>
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage" />
    <consume ref="consumeRef" @refresh="handlePage" />
  </div>
</template>
<script setup>
  import useTable from '@/utils/table'
  import { reactive, ref } from 'vue'
  import { usersApi } from '@/api/users'
  import Pagination from '@/components/Pagination/index.vue'
  import Consume from './Consume.vue'
  import { useRoute } from 'vue-router/dist/vue-router'
  import EnumView from '@/components/Enum/View/index.vue'
  const route = useRoute()
  // 添加
  const consumeRef = ref()
  const openConsumeRecord = () => {
    consumeRef.value.onOpen(route.query.userId)
  }
  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery } = reactive({
    ...useTable(
      {
        page: usersApi.usersAccountConsumePage
      },
      { userId: route.query.userId }
    )
  })
</script>
