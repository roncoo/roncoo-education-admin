<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="seekForm" inline label-width="80px">
          <el-form-item label="课程名称">
            <el-input v-model="seekForm.courseName" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button @click="seek()" type="primary"> 查询</el-button>
            <el-button @click="resetSeek()">重置</el-button>
            <el-button v-if="checkPermission('course:admin:course:save')" plain type="success" @click="openEditDialog(initData)">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="tableData.loading" :data="tableData.list" border>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="封面" :width="120">
        <template #default="scope">
          <img :src="scope.row.courseLogo" :alt="scope.row.courseName"/>
        </template>
      </el-table-column>
      <el-table-column label="名称/分类-讲师" prop="courseName">
        <template #default="scope">
          <span><a :href="'/course/'+scope.row.id" target="_blank"> {{ scope.row.courseName }}</a></span><br>
          <span>{{ scope.row.categoryName }} - 【{{ scope.row.lecturerName }}】</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" :width="100">
        <template #default="scope">
          <span v-if="scope.row.isFree == 1">免费</span>
          <span v-if="scope.row.isFree == 0">
            ￥{{ scope.row.coursePrice }} <br><span style="text-decoration:line-through;">￥{{ scope.row.rulingPrice }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="购买/学习" prop="countBuy" :width="100">
        <template #default="scope">
          <span>{{ scope.row.countBuy }} / {{ scope.row.countStudy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="courseSort" :width="80"/>
      <el-table-column label="售卖" :width="80">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.isPutaway === 0 }">{{ putawayEnums[scope.row.isPutaway] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" :width="80">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.statusId === 0 }">{{ statusIdEnums[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="280" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button plain type="success" @click="courseRecord(scope.row)">数据</el-button>
          <el-button v-if="checkPermission('course:admin:course:edit')" plain type="success" @click="courseChapter(scope.row)">章节</el-button>
          <el-dropdown>
            <el-button> 更多操作<i class="el-icon-arrow-down"/></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button v-if="checkPermission('course:admin:course:edit')" plain type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-if="checkPermission('course:admin:course:edit') && scope.row.statusId == 0" plain type="success" @click="handleUpdateStatus(scope.row)">启用</el-button>
                  <el-button v-if="checkPermission('course:admin:course:edit') && scope.row.statusId == 1" plain type="danger" @click="handleUpdateStatus(scope.row)">禁用</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-if="checkPermission('course:admin:course:delete')" plain type="danger" @click="tableDelete(scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page.pageCurrent" :layout="page.layout" :page-size="page.pageSize" :page-sizes="[20, 50, 100, 200]" :total="page.totalCount" background @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    <edit v-model="editModel.visible" :modelValue="editModel.visible" :form="editModel.form" @updateTable="closeEditDialog"/>
  </div>
</template>
<script>
import UseTable from '@/composables/UseTable.js';
import {ElMessage} from 'element-plus';
import {defineComponent, onMounted, reactive, toRefs} from 'vue';
import {useStore} from 'vuex';
import {courseDelete, courseEdit, coursePage} from '@/api/course.js'
import Edit from './edit.vue';

export default defineComponent({
  components: {
    Edit
  },
  setup() {
    const initData = reactive({
      coursePrice: 0.00,
      rulingPrice: 0.00,
      isPutaway: 1,
      courseSort: 1
    })
    const apis = reactive({
      getList: coursePage,
      delete: courseDelete,
      updateStatus: courseEdit
    })
    const state = reactive({
      ...UseTable(apis, {}),
      statusIdEnums: {},
      putawayEnums: {}
    });
    const store = useStore();
    onMounted(() => {
      store.dispatch('GetOpts', {enumName: 'StatusIdEnum', type: 'obj'}).then((res) => {
        state.statusIdEnums = res;
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

    //章节
    const courseChapter = function(row) {
      this.$router.push({path: '/course/chapter', query: {courseId: row.id}});
    }

    //数据
    const courseRecord = function(row) {
      this.$router.push({path: '/course/record', query: {courseId: row.id}});
    }

    return {
      ...toRefs(state), initData,
      handleUpdateStatus,
      courseChapter,
      courseRecord
    };
  }
});
</script>
