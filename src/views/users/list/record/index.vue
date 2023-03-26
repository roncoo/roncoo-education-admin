<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="seekForm" inline label-width="80px">
          <el-form-item>
            <el-button @click="seek()" type="primary"> 查询</el-button>
            <el-button @click="resetSeek()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="tableData.loading" :data="tableData.list" border>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="封面" prop="courseLogo" min-width="20">
        <template #default="scope">
          <img :src="scope.row.courseLogo" :alt="scope.row.courseName"/>
        </template>
      </el-table-column>
      <el-table-column label="课程名称" prop="courseName" min-width="20"/>
      <el-table-column label="学习进度" prop="courseProgress">
        <template #default="scope">
          <el-progress
            :percentage="scope.row.courseProgress"
            :stroke-width="25"
            :text-inside="true"
          />
        </template>
      </el-table-column>
      <el-table-column label="开始学习时间" prop="gmtCreate" min-width="30"/>
      <el-table-column width="100" label="操作">
        <template #default="scope">
          <el-button plain type="primary" @click="studyRecord(scope.row)">明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page.pageCurrent" :layout="page.layout" :page-size="page.pageSize" :page-sizes="[20, 50, 100, 200]" :total="page.totalCount" background @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    <study v-model="study.visible" :info="study.info" @close="studyCallback"/>
  </div>
</template>
<script>
import UseTable from '@/composables/UseTable.js';
import {ElMessage} from 'element-plus';
import {defineComponent, onMounted, reactive, toRefs} from 'vue';
import {useStore} from 'vuex';
import {userStudyePage} from '@/api/course.js'
import {userCoursePage} from '@/api/user.js'
import {useRoute} from 'vue-router/dist/vue-router';
import Study from './study.vue';

export default defineComponent({
  components: {Study},
  setup() {
    const route = useRoute()
    const apis = reactive({
      getList: userCoursePage
    })
    const state = reactive({
      ...UseTable(apis, {userId: route.query.userId}),
      loginStatusEnums: {}
    });
    const store = useStore();
    onMounted(() => {
      store.dispatch('GetOpts', {enumName: 'LoginStatusEnum', type: 'obj'}).then((res) => {
        state.loginStatusEnums = res;
      });
    });

    let study = reactive({
      visible: false,
      info: {}
    })
    const studyRecord = (row) => {
      userStudyePage({courseId: row.courseId, userId: route.query.userId}).then((res) => {
        study.info = res.list
        study.visible = true
      });
    }
    const studyCallback = () => {
      study.visible = false
    }

    return {
      ...toRefs(state),
      study,
      studyRecord,
      studyCallback
    };
  }
});
</script>
