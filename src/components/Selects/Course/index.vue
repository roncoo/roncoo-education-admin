<template>
  <el-dialog :model-value="visible" :append-to-body="true" :title="title" width="600px" @close="handleClose">
    <el-form class="filter-container" inline label-width="100px">
      <el-form-item label="课程名称">
        <el-input v-model="queryParams.courseName"/>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" @click="handleQuery">查询</el-button>
        <el-button class="filter-item" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="page.dataList" border element-loading-text="Loading" fit highlight-current-row>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="课程名称" prop="courseName"/>
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button plain type="primary" @click="infoSelect(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page.pageCurrent" :page-size="page.pageSize" :total="page.totalCount" background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange"/>
  </el-dialog>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import {coursePage} from '@/api/course';

const props = defineProps({
  info: {
    type: Object,
    default: () => {
    }
  },
  title: {
    type: String,
    default: '请选择课程'
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close']);

const loading = ref(false);

const page = reactive({
  pageCurrent: 1,
  pageSize: 10,
  totalCount: 0,
  totalPage: 0,
  dataList: []
})

const queryParams = reactive({
  statusId: 1
})

let putawayEnums = reactive({})

function listForPage() {
  loading.value = true
  coursePage(queryParams, page.pageCurrent, page.pageSize).then(res => {
    page.dataList = res.list
    page.pageCurrent = res.pageCurrent
    page.totalCount = res.totalCount
    page.pageSize = res.pageSize
  }).finally(() => {
    loading.value = false
  })
}

function handleQuery() {
  page.pageCurrent = 1;
  listForPage();
}

function handleReset() {
  page.pageCurrent = 1;
  listForPage();
}

function handleSizeChange(size) {
  page.pageSize = size
  page.pageCurrent = 1
  listForPage();
}

function infoSelect(info) {
  emit('close', {courseName: info.courseName, courseId: info.id});
}

function handleCurrentChange(current) {
  page.pageCurrent = current
  listForPage();
}

function handleClose() {
  emit('close');
}

onMounted(() => {
  listForPage();
})
</script>

<style scoped>
.example-showcase .el-loading-mask {
  z-index: 9;
}
</style>
