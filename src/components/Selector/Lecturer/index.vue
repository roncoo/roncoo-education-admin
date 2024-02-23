<template>
  <el-dialog :append-to-body="true" :model-value="true" :title="props.title" width="800px" center @close="handleClose">
    <div class="search_bar clearfix">
      <el-form :model="query" inline label-width="80px">
        <el-form-item label="讲师名称">
          <el-input v-model="query.lecturerName"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery()"> 查询</el-button>
          <el-button @click="resetQuery()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="page.loading" :data="page.list" border>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="讲师名称" prop="lecturerName"/>
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button plain type="primary" @click="selectLecturer(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage"/>
  </el-dialog>
</template>

<script setup>
import {usersApi} from '@/api/users';
import useTable from '@/utils/table';
import Pagination from "@/components/Pagination/index.vue";
import {reactive} from "vue";

const props = defineProps({
  title: {
    type: String,
    default: '请选择讲师'
  }
})

const emit = defineEmits(['close']);
// 选择老师
const selectLecturer = (info) => {
  emit('close', {lecturerName: info.lecturerName, lecturerId: info.id});
}
// 关闭
const handleClose = () => {
  emit('close')
}

// 基础功能
const {page, handlePage, query, handleQuery, resetQuery} = reactive({
  ...useTable({
    page: usersApi.lecturerPage,
  })
})
</script>

<style lang="less" scoped>

</style>
