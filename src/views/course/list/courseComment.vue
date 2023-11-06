<template>
  <div class="comment">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="seekForm" inline label-width="80px">
          <el-form-item label="评论内容">
            <el-input v-model="seekForm.commentText" clearable/>
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
      <el-table-column label="用户手机" prop="mobile" min-width="20"/>
      <el-table-column label="用户昵称" prop="nickname" min-width="20"/>
      <el-table-column label="内容" prop="commentText"/>
      <el-table-column width="100" label="操作">
        <template #default="scope">
          <el-button plain type="primary" @click="tableDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page.pageCurrent" :layout="page.layout" :page-size="page.pageSize" :page-sizes="[20, 50, 100, 200]" :total="page.totalCount" background @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
  </div>
</template>

<script>
import UseTable from '@/composables/UseTable.js';
import {ElMessage} from 'element-plus';
import {defineComponent, onMounted, reactive, toRefs} from 'vue';
import {useStore} from 'vuex';
import {userCourseComment, courseCommentDelete} from '@/api/course.js'
import {useRoute} from 'vue-router/dist/vue-router';

export default defineComponent({
  components: {},
  setup() {
    const route = useRoute()
    const apis = reactive({
      getList: userCourseComment,
      delete: courseCommentDelete
    })
    const state = reactive({
      ...UseTable(apis, {courseId: route.query.courseId})
    });
    const store = useStore();

    return {
      ...toRefs(state)
    };
  }
});
</script>

<style scoped lang="scss">

</style>
