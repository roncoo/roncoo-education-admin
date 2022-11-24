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
    this.myChart = {}
    return {}
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
    parseOption() {
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
          data: this.data.dateList
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '登录人数',
            type: 'line',
            data: this.data.loginList,
            label: {
              show: false,
              position: 'center'
            }
          },
          {
            name: '注册人数',
            type: 'line',
            data: this.data.registerList
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
