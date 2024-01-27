<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="课程记录" name="course">
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
          <el-table-column label="手机号码" min-width="20" prop="mobile"/>
          <el-table-column label="用户昵称" min-width="20" prop="nickname"/>
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
      </el-tab-pane>
      <el-tab-pane label="课程评论" name="comment">
        <course-comment v-if="activeName === 'comment'"/>
      </el-tab-pane>
      <el-tab-pane label="课程收藏" name="collect">
        <course-collect v-if="activeName === 'collect'"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Table from '@/utils/useTable.ts';
import {defineComponent, reactive, toRefs} from 'vue';

import {courseApi} from '@/api/course.js'
import {useRoute} from 'vue-router/dist/vue-router';
import Study from './Study.vue';
import CourseComment from '../list/Comment.vue';
import CourseCollect from '../list/Collect.vue';

export default defineComponent({
  components: {Study, CourseComment, CourseCollect},
  setup() {
    const route = useRoute()
    const apis = reactive({
      getList: courseApi.userCourseRecord
    })
    const state = reactive({
      ...Table(apis, {courseId: route.query.courseId}),
      activeName: 'course'
    });

    let study = reactive({
      visible: false,
      info: {}
    })
    const studyRecord = (row) => {
      courseApi.userStudyePage({userId: row.userId, courseId: route.query.courseId}).then((res) => {
        study.info = res.list
        study.visible = true
      });
    }
    const studyCallback = () => {
      study.visible = false
    }
    const handleClick = (target, action) => {
      if (target.props.name === 'course') {
        state.getTableData()
      }
    }

    return {
      ...toRefs(state),
      study,
      studyRecord,
      studyCallback,
      handleClick
    };
  }
});
</script>
