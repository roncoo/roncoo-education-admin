<template>
  <div class="app-container">
    <el-form class="filter-container" inline label-width="100px">
      <el-form-item>
        <el-button v-if="checkPermission('system:admin:sys:config:video:init')" plain type="primary" @click="videoInitHandle">视频设置</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="站点设置" name="1">
        <List :list="list" @reset="handleReset"></List>
      </el-tab-pane>
      <el-tab-pane label="视频设置" name="3">
        <List :list="list" @reset="handleReset"></List>
      </el-tab-pane>
      <el-tab-pane label="存储设置" name="4">
        <List :list="list" @reset="handleReset"></List>
      </el-tab-pane>
      <el-tab-pane label="短信设置" name="5">
        <List :list="list" @reset="handleReset"></List>
      </el-tab-pane>
      <el-tab-pane label="支付设置" name="6">
        <List :list="list" @reset="handleReset"></List>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {sysConfigList, videoInit} from '@/api/system';
import List from './list.vue';

export default {
  name: 'SysConfig',
  components: {List},
  data() {
    return {
      activeName: '1',
      list: [],
      map: {
        configType: 1
      }
    };
  },
  mounted() {
    this.listForList();
  },
  methods: {
    handleClick(tab, event) {
      this.map.configType = this.activeName;
      this.listForList();
    },
    listForList() {
      this.loading.start();
      sysConfigList(this.map).then((res) => {
        this.list = res;
      });
    },
    handleReset() {
      this.map.configType = this.activeName;
      this.listForList();
    },
    videoInitHandle() {
      this.$confirm('视频云初始化', '视频云设置', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        videoInit().then((res) => {
          this.$message.success(res);
        });
      });
    }
  }
};
</script>
<style scoped>
img {
  height: 50px;
}

.config {
  border-bottom: 1px solid #eee;
}
</style>
