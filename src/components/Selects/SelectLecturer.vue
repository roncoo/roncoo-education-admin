<template>
  <el-dialog :model-value="visible" :append-to-body="true" :title="title" width="600px" @close="handleClose">
    <el-form class="filter-container" inline label-width="100px" size="mini">
      <el-form-item label="讲师名称">
        <el-input v-model="queryParams.lecturerName"/>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" @click="handleQuery">查询</el-button>
        <el-button class="filter-item" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="page.dataList" border element-loading-text="Loading" fit highlight-current-row size="mini">
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="讲师名称" prop="lecturerName"/>
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button plain size="min" type="primary" @click="infoSelect(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :current-page="page.pageCurrent" :page-size="page.pageSize" :total="page.totalCount" background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange"/>
  </el-dialog>
</template>

<script>
import {lecturerPage} from '@/api/user.js';

export default {
  name: 'SelectLecturer',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '请选择讲师'
    },
    info: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      queryParams: {
        statusId: 1
      },
      page: {
        pageCurrent: 1,
        pageSize: 10,
        totalCount: 0,
        totalPage: 0,
        dataList: []
      },
      loading: false
    };
  },
  created() {
    this.listForPage();
  },
  methods: {
    listForPage() {
      this.loading = true;
      lecturerPage(this.queryParams, this.page.pageCurrent, this.page.pageSize).then(res => {
        this.page.dataList = res.list
        this.page.pageCurrent = res.pageCurrent
        this.page.totalCount = res.totalCount
        this.page.pageSize = res.pageSize
      }).finally(() => {
        this.loading = false;
      })
    },
    handleQuery() {
      this.page.pageCurrent = 1;
      this.listForPage();
    },
    handleReset() {
      this.page.pageCurrent = 1;
      this.listForPage();
    },
    handleSizeChange(size) {
      this.page.pageSize = size
      this.page.pageCurrent = 1
      this.listForPage();
    },
    handleCurrentChange(current) {
      this.page.pageCurrent = current
      this.listForPage();
    },
    handleClose() {
      this.$emit('close');
    },
    infoSelect(info) {
      this.$emit('close', {lecturerName: info.lecturerName, lecturerId: info.id});
    }
  }
}
</script>

<style scoped>

</style>
