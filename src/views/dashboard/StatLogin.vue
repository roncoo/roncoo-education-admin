<template>
  <div class="title-info">
    <span class="title">最近14天登录人数</span>
  </div>
  <div id="axis" ref="axisRef" class="axis" />
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, reactive, ref } from 'vue'
import { statApi } from '@/api/dashboard'

const charts = reactive({})
const axisRef = ref()

onMounted(() => {
  if (!charts.axisRef) {
    charts.axisRef = echarts.init(axisRef.value)
  }
  init()
})

const init = async () => {
  const data = await statApi.login()
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'line' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ['登录人数', '注册人数']
    },
    xAxis: {
      type: 'category',
      axisTick: { show: false },
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
  }
  charts.axisRef?.setOption(option)
}
</script>
<style lang="scss" scoped>
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
