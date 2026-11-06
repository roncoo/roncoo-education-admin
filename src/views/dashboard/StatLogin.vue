<template>
  <el-card class="title-info">
    <template #header>最近14天人数统计</template>
    <div id="axis" class="axis" />
  </el-card>
</template>

<script setup>
  import * as echarts from 'echarts'
  import { onBeforeUnmount, onMounted } from 'vue'
  import { statApi } from '@/api/dashboard'

  let axisRef

  onMounted(() => {
    if (!axisRef) {
      axisRef = echarts.init(document.getElementById('axis'))
    }
    init()
    window.addEventListener('resize', handleResize)
  })

  const handleResize = () => axisRef?.resize()

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    axisRef?.dispose()
    axisRef = null
  })

  const init = async () => {
    const data = await statApi.login()
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['活跃人数', '新增人数'],
        top: 0,
        textStyle: { color: '#64748b' }
      },
      xAxis: {
        type: 'category',
        data: data.dateList,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#e5eaf2' } },
        axisLabel: { color: '#64748b' }
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        splitLine: { lineStyle: { color: '#edf1f6' } },
        axisLabel: { color: '#64748b' }
      },
      series: [
        {
          name: '活跃人数',
          type: 'line',
          data: data.loginList,
          smooth: true,
          showSymbol: false,
          itemStyle: { color: '#2563eb' },
          lineStyle: { color: '#2563eb', width: 2 },
          areaStyle: { color: 'rgba(37, 99, 235, 0.08)' }
        },
        {
          name: '新增人数',
          type: 'line',
          data: data.registerList,
          smooth: true,
          showSymbol: false,
          itemStyle: { color: '#16a34a' },
          lineStyle: { color: '#16a34a', width: 2 }
        }
      ]
    }
    axisRef?.setOption(option)
  }
</script>
<style lang="scss" scoped>
  .axis {
    width: 100%;
    height: 360px;
    margin: 0 auto;
    text-align: center;
  }
  .title-info {
    margin-top: 20px;
    border: 1px solid var(--admin-line);
    border-radius: 10px;
    box-shadow: var(--admin-shadow);

    :deep(.el-card__header) {
      padding: 20px 24px 16px;
      color: var(--admin-ink);
      font-size: 18px;
      font-weight: 650;
      border-bottom-color: var(--admin-line);
    }

    :deep(.el-card__body) {
      padding: 16px 24px 24px;
    }
  }
</style>
