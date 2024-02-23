<template>
  <div class="dashboard-container">
    <div class="info">
      <p>特别说明：</p>
      <p>1.演示环境仅提供查看功能，本地部署能体验更多功能</p>
      <p>2.可提供有偿指导服务：请联系作者：18302045627（微信同号）</p>
      <p>3.点播平台：私有化选项，属于付费功能，请联系作者：18302045627（微信同号）</p>
    </div>
    <stat-login/>
    <stat-vod/>
  </div>
</template>
<script setup>
import StatVod from './StatVod.vue'
import StatLogin from './StatLogin.vue'
</script>
<style lang="less" scoped>
.info {
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 5px;
  font-size: 16px;
}
</style>