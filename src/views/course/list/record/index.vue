<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="课程记录" name="course">
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
          <el-table-column label="手机号码" prop="mobile" min-width="20"/>
          <el-table-column label="用户昵称" prop="nickname" min-width="20"/>
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
import UseTable from '@/composables/UseTable.js';
import {ElMessage} from 'element-plus';
import {defineComponent, onMounted, reactive, toRefs} from 'vue';
import {useStore} from 'vuex';
import {userCourseRecord, userStudyePage} from '@/api/course.js'
import {useRoute} from 'vue-router/dist/vue-router';
import Study from './study.vue';
import CourseComment from '../courseComment.vue';
import CourseCollect from '../courseCollect.vue';

export default defineComponent({
  components: {Study, CourseComment, CourseCollect},
  setup() {
    const route = useRoute()
    const apis = reactive({
      getList: userCourseRecord
    })
    const state = reactive({
      ...UseTable(apis, {courseId: route.query.courseId}),
      activeName: 'course'
    });
    const store = useStore();

    let study = reactive({
      visible: false,
      info: {}
    })
    const studyRecord = (row) => {
      userStudyePage({userId: row.userId, courseId: route.query.courseId}).then((res) => {
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
