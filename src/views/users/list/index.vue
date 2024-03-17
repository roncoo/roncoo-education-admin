<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item label="手机号码">
            <el-input v-model="query.mobile" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" border>
      <el-table-column align="center" label="序号" type="index" width="60" />
      <el-table-column label="手机号码" :min-width="40" prop="mobile" />
      <el-table-column label="用户头像" :min-width="40">
        <template #default="scope">
          <img :alt="scope.row.nickname" :src="scope.row.userHead" style="height: 50px; width: auto; border-radius: 50%" />
        </template>
      </el-table-column>
      <el-table-column label="用户昵称" :min-width="40" prop="nickname" />
      <el-table-column label="账户">
        <template #default="scope">
          <span>余额：￥{{ scope.row.usersAccountViewResp.availableAmount }}元</span>
          <br />
          <span>冻结：￥{{ scope.row.usersAccountViewResp.freezeAmount }}元</span>&nbsp;
          <el-button v-permission="'user:record'" type="text" @click="toUserRecord(scope.row, 'account')">查看明细</el-button>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark">
        <template #default="scope">
          <span v-html="scope.row.remark" />
        </template>
      </el-table-column>
      <el-table-column :min-width="50" label="注册时间" prop="gmtCreate" />
      <el-table-column :min-width="20" label="状态">
        <template #default="scope">
          <enum-view :enum-name="'StatusIdEnum'" :enum-value="scope.row.statusId" />
        </template>
      </el-table-column>
      <el-table-column :width="230" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button v-permission="'user:record'" type="success" @click="toUserRecord(scope.row, 'course')">数据</el-button>
          <el-dropdown>
            <el-button
              >更多操作
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button v-permission="'user:record'" type="success" @click="toUserRecord(scope.row, 'account')">账户</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-permission="'user:edit'" type="primary" @click="openFormModal(scope.row)">编辑</el-button>
                </el-dropdown-item>
                <el-dropdown-item @click="handleStatus(scope.row)">
                  <el-button v-permission="'user:edit'" v-if="scope.row.statusId == 0" type="success">启用</el-button>
                  <el-button v-permission="'user:edit'" v-if="scope.row.statusId == 1" type="warning">禁用</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage" />
    <form-modal ref="formRef" @refresh="handlePage" />
  </div>
</template>
<script setup>
  import useTable from '@/utils/table'
  import { reactive, ref } from 'vue'
  import { usersApi } from '@/api/users'
  import { useRouter } from 'vue-router'
  import Pagination from '@/components/Pagination/index.vue'
  import EnumView from '@/components/Enum/View/index.vue'
  import FormModal from './FormModel.vue'

  // 添加/修改
  const formRef = ref()
  const openFormModal = (item) => {
    formRef.value.onOpen(item)
  }

  // 查看数据
  const router = useRouter()
  const toUserRecord = function (row, tabName) {
    router.push({ path: '/users/record', query: { userId: row.id, activeName: tabName } })
  }

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery, handleStatus } = reactive({
    ...useTable({
      page: usersApi.usersPage,
      delete: usersApi.usersDelete,
      status: usersApi.usersEdit
    })
  })
</script>
