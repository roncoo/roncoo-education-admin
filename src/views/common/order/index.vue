<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="seekForm" inline label-width="80px">
          <el-form-item label="订单号">
            <el-input v-model="seekForm.orderNo" clearable/>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="seekForm.mobile" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button @click="seek()" type="primary"> 查询</el-button>
            <el-button @click="resetSeek()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="tableData.loading" :data="tableData.list" border>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="订单号" :width="180">
        <template #default="scope">
          {{ scope.row.orderNo }}
        </template>
      </el-table-column>
      <el-table-column label="课程信息">
        <template #default="scope">
          {{ scope.row.courseViewVO.courseName }}
        </template>
      </el-table-column>
      <el-table-column label="手机号码" prop="mobile" :width="150"/>
      <el-table-column label="支付方式/时间" :width="160">
        <template #default="scope">
          <span>{{ payTypeEnumEnums[scope.row.payType] }}</span>
          <br>
          <span v-if="scope.row.orderStatus === 2">{{ scope.row.payTime }}</span>
          <span v-else>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" :width="100">
        <template #default="scope">
          <span>{{ orderStatusEnums[scope.row.orderStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" :width="100">
        <template #default="scope">
          <span v-if="scope.row.coursePrice == 0">免费</span>
          <span v-else>
            ￥{{ scope.row.coursePrice }} <br><span style="text-decoration:line-through;">￥{{ scope.row.rulingPrice }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="客户/备注" prop="remarkCus" :width="100">
        <template #default="scope">
          {{ scope.row.remarkCus }}<br>
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column :width="100" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button plain type="primary" @click="openEditDialog(scope.row)">备注</el-button>
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
import {orderInfoPage} from '@/api/user.js'
import Edit from './edit.vue';

export default defineComponent({
  components: {
    Edit
  },
  setup() {
    const apis = reactive({
      getList: orderInfoPage
    })
    const state = reactive({
      ...UseTable(apis, {}),
      payTypeEnumEnums: {},
      orderStatusEnums: {}
    });
    const store = useStore();
    onMounted(() => {
      store.dispatch('GetOpts', {enumName: 'PayTypeEnum', type: 'obj'}).then((res) => {
        state.payTypeEnumEnums = res;
      });
      store.dispatch('GetOpts', {enumName: 'OrderStatusEnum', type: 'obj'}).then((res) => {
        state.orderStatusEnums = res;
      });
    });

    const handleUpdateStatus = function(row) {
      state.tableData.loading = true;
      apis.updateStatus({id: row.id}).then((res) => {
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
      handleUpdateStatus
    };
  }
});
</script>
