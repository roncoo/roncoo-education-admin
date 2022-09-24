<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="seekForm" inline label-width="80px">
          <el-form-item>
            <el-button plain type="success" @click="openEditDialog(editForm)">课程添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="tableData.loading" :data="tableData.list" border row-key="id" :tree-props="{ children: 'periodViewRespList' }" default-expand-all>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="封面" :width="100">
        <template #default="scope">
          <img :src="scope.row.courseViewResp.courseLogo" :alt="scope.row.courseViewResp.courseName"/>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="courseName">
        <template #default="scope">
          <span>{{ scope.row.courseViewResp.courseName }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="价格" :width="100">
        <template #default="scope">
          <span v-if="scope.row.courseViewResp.isFree == 1">免费</span>
          <span v-if="scope.row.courseViewResp.isFree == 0">
            ￥{{ scope.row.courseViewResp.coursePrice }} <br><span style="text-decoration:line-through;">￥{{ scope.row.courseViewResp.rulingPrice }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="售卖" :width="100">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.courseViewResp.isPutaway === 0 }">{{ putawayEnums[scope.row.courseViewResp.isPutaway] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" :width="100"/>
      <el-table-column label="状态" :width="100">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.statusId === 0 }">{{ statusIdEnums[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="250" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button plain type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.statusId == 0" plain type="success" @click="handleUpdateStatus(scope.row)">启用</el-button>
          <el-button v-if="scope.row.statusId == 1" plain type="danger" @click="handleUpdateStatus(scope.row)">禁用</el-button>
          <el-button plain type="danger" @click="tableDelete(scope.row)">删除</el-button>
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
import {useRoute} from 'vue-router';
import {zoneCourseDelete, zoneCourseEdit, zoneCoursePage} from '@/api/course.js'
import Edit from './edit.vue';

export default defineComponent({
  components: {
    Edit
  },
  setup() {
    const store = useStore();
    const route = useRoute()
    const apis = reactive({
      getList: zoneCoursePage,
      delete: zoneCourseDelete,
      updateStatus: zoneCourseEdit
    })
    const state = reactive({
      ...UseTable(apis, {zoneId: route.query.zoneId}),
      freeEnums: {},
      statusIdEnums: {},
      userSexEnums: {},
      putawayEnums: {}
    });
    const editForm = reactive({
      zoneId: ''
    })
    onMounted(() => {
      // 章添加修改
      editForm.zoneId = route.query.zoneId;
      store.dispatch('GetOpts', {enumName: 'FreeEnum', type: 'obj'}).then((res) => {
        state.freeEnums = res;
      });
      store.dispatch('GetOpts', {enumName: 'StatusIdEnum', type: 'obj'}).then((res) => {
        state.statusIdEnums = res;
      });
      store.dispatch('GetOpts', {enumName: 'UserSexEnum', type: 'obj'}).then((res) => {
        state.userSexEnums = res;
      });
      store.dispatch('GetOpts', {enumName: 'PutawayEnum', type: 'obj'}).then((res) => {
        state.putawayEnums = res;
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
      editForm,
      handleUpdateStatus
    };
  }
});
</script>
