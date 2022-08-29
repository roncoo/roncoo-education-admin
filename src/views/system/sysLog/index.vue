<template>
  <div class="app-container">
    <el-form v-if="checkPermission('data:boss:boss:log:page')" class="filter-container" inline label-width="100px">
      <el-form-item class="filter-item" label="操作账号">
        <el-input v-model="map.loginName" clearable/>
      </el-form-item>
      <el-form-item class="filter-item" label="IP地址">
        <el-input v-model="map.loginIp" clearable/>
      </el-form-item>
      <el-form-item label="操作时间">
        <el-date-picker
          v-model="gmtCreateValue"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          type="datetimerange"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item class="filter-item" label="">
        <el-button class="filter-item" type="primary" @click="handleQuery">查询</el-button>
        <el-button class="filter-item" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      border
      element-loading-text="Loading"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="操作账号" prop="loginName" width="120"/>
      <el-table-column label="操作日志" prop="operation" width="200"/>
      <el-table-column label="IP地址" prop="loginIp" width="140"/>
      <el-table-column label="操作时间" prop="gmtCreate" width="160"/>
      <el-table-column label="请求方法" prop="method" width="100"/>
      <el-table-column label="请求路径" prop="path" width="300"/>
      <el-table-column label="内容" prop="content">
        <template #default="scope">
          <span v-if="scope.row.content.length < 55" class="overText">{{ scope.row.content }}</span>
          <el-popover v-if="scope.row.content.length > 55" placement="top-start" trigger="hover"
                      width="500px">
            <div class="content_box">{{ scope.row.content }}</div>
            <template #reference>
              <span>{{ scope.row.content.substr(0, 55) + '...' }}</span>
            </template>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page.pageCurrent"
      :page-size="page.pageSize"
      :page-sizes="[20, 50, 100, 200]"
      :total="page.totalCount"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import {sysLogPage} from "@/api/system";

export default {
  name: 'SysLog',
  data() {
    return {
      page: {
        beginPageIndex: 1,
        pageCurrent: 1,
        endPageIndex: 8,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0
      },
      list: [],
      map: {},
      listLoading: true,
      gmtCreateValue: []
    };
  },
  created() {
    this.listForPage()
  },
  methods: {
    handleSizeChange(size) {
      this.page.pageSize = size
      this.page.pageCurrent = 1
      this.listForPage();
    },
    handleCurrentChange(current) {
      this.page.pageCurrent = current
      this.listForPage();
    },
    handleQuery() {
      this.page.pageCurrent = 1;
      this.listForPage();
    },
    handleReset() {
      this.map = {};
      this.gmtCreateValue = [];
      this.page.pageCurrent = 1;
      this.listForPage();
    },
    listForPage() {
      this.loading.start()
      this.map.beginTime = null;
      this.map.endTime = null;
      if (this.gmtCreateValue && this.gmtCreateValue.length > 0) {
        this.map.beginTime = this.gmtCreateValue[0];
        this.map.endTime = this.gmtCreateValue[1];
      }
      sysLogPage(this.map, this.page.pageCurrent, this.page.pageSize).then(res => {
        this.list = res.list
        this.page.pageCurrent = res.pageCurrent
        this.page.totalCount = res.totalCount
        this.page.pageSize = res.pageSize
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.content_box {
  max-height: 400px;
  overflow-y: auto;
}
</style>
