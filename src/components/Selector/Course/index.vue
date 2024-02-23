<template>
  <el-dialog
    :append-to-body="true"
    :model-value="props.visible"
    :title="props.title"
    width="800px"
    center
    @close="handleClose"
  >
    <el-form :model="query" class="filter-container" inline label-width="100px">
      <el-form-item label="课程名称">
        <el-input v-model="query.courseName" />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" @click="handleQuery">查询</el-button>
        <el-button class="filter-item" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="page.loading" :data="page.list" border>
      <el-table-column align="center" label="序号" type="index" width="60" />
      <el-table-column label="课程名称" prop="courseName" />
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button plain type="primary" @click="selectCourse(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="page.totalCount"
      v-model:current-page="page.pageCurrent"
      v-model:page-size="page.pageSize"
      @pagination="handlePage"
    />
  </el-dialog>
</template>

<script setup>
import { reactive } from 'vue'
import useTable from '@/utils/table'
import { courseApi } from '@/api/course'
import Pagination from '@/components/Pagination/index.vue'

const props = defineProps({
  title: {
    type: String,
    default: '请选择课程'
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
const selectCourse = (info) => {
  emit('close', { courseName: info.courseName, courseId: info.id })
}

// 关闭
const handleClose = () => {
  emit('close')
}

// 基础功能
const { page, handlePage, query, handleQuery, resetQuery } = reactive({
  ...useTable({
    page: courseApi.coursePage
  })
})
</script>

<style lang="scss" scoped>
.example-showcase .el-loading-mask {
  z-index: 9;
}
</style>
