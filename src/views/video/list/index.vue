<template>
  <div class="app-container">
    <el-form class="filter-container" inline label-width="100px" size="mini">
      <el-form-item class="filter-item" label="视频名称">
        <el-input v-model="params.videoName" clearable/>
      </el-form-item>
      <el-form-item class="filter-item" label="视频VID">
        <el-input v-model="params.videoVid" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="listForPage">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
<!--        <el-button plain size="mini" type="success" @click="handleAddRow">添加</el-button>-->
      </el-form-item>
    </el-form>
    <el-table
      :data="page.list"
      border
      element-loading-text="Loading"
      fit
      highlight-current-row
      size="mini"
    >
      <el-table-column align="center" label="序号" type="index" width="50"/>
      <el-table-column label="视频 / 时长 | VID" prop="videoName">
        <template v-slot="scope">
          {{ scope.row.videoName }}
          <br>
          {{scope.row.videoDuration|timeTransFormat}} | {{scope.row.videoVid}}
        </template>
      </el-table-column>
      <el-table-column label="上传时间 / 大小 | 分辨率" prop="gmtCreate">
      <template v-slot="scope">
        {{ scope.row.gmtCreate }}
        <br>
        {{scope.row.videoSize | sizeTransFormat}} | {{scope.row.videoDefinition}}
      </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template v-slot="scope">
          {{ videoStatusEnums[scope.row.videoStatus] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template v-slot="scope">
<!--          <el-button plain size="mini" type="primary" @click="handleUpdateRow(scope.row.id)">编辑</el-button>-->
          <el-button plain size="mini" type="danger" @click="handleDel(scope.row)">删除</el-button>
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
import {videoDelete, videoPage, videoView} from '@/api/video';

export default {
  name: 'Video',
  components: {},
  filters: {
    timeTransFormat(val = 0) {
      if (!val) {
        return '-'
      }
      // 小时
      let hour = '00';
      if (val >= 3600) {
        hour = val / 3600;
        if (hour < 10) {
          hour = '0' + parseInt(hour);
        }
      }
      // 分钟
      let minute = '00';
      if (val >= 60) {
        minute = (val % 3600) / 60;
        if (minute < 10) {
          minute = '0' + parseInt(minute);
        }
      }
      // 秒
      let second = val % 60;
      if (second < 10) {
        second = '0' + second;
      }
      return hour + ':' + minute + ':' + second;
    },
    sizeTransFormat(val = 0) {
      if (val < 1024) {
        return val + ' KB';
      }
      val = val / 1024;
      if (val < 1024) {
        return val.toFixed(2) + ' MB';
      }
      val = val / 1024;
      if (val < 1024) {
        return val.toFixed(2) + ' GB';
      }
      val = val / 1024;
      if (val < 1024) {
        return val.toFixed(2) + ' TB';
      }
      return val + ' KB';
    }
  },

  data() {
    return {
      params: {},
      page: {
        list: [],
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0
      },
      videoStatusEnums: {},
      passwordCtr: {
        info: {},
        visible: false
      },
      editCtr: {
        info: {},
        visible: false
      },
      addCtr: {
        info: {},
        visible: false
      }
    }
  },
  created() {
    this.listForPage()
  },
  mounted() {
    this.$store.dispatch('GetOpts', {enumName: 'VideoStatusEnum', type: 'obj'}).then(res => {
      this.videoStatusEnums = res;
    });
  },
  methods: {
    handleAddRow() {
      this.addCtr.visible = true;
    },
    handleAddClose() {
      this.addCtr.visible = false;
      this.page.pageCurrent = 1;
      this.listForPage();
    },
    handleUpdateRow(id) {
      videoView(id).then(res => {
        this.editCtr.info = res.data;
        this.editCtr.visible = true;
      })
    },
    handleUpdateClose() {
      this.editCtr.visible = false;
      this.page.pageCurrent = 1;
      this.listForPage();
    },
    handlePasswordRow(id) {
      this.passwordCtr.id = id;
      this.passwordCtr.visible = true;
    },
    handlePasswordClose() {
      this.passwordCtr.visible = false;
      this.page.pageCurrent = 1;
      this.listForPage();
    },
    handleDel(row) {
      this.$confirm('确认要删除该视频【' + row.videoName + '】？请注意删除无法恢复', '删除视频', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        videoDelete(row.id).then(res => {
          this.listForPage();
        })
      })
    },
    handleReset() {
      this.params = {}
      this.page.pageCurrent = 1
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
    listForPage() {
      this.loading.start()
      videoPage(this.params, this.page.pageCurrent, this.page.pageSize).then(res => {
        this.page.list = res.data.records
        this.page.pageCurrent = res.data.current * 1
        this.page.totalCount = res.data.total * 1
        this.page.pageSize = res.data.size * 1
      })
    }
  }
}
</script>
