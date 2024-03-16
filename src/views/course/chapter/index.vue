<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-button type="success" @click="openFormModal()">章添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" :tree-props="{ children: 'periodViewRespList' }" border default-expand-all row-key="id">
      <el-table-column align="center" label="序号" type="index" width="60" />
      <el-table-column label="章节名称" prop="chapterName">
        <template #default="scope">
          <span>{{ scope.row.chapterName }}</span>
          <span>{{ scope.row.periodName }}</span>
          <span v-if="scope.row.resourceViewResp">
            【 <enum-view :enum-name="'ResourceTypeEnum'" :enum-value="scope.row.resourceViewResp.resourceType" /> ：{{ scope.row.resourceViewResp.resourceName }} |
            <span v-if="scope.row.resourceViewResp.resourceType < 3">{{ formatTime(scope.row.resourceViewResp.videoLength) }}</span>
            <span v-else>{{ scope.row.resourceViewResp.docPage }} 页</span> 】
          </span>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="排序" prop="sort" />
      <el-table-column :width="100" label="收费">
        <template #default="scope">
          <enum-view :enum-name="'FreeEnum'" :enum-value="scope.row.isFree" />
        </template>
      </el-table-column>
      <el-table-column :width="100" label="状态">
        <template #default="scope">
          <enum-view :enum-name="'StatusIdEnum'" :enum-value="scope.row.statusId" />
        </template>
      </el-table-column>
      <el-table-column :width="300" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button v-if="scope.row.periodName" type="primary" @click="openFormPeriodModal(scope.row, null)">编辑</el-button>
          <el-button v-if="scope.row.chapterName" type="primary" @click="openFormModal(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.chapterName" type="success" @click="openFormPeriodModal(null, scope.row.id)">节添加</el-button>
          <el-dropdown>
            <el-button>
              更多操作
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button v-if="scope.row.statusId == 0" type="success" @click="doHandleStatus(scope.row)">启用</el-button>
                  <el-button v-if="scope.row.statusId == 1" type="danger" @click="doHandleStatus(scope.row)">禁用</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button type="danger" @click="doHandleDelete(scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage" />
    <form-model ref="formRef" @refresh="handlePage" />
    <form-period ref="formPeriodRef" @refresh="handlePage" />
  </div>
</template>
<script setup>
  import { reactive, ref } from 'vue'
  import Pagination from '@/components/Pagination/index.vue'
  import useTable from '@/utils/table'
  import { courseApi } from '@/api/course'
  import { formatTime } from '@/utils/base'
  import FormModel from './FormModel.vue'
  import FormPeriod from './FormPeriod.vue'
  import { useRoute } from 'vue-router/dist/vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import EnumView from '@/components/Enum/View/index.vue'

  const route = useRoute()

  // 节添加修改
  const formPeriodRef = ref()
  const openFormPeriodModal = (item, chapterId) => {
    formPeriodRef.value.onOpen(item, chapterId, route.query.courseId)
  }

  // 章添加/修改
  const formRef = ref()
  const openFormModal = (item) => {
    formRef.value.onOpen(item, route.query.courseId)
  }

  const doHandleStatus = async (item) => {
    if (item.chapterName) {
      handleStatus(item)
    } else {
      page.loading = true
      try {
        item.statusId = item.statusId === 0 ? 1 : 0
        const res = await courseApi.courseChapterPeriodEdit({ id: item.id, statusId: item.statusId })
        ElMessage.success({ message: res.msg ? res.msg : '操作成功' })
      } finally {
        page.loading = false
      }
    }
  }

  const doHandleDelete = async (item) => {
    if (item.chapterName) {
      handleDelete(item)
    } else {
      ElMessageBox.confirm('确认删除当前数据?', '删除提示', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确认'
      }).then(async () => {
        page.loading = true
        try {
          const res = await courseApi.courseChapterPeriodDelete({ id: item.id })
          ElMessage.success({ message: res.msg ? res.msg : '删除成功' })
          await handlePage()
        } finally {
          page.loading = false
        }
      })
    }
  }

  // 基础功能
  const { page, handlePage, query, handleDelete, handleStatus } = reactive({
    ...useTable(
      {
        page: courseApi.courseChapterPage,
        delete: courseApi.courseChapterDelete,
        status: courseApi.courseChapterEdit
      },
      {
        courseId: route.query.courseId
      }
    )
  })
</script>
