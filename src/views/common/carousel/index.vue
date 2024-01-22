<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="seekForm" inline label-width="80px">
          <el-form-item>
            <el-button type="primary" @click="seek()"> 查询</el-button>
            <el-button plain type="success" @click="openEditDialog(initData)">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="tableData.loading" :data="tableData.list" border>
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
          <span>{{ targetEnums[scope.row.carouselTarget] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="排序" prop="sort"/>
      <el-table-column :width="100" label="状态">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.statusId === 0 }">{{ statusIdEnums[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="200" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button plain type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-dropdown>
            <el-button> 更多操作<i class="el-icon-arrow-down"/></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button v-if="scope.row.statusId == 0" plain type="success" @click="handleUpdateStatus(scope.row)">启用</el-button>
                  <el-button v-if="scope.row.statusId == 1" plain type="danger" @click="handleUpdateStatus(scope.row)">禁用</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button plain type="danger" @click="tableDelete(scope.row, '')">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" :current-page="page.pageCurrent" :page-size="page.pageSize" @pagination="apis.getList"/>
    <!--    <el-pagination :current-page="page.pageCurrent" :layout="page.layout" :page-size="page.pageSize" :page-sizes="[20, 50, 100, 200]" :total="page.totalCount" background @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
       -->
    <edit v-model="editModel.visible" :form="editModel.form" @updateTable="closeEditDialog"/>
  </div>
</template>
<script setup lang="ts">
import Table from '@/utils/table';
import {ElMessage} from 'element-plus';
import {onMounted, reactive, toRefs} from 'vue';
import {systemApi} from '@/api/system'
import Edit from './edit.vue';
import {getEnum} from '@/utils/base';
import Pagination from "@/components/Pagination/index.vue";


const initData = reactive({
  carouselTarget: '_blank',
  sort: 1
})
const apis = reactive({
  getList: systemApi.carouselPage,
  delete: systemApi.carouselDelete,
  updateStatus: systemApi.carouselEdit
})
const state = reactive({
  //...UseTable(apis, {}),
  statusIdEnums: {},
  targetEnums: {}
});

const {tableData, openEditDialog, closeEditDialog, page, seek, seekForm, editModel, getTableData, closeAddDialog, openAddDialog, addModel, PageParam, resetSeek, tableDelete, handleSizeChange, handleCurrentChange} = reactive({
  ...Table(apis, {})
})

const handleUpdateStatus = function (row: any) {
  tableData.loading = true;
  row.statusId = row.statusId ? 0 : 1
  apis.updateStatus({id: row.id, statusId: row.statusId}).then((res: any) => {
    if (res) {
      ElMessage({type: 'success', message: res});
      getTableData();
    }
    tableData.loading = false;
  });
}

onMounted(() => {
  state.statusIdEnums = getEnum('StatusIdEnum', 'obj');
  state.targetEnums = getEnum('TargetEnum', 'obj');
})

const {statusIdEnums, targetEnums} = toRefs(state)


</script>
