<template>
  <div id="axis" class="axis"/>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'StatLogin',
  props: {
    data: {
      type: Object,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      myChart: undefined
    }
  },
  watch: {
    data() {
      this.parseOption()
    }
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById('axis'), 'light');
    this.parseOption()
  },
  methods: {
    parseOption: function() {
      const option = {
        title: {
          //text: '登录人数'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['登录人数']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          axisLabel: {
            interval: 0 // 设置成 0 强制显示所有标签。
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          type: 'value'
        },
        xAxis: {
          axisLabel: {
            interval: 0 // 设置成 0 强制显示所有标签。
          },
          type: 'category',
          data: this.data.dateList
        },
        series: [
          {
            name: '登录人数',
            type: 'line',
            stack: 'line',
            data: this.data.loginList
          }
        ]
      };
      this.myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
.axis {
  height: 400px;
}
</style>
