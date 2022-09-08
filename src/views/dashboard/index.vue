<template>
  <div class="dashboard-container">
    <div class="title-info">
      <span class="title">点播套餐使用情况【账号：{{ statisticsData.email }}】</span>
    </div>
    <pie-vod :data="statisticsData"/>
  </div>
</template>
<script>
import {statVod} from '@/api/dashboard.js';
import pieVod from './pieVod.vue'

export default {
  name: 'Dashboard',
  components: {pieVod},
  data() {
    return {
      statisticsData: {}
    }
  },
  mounted() {
    this.getStatisticsVod()
  },
  methods: {
    // 统计点播数据
    getStatisticsVod() {
      statVod().then(res => {
        console.log(res)
        this.statisticsData = res
      })
    }
  }
};
</script>
<script setup>

</script>

<style lang="scss" scoped>
.title-info {
  margin: 10px 25px;
  padding: 5px;
  background-color: #ecf8ff;
  border-left: 5px solid #50bfff;
  border-radius: 4px;
  font-size: 16px;

  span {
  }

}
</style>
