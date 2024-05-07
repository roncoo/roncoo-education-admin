<template>
  <el-card class="title-info">
    <template #header>最近14天人数统计</template>
    <div id="axis" class="axis" />
  </el-card>
</template>

<script setup>
  import * as echarts from 'echarts'
  import { onMounted } from 'vue'
  import { statApi } from '@/api/dashboard'

  let axisRef

  onMounted(() => {
    if (!axisRef) {
      axisRef = echarts.init(document.getElementById('axis'))
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
        data: ['活跃人数', '新增人数']
      },
      xAxis: {
        type: 'category',
        data: data.dateList
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '活跃人数',
          type: 'line',
          data: data.loginList,
          label: {
            show: false,
            position: 'center'
          }
        },
        {
          name: '新增人数',
          type: 'line',
          data: data.registerList
        }
      ]
    }
    axisRef?.setOption(option)
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
