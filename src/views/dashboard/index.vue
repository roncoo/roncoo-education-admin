<template>
  <div class="dashboard-container">
    <div v-if="checkPermission('user:admin:stat:login')" class="title-info">
      <span class="title">最近14天登录人数</span>
      <span style="margin-left: 300px;color: red;">演示环境仅提供查看功能，本地部署能体验更多功能</span>
    </div>
    <login v-if="checkPermission('user:admin:stat:login')" :data="statData"/>
    <div v-if="checkPermission('system:admin:stat:vod')" class="title-info">
      <span class="title">视频云使用情况</span>
    </div>
    <vod v-if="checkPermission('system:admin:stat:vod')" :data="vodData"/>
  </div>
</template>
<script>
import {statVod, statLogin} from '@/api/dashboard.js';
import Vod from './statVod.vue'
import Login from './statLogin.vue'

export default {
  name: 'Dashboard',
  components: {Vod, Login},
  data() {
    return {
      vodData: {},
      statData: {}
    }
  },
  mounted() {
    this.getVod()
    this.getLogin();
  },
  methods: {
    // 统计点播数据
    getVod() {
      statVod().then(res => {
        this.vodData = res
      })
    },
    getLogin() {
      statLogin().then(res => {
        this.statData = res
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.title-info {
  margin: 20px 25px;
  padding: 5px;
  background-color: #ecf8ff;
  border-left: 5px solid #50bfff;
  border-radius: 4px;
  font-size: 16px;
}
</style>
