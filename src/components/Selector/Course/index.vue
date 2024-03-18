<template>
  <el-dialog :append-to-body="true" :model-value="props.visible" :title="props.title" width="800px" align-center @close="handleClose" :destroy-on-close="true">
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
      <el-table-column :width="130" label="封面">
        <template #default="scope">
          <img :alt="scope.row.courseName" :src="scope.row.courseLogo" style="height: 50px; width: auto" />
        </template>
      </el-table-column>
      <el-table-column label="课程名称" prop="courseName" />
      <el-table-column :width="100" label="价格">
        <template #default="scope">
          <span v-if="scope.row.isFree == 1">免费</span>
          <span v-if="scope.row.isFree == 0">
            ￥{{ scope.row.coursePrice }} <br /><span style="text-decoration: line-through">￥{{ scope.row.rulingPrice }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column :width="80" label="售卖">
        <template #default="scope">
          <enum-view :enum-name="'PutawayEnum'" :enum-value="scope.row.isPutaway" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button type="primary" @click="selectCourse(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage" />
  </el-dialog>
</template>

<script setup>
  import { reactive } from 'vue'
  import useTable from '@/utils/table'
  import { courseApi } from '@/api/course'
  import Pagination from '@/components/Pagination/index.vue'
  import EnumView from '@/components/Enum/View/index.vue'

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
