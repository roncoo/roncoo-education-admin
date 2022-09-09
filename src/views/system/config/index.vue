<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="站点设置" name="1">
        <List :list="list" @reset="handleReset"></List>
      </el-tab-pane>
      <el-tab-pane label="系统设置" name="2">
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
import {sysConfigList} from '@/api/system';
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
