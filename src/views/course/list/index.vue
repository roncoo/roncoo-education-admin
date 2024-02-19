<template>
  <div class="app-container">
    <div class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item label="课程名称">
            <el-input v-model="query.courseName" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
            <el-button plain type="success" @click="toCourseAdd()">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table v-loading="page.loading" :data="page.list" border>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column :width="120" label="封面">
        <template #default="scope">
          <img :alt="scope.row.courseName" :src="scope.row.courseLogo"/>
        </template>
      </el-table-column>
      <el-table-column label="名称/分类-讲师" prop="courseName">
        <template #default="scope">
          <span><a :href="'/course/'+scope.row.id" target="_blank"> {{ scope.row.courseName }}</a></span><br>
          <span>{{ scope.row.categoryName }} - 【{{ scope.row.lecturerName }}】</span>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="价格">
        <template #default="scope">
          <span v-if="scope.row.isFree == 1">免费</span>
          <span v-if="scope.row.isFree == 0">
            ￥{{ scope.row.coursePrice }} <br><span style="text-decoration:line-through;">￥{{ scope.row.rulingPrice }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column :width="100" label="购买/学习" prop="countBuy">
        <template #default="scope">
          <span>{{ scope.row.countBuy }} / {{ scope.row.countStudy }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="80" label="排序" prop="courseSort"/>
      <el-table-column :width="80" label="售卖">
        <template #default="scope">
          <span :class="{ 'c-special': scope.row.isPutaway === 0 }">{{ getEnumObj('PutawayEnum')[scope.row.isPutaway] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="80" label="状态">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.statusId === 0 }">{{ getEnumObj('StatusIdEnum')[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="280" fixed="right" label="操作" prop="address">
        <template #default="scope">
          <el-button plain type="success" @click="toCourseRecord(scope.row)">数据</el-button>
          <el-button plain type="success" @click="toCourseChapter(scope.row)">章节</el-button>
          <el-dropdown>
            <el-button> 更多操作
              <el-icon class="el-icon--right">
                <arrow-down/>
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button plain type="primary" @click="toCourseUpdate(scope.row)">编辑</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-if="scope.row.statusId == 0" plain type="success" @click="handleStatus(scope.row)">启用</el-button>
                  <el-button v-if="scope.row.statusId == 1" plain type="danger" @click="handleStatus(scope.row)">禁用</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button plain type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage"/>
  </div>
</template>

<script setup lang="ts">
import useTable from '@/utils/table';
import {reactive} from 'vue';
import Pagination from "@/components/Pagination/index.vue";
import {courseApi} from "@/api/course";
import {getEnumObj} from "@/utils/base";
import {useRouter} from "vue-router";

const router = useRouter()

// 章节管理
const toCourseChapter = function (row: any) {
  router.push({path: '/course/chapter', query: {courseId: row.id}});
}

// 课程数据
const toCourseRecord = function (row: any) {
  router.push({path: '/course/record', query: {courseId: row.id}});
}

// 添加
const toCourseAdd = () => {
  router.push({path: '/course/add'})
}
// 修改
const toCourseUpdate = (item: any) => {
  router.push({path: '/course/update', query: {courseId: item.id}})
}

// 基础功能
const {page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus} = reactive({
  ...useTable({
    page: courseApi.coursePage,
    delete: courseApi.courseDelete,
    status: courseApi.courseEdit
  })
})
</script>
