<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-input v-model="query.courseName" placeholder="课程名称" prefix-icon="Search" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
            <el-button type="primary" v-permission="'course:es'" @click="handleEs()">同步ES</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="button_bar">
        <el-button v-permission="'course:save'" type="primary" @click="toCourseAdd()">添加课程</el-button>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" row-key="id" class="drag-table">
      <el-table-column :min-width="180" label="课程信息">
        <template #default="scope">
          <img :alt="scope.row.courseName" :src="scope.row.courseLogo" style="float: left; height: 50px; width: auto; vertical-align: middle; border-radius: 5px" />
          <div style="float: left; margin-left: 10px; max-width: 70%">
            <el-link :href="'/course/detail?id=' + scope.row.id" target="_blank">{{ scope.row.courseName }}</el-link>
            <br />
            <span v-if="scope.row.isFree == 1">免费</span>
            <span v-if="scope.row.isFree == 0">
              ￥{{ scope.row.coursePrice }}<span style="text-decoration: line-through; margin-left: 10px">￥{{ scope.row.rulingPrice }}</span>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :min-width="60" label="所属分类/讲师" prop="courseName">
        <template #default="scope">
          <span>
            {{ scope.row.categoryName }}
            <br />
            {{ scope.row.lecturerName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :min-width="50" label="销售量/学习人数" prop="countBuy">
        <template #default="scope">
          <span>{{ scope.row.countBuy }} / {{ scope.row.countStudy }}</span>
        </template>
      </el-table-column>
      <el-table-column :min-width="30" label="售卖">
        <template #default="scope">
          <enum-view :enum-name="'PutawayEnum'" :enum-value="scope.row.isPutaway" />
        </template>
      </el-table-column>
      <el-table-column :min-width="30" label="状态">
        <template #default="scope">
          <enum-view :enum-name="'StatusIdEnum'" :enum-value="scope.row.statusId" />
        </template>
      </el-table-column>
      <el-table-column :width="280" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button v-permission="'user:course'" text type="primary" @click="toCourseRecord(scope.row)">数据</el-button>
          <el-divider direction="vertical" />
          <el-button v-permission="'course:chapter:period'" text type="primary" @click="toCourseChapter(scope.row)">章节</el-button>
          <el-divider direction="vertical" />
          <el-dropdown>
            <el-button text type="primary">
              更多操作
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button v-permission="'course:edit'" text type="primary" @click="toCourseUpdate(scope.row)">编辑</el-button>
                </el-dropdown-item>
                <el-dropdown-item @click="handleStatus(scope.row)">
                  <el-button v-permission="'course:edit'" v-if="scope.row.statusId == 0" text type="primary">启用</el-button>
                  <el-button v-permission="'course:edit'" v-if="scope.row.statusId == 1" text type="primary">禁用</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-permission="'course:delete'" text type="primary" @click="handleDelete(scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage" />
  </div>
</template>

<script setup>
  import useTable from '@/utils/table'
  import Pagination from '@/components/Pagination/index.vue'
  import { courseApi } from '@/api/course'
  import { useRouter } from 'vue-router'
  import EnumView from '@/components/Enum/View/index.vue'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const router = useRouter()

  // 章节管理
  const toCourseChapter = function (row) {
    router.push({ path: '/course/chapter', query: { courseId: row.id } })
  }

  // 课程数据
  const toCourseRecord = function (row) {
    router.push({ path: '/course/record', query: { courseId: row.id } })
  }

  // 添加
  const toCourseAdd = () => {
    router.push({ path: '/course/update' })
  }
  // 修改
  const toCourseUpdate = (item) => {
    router.push({ path: '/course/update', query: { courseId: item.id } })
  }

  // 同步ES
  const handleEs = () => {
    ElMessageBox.confirm('将课程信息同步到ES，用于门户搜索', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }).then(() => {
      courseApi.courseEs().then((res) => {
        ElMessage.success(res)
      })
    })
  }

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus } = useTable({
    page: courseApi.coursePage,
    delete: courseApi.courseDelete,
    status: courseApi.courseEdit,
    sort: courseApi.courseSort
  })
</script>
