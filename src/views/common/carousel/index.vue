<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-button v-if="checkPermission('system:admin:website:carousel:save')" plain type="success" @click="openEditDialog(initData)">添加</el-button>
        <br>
        <br>
      </div>
    </div>
    <el-table v-loading="tableData.loading" :data="tableData.list" border>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="图片">
        <template #default="scope">
          <img :src="scope.row.carouselImg" :alt="scope.row.carouselTitle" style="height:50px;"/>
        </template>
      </el-table-column>
      <el-table-column label="地址" prop="carouselUrl">
        <template #default="scope">
          <a :href="scope.row.carouselUrl" target="_blank">{{ scope.row.carouselUrl }}</a>
        </template>
      </el-table-column>
      <el-table-column label="跳转方式" :width="120">
        <template #default="scope">
          <span>{{ targetEnums[scope.row.carouselTarget] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" :width="100"/>
      <el-table-column label="状态" :width="100">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.statusId === 0 }">{{ statusIdEnums[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="200" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button v-if="checkPermission('system:admin:website:carousel:edit')" plain type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-dropdown>
            <el-button> 更多操作<i class="el-icon-arrow-down"/></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button v-if="checkPermission('system:admin:website:carousel:edit') && scope.row.statusId == 0" plain type="success" @click="handleUpdateStatus(scope.row)">启用</el-button>
                  <el-button v-if="checkPermission('system:admin:website:carousel:edit') && scope.row.statusId == 1" plain type="danger" @click="handleUpdateStatus(scope.row)">禁用</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-if="checkPermission('system:admin:website:carousel:delete')" plain type="danger" @click="tableDelete(scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page.pageCurrent" :layout="page.layout" :page-size="page.pageSize" :page-sizes="[20, 50, 100, 200]" :total="page.totalCount" background @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    <edit v-model="editModel.visible" :form="editModel.form" @updateTable="closeEditDialog"/>
  </div>
</template>
<script>
import UseTable from '@/composables/UseTable.js';
import {ElMessage} from 'element-plus';
import {defineComponent, onMounted, reactive, toRefs} from 'vue';
import {useStore} from 'vuex';
import {carouselDelete, carouselEdit, carouselPage} from '@/api/system.js'
import Edit from './edit.vue';

export default defineComponent({
  components: {
    Edit
  },
  setup() {
    const initData = reactive({
      carouselTarget: '_blank',
      sort: 1
    })
    const apis = reactive({
      getList: carouselPage,
      delete: carouselDelete,
      updateStatus: carouselEdit
    })
    const state = reactive({
      ...UseTable(apis, {}),
      statusIdEnums: {},
      targetEnums: {}
    });
    const store = useStore();
    onMounted(() => {
      store.dispatch('GetOpts', {enumName: 'StatusIdEnum', type: 'obj'}).then((res) => {
        state.statusIdEnums = res;
      });
      store.dispatch('GetOpts', {enumName: 'TargetEnum', type: 'obj'}).then((res) => {
        state.targetEnums = res;
      });
    });
    const handleUpdateStatus = function(row) {
      state.tableData.loading = true;
      row.statusId = row.statusId ? 0 : 1
      apis.updateStatus({id: row.id, statusId: row.statusId}).then((res) => {
        if (res) {
          ElMessage({
            type: 'success',
            message: res
          });
          state.getTableData();
        }
        state.tableData.loading = false;
      });
    };
    return {
      ...toRefs(state),
      initData,
      handleUpdateStatus
    };
  }
});
</script>
