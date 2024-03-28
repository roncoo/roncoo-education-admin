<template>
  <el-card class="title-info">
    <template #header>最近14天登录人数</template>
    <div id="axis" ref="axisRef" class="axis" />
  </el-card>
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
    margin: 0 auto;
    text-align: center;
  }
  .title-info {
    margin-top: 20px;
  }
</style>
