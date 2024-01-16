<template>
  <div class="dashboard-container">
    <div class="info">
      <p>特别说明：</p>
      <p>1.演示环境仅提供查看功能，本地部署能体验更多功能</p>
      <p>2.可提供有偿指导服务：请联系作者：18302045627（微信同号）</p>
      <p>3.点播平台：私有化选项，属于付费功能，请联系作者：18302045627（微信同号）</p>
    </div>
    <login :data="statData"/>
    <vod :data="vodData"/>
  </div>
</template>
<script>
import {statApi} from '@/api/dashboard';
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
      statApi.vod().then(res => {
        this.vodData = res
      })
    },
    getLogin() {
      statApi.login().then(res => {
        this.statData = res
      })
    }
  }
};
</script>

<style lang="less" scoped>
.info {
  margin: 20px 25px;
  padding: 5px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 16px;
}


</style>
