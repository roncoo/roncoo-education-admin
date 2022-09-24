<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="seekForm" inline label-width="80px">
          <el-form-item label="分类名称">
            <el-input v-model="seekForm.categoryName" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button @click="seek()" type="primary"> 查询</el-button>
            <el-button @click="resetSeek()">重置</el-button>
            <el-button v-if="checkPermission('course:admin:category:save')" plain type="success" @click="openAddDialog(initData)">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="tableData.loading" :data="tableData.list" border row-key="id" :tree-props="{ children: 'childrenList' }">
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="名称" prop="categoryName">
        <template #default="scope">
          <span>{{ scope.row.categoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" :width="100"/>
      <el-table-column label="状态" :width="100">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.statusId === 0 }">{{ statusIdEnums[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="300" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button v-if="checkPermission('course:admin:category:save')" plain type="success" @click="openAddDialog(scope.row)">添加</el-button>
          <el-button v-if="checkPermission('course:admin:category:edit')" plain type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-dropdown>
            <el-button> 更多操作<i class="el-icon-arrow-down"/></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button v-if="checkPermission('course:admin:category:edit') && scope.row.statusId == 0" plain type="success" @click="handleUpdateStatus(scope.row)">启用</el-button>
                  <el-button v-if="checkPermission('course:admin:category:edit') && scope.row.statusId == 1" plain type="danger" @click="handleUpdateStatus(scope.row)">禁用</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-if="checkPermission('course:admin:category:delete')" plain type="danger" @click="tableDelete(scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
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
import {categoryDelete, categoryEdit, categoryList} from '@/api/course.js'
import Edit from './edit.vue';
import Add from './add.vue';

export default defineComponent({
  components: {
    Edit, Add
  },
  setup() {
    const initData = reactive({
      sort: 1
    })
    const store = useStore();
    const route = useRoute()
    const apis = reactive({
      getList: categoryList,
      delete: categoryDelete,
      updateStatus: categoryEdit
    })
    const state = reactive({
      ...UseTable(apis, {}),
      statusIdEnums: {},
      userSexEnums: {}
    });
    const addForm = reactive({
      courseId: ''
    })
    const editForm = reactive({
      courseId: ''
    })
    onMounted(() => {
      addForm.courseId = route.query.courseId;
      editForm.courseId = route.query.courseId;
      store.dispatch('GetOpts', {enumName: 'StatusIdEnum', type: 'obj'}).then((res) => {
        state.statusIdEnums = res;
      });
      store.dispatch('GetOpts', {enumName: 'UserSexEnum', type: 'obj'}).then((res) => {
        state.userSexEnums = res;
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
      addForm,
      editForm,
      handleUpdateStatus
    };
  }
});
</script>
