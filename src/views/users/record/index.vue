<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" border>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="封面" min-width="20" prop="courseLogo">
        <template #default="scope">
          <img :alt="scope.row.courseName" :src="scope.row.courseLogo"/>
        </template>
      </el-table-column>
      <el-table-column label="课程名称" min-width="20" prop="courseName"/>
      <el-table-column label="学习进度" prop="courseProgress">
        <template #default="scope">
          <el-progress
              :percentage="scope.row.courseProgress"
              :stroke-width="25"
              :text-inside="true"
          />
        </template>
      </el-table-column>
      <el-table-column label="开始学习时间" min-width="30" prop="gmtCreate"/>
      <el-table-column label="操作" width="100">
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
import Table from '@/utils/useTable.ts';
import {defineComponent, onMounted, reactive, toRefs} from 'vue';

import {courseApi} from '@/api/course.js'
import {usersApi} from '@/api/users.js'
import {useRoute} from 'vue-router/dist/vue-router';
import Study from './Study.vue';
import {getEnumObj} from '@/utils/base.ts';

export default defineComponent({
  components: {Study},
  setup() {
    const route = useRoute()
    const apis = reactive({
      getList: usersApi.userCoursePage
    })
    const state = reactive({
      ...Table(apis, {userId: route.query.userId}),
      loginStatusEnums: {}
    });

    onMounted(() => {
      state.loginStatusEnums = getEnumObj('LoginStatusEnum');
    });

    let study = reactive({
      visible: false,
      info: {}
    })
    const studyRecord = (row) => {
      courseApi.userStudyePage({courseId: row.courseId, userId: route.query.userId}).then((res) => {
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
