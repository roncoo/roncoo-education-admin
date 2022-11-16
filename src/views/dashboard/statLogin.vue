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
          // text: '统计'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['登录人数', '注册人数']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: this.data.dateList
        },
        series: [
          {
            name: '登录人数',
            type: 'line',
            data: this.data.loginList
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
