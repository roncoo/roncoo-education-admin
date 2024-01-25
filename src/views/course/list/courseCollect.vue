<template>
  <div class="collect">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="seekForm" inline label-width="80px">
          <el-form-item>
            <el-button type="primary" @click="seek()"> 查询</el-button>
            <el-button @click="resetSeek()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="tableData.loading" :data="tableData.list" border>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="用户手机" min-width="20" prop="mobile"/>
      <el-table-column label="用户昵称" min-width="20" prop="nickname"/>
      <el-table-column label="收藏时间" min-width="30" prop="gmtCreate"/>
    </el-table>
    <pagination :total="page.totalCount" :current-page="page.pageCurrent" :page-size="page.pageSize" @pagination="getTableData"/>
  </div>
</template>

<script>

import Table from '@/utils/useTable.ts';
import {defineComponent, reactive, toRefs} from 'vue';

import {courseApi} from '@/api/course'
import {useRoute} from 'vue-router/dist/vue-router';
import Pagination from '@/components/Pagination/index.vue';

export default defineComponent({
  components: {Pagination},
  setup() {
    const route = useRoute()
    const apis = reactive({
      getList: courseApi.userCourseCollect
    })
    const state = reactive({
      ...Table(apis, {courseId: route.query.courseId})
    });

    return {
      ...toRefs(state)
    };
  }
});
</script>

<style lang="less" scoped>
</style>
