<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="seekForm" inline label-width="80px">
          <!--  <el-form-item label="章名称">
                      <el-input v-model="seekForm.chapterName" clearable/>
                    </el-form-item>-->
          <el-form-item>
            <el-button plain type="success" @click="openEditDialog(editForm)">章添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="tableData.loading" :data="tableData.list" border row-key="id" :tree-props="{ children: 'periodViewRespList' }" default-expand-all>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="章节名称" prop="chapterName">
        <template #default="scope">
          <span>{{ scope.row.chapterName }}</span>
          <span>{{ scope.row.periodName }}</span>
          <span v-if="scope.row.resourceViewResp"> 【{{ resourceTypeEnums[scope.row.resourceViewResp.resourceType] }}：{{ scope.row.resourceViewResp.resourceName }} | {{ formatDuring(scope.row.resourceViewResp.videoLength*1000) }} 】</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="章节描述" prop="chapterDesc"/>-->
      <el-table-column label="排序" prop="sort" :width="100"/>
      <el-table-column label="收费" :width="100">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.isFree === 0 }">{{ freeEnums[scope.row.isFree] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="300" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button v-if="scope.row.periodName" plain type="primary" @click="openAddDialog(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.chapterName" plain type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.chapterName" plain type="success" @click="openAddDialog(scope.row)">节添加</el-button>
          <el-dropdown>
            <el-button> 更多操作<i class="el-icon-arrow-down"/></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button v-if="scope.row.statusId == 0" plain type="success" @click="handleUpdateStatus(scope.row)">启用</el-button>
                  <el-button v-if="scope.row.statusId == 1" plain type="danger" @click="handleUpdateStatus(scope.row)">禁用</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button plain type="danger" @click="tableDelete(scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page.pageCurrent" :layout="page.layout" :page-size="page.pageSize" :page-sizes="[20, 50, 100, 200]" :total="page.totalCount" background @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    <edit v-model="editModel.visible" :form="editModel.form" @updateTable="closeEditDialog"/>
    <add v-model="addModel.visible" :form="addModel.form" @updateTable="closeAddDialog"/>
  </div>
</template>
<script>
import UseTable from '@/composables/UseTable.js';
import {ElMessage} from 'element-plus';
import {defineComponent, onMounted, reactive, toRefs} from 'vue';
import {useStore} from 'vuex';
import {useRoute} from 'vue-router';
import {courseChapterDelete, courseChapterEdit, courseChapterPage} from '@/api/course.js'
import { formatDuring} from '@/utils/utils.js'
import Edit from './edit.vue';
import Add from './add.vue';

export default defineComponent({
  components: {
    Edit, Add
  },
  setup() {
    const store = useStore();
    const route = useRoute()
    const apis = reactive({
      getList: courseChapterPage,
      delete: courseChapterDelete,
      updateStatus: courseChapterEdit
    })
    const state = reactive({
      ...UseTable(apis, {courseId: route.query.courseId}),
      freeEnums: {},
      statusIdEnums: {},
      userSexEnums: {},
      resourceTypeEnums: {}
    });
    const editForm = reactive({
      courseId: ''
    })
    onMounted(() => {
      // 章添加修改
      editForm.courseId = route.query.courseId;
      store.dispatch('GetOpts', {enumName: 'FreeEnum', type: 'obj'}).then((res) => {
        state.freeEnums = res;
      });
      store.dispatch('GetOpts', {enumName: 'StatusIdEnum', type: 'obj'}).then((res) => {
        state.statusIdEnums = res;
      });
      store.dispatch('GetOpts', {enumName: 'UserSexEnum', type: 'obj'}).then((res) => {
        state.userSexEnums = res;
      });
      store.dispatch('GetOpts', {enumName: 'ResourceTypeEnum', type: 'obj'}).then((res) => {
        state.resourceTypeEnums = res;
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
      handleUpdateStatus,
      formatDuring
    };
  }
});
</script>
