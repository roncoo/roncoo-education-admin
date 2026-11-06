<template>
  <el-dialog class="lecturer-selector" :append-to-body="true" :model-value="true" :title="props.title" width="800px" center align-center :destroy-on-close="true" @close="handleClose">
    <div class="search_bar lecturer-selector__search">
      <el-form :model="query" inline label-width="80px">
        <el-form-item>
          <el-input v-model="query.lecturerName" placeholder="请输入讲师名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery()"> 查询</el-button>
          <el-button @click="resetQuery()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="lecturer-selector__table">
      <el-table v-loading="page.loading" :data="page.list" height="100%">
        <el-table-column label="讲师信息">
          <template #default="scope">
            <img :alt="scope.row.lecturerName" :src="scope.row.lecturerHead" style="height: 40px; width: auto; border-radius: 50%; vertical-align: middle" />
            &nbsp;{{ scope.row.lecturerName }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="selectLecturer(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <pagination v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" :total="page.totalCount" @pagination="handlePage" />
    </template>
  </el-dialog>
</template>

<script setup>
  import { usersApi } from '@/api/users'
  import useTable from '@/utils/table'
  import Pagination from '@/components/Pagination/index.vue'

  defineOptions({ name: 'LecturerSelector' })

  const props = defineProps({
    title: {
      type: String,
      default: '请选择讲师'
    }
  })

  const emit = defineEmits(['close'])
  // 选择老师
  const selectLecturer = (info) => {
    emit('close', { lecturerName: info.lecturerName, lecturerId: info.id })
  }
  // 关闭
  const handleClose = () => {
    emit('close')
  }

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery } = useTable({
    page: usersApi.lecturerPage
  })
</script>

<!-- Dialog is teleported; target its unique class without a scoped ancestor. -->
<style lang="scss">
  .el-dialog.lecturer-selector {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: min(680px, 90vh);
    max-height: 90vh;
    overflow: hidden;

    .el-dialog__header,
    .el-dialog__footer {
      flex-shrink: 0;
    }

    .el-dialog__body {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-height: 0;
      max-height: none;
      overflow: hidden;
    }

    .el-pagination {
      margin-top: 0;
      flex-wrap: wrap;
      row-gap: 8px;
    }
  }

  .lecturer-selector__search {
    flex-shrink: 0;
    margin-bottom: 20px;
  }

  .lecturer-selector__table {
    flex: 1;
    min-height: 0;
  }
</style>
