<template>
  <div class="title-info">
    <span class="title">最近14天登录人数</span>
  </div>
  <div id="axis" class="axis"/>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import {onMounted} from "vue";
import {statApi} from "@/api/dashboard";

onMounted(() => {
  init()
})

const init = async () => {
  const myChart = echarts.init(document.getElementById('axis'), 'light');
  const data = await statApi.login();
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'line' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ['登录人数', '注册人数']
    },
    xAxis: {
      type: 'category',
      axisTick: {show: false},
      data: data.dateList
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '登录人数',
        type: 'line',
        data: data.loginList,
        label: {
          show: false,
          position: 'center'
        }
      },
      {
        name: '注册人数',
        type: 'line',
        data: data.registerList
      }

    ]
  };
  myChart.setOption(option)
}
</script>
<style lang="less" scoped>
.axis {
  height: 400px;
}

.title-info {
  margin: 20px 0;
  padding: 5px;
  background-color: #ecf8ff;
  border-left: 5px solid #50bfff;
  border-radius: 4px;
  font-size: 16px;
}
</style>
