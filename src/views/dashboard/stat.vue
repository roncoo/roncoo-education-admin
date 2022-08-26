<template>
  <div class="dashboard-container">
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <div id="main" style="width: 1000px;height:360px;" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  props: {
    data: {
      type: Object,
      default: () => {
      }
    }
  },
  watch: {
    data() {
      this.parseOption()
    }
  },
  data() {
    return {
      myChart: undefined
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(document.getElementById('main'), 'light');
    this.parseOption()
  },
  methods: {
    parseOption() {
      var option = {
        title: {
          text: '最近7天的播放量',
          subtext: '测试中'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['PC端播放量', '移动端播放量']
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.data.dataList
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'PC端播放量',
            type: 'line',
            data: this.data.pcList
            // markPoint: {
            //   data: [
            //     {type: 'max', name: '最大值'},
            //     {type: 'min', name: '最小值'}
            //   ]
            // }
            // markLine: {
            //   data: [
            //     {type: 'average', name: '平均值'}
            //   ]
            // }
          },
          {
            name: '移动端播放量',
            type: 'line',
            data: this.data.xcxList
            // markPoint: {
            //   data: [
            //     {type: 'max', name: '最大值'},
            //     {type: 'min', name: '最小值'},
            //     {name: '周最低', value: -2, xAxis: 1, yAxis: -1}
            //   ]
            // }
            // markLine: {
            //   data: [
            //     {type: 'average', name: '平均值'},
            //     [{
            //       symbol: 'none',
            //       x: '90%',
            //       yAxis: 'max'
            //     }, {
            //       symbol: 'circle',
            //       label: {
            //         position: 'start',
            //         formatter: '最大值'
            //       },
            //       type: 'max',
            //       name: '最高点'
            //     }]
            //   ]
            // }
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option);
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
