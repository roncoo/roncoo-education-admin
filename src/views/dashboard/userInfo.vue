<template>
  <div class="dashboard-container">
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <div :id="id" style="width: 400px;height:300px;" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'
export default {
  name: 'Dashboard',
  filters: {
    timeTransFormat(val = 0) {
      return Math.ceil(val / 60) + '分钟';
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {
      }
    },
    id: {
      type: String,
      default: () => {
        return '';
      }
    }
  },
  data() {
    return {
      myChart: undefined
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  watch: {
    data() {
      if (this.id === 'flow') {
        this.parseFlowOption()
      } else {
        this.parseStorageOption()
      }
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(document.getElementById(this.id), 'light');
    if (this.id === 'flow') {
      this.parseFlowOption()
    } else {
      this.parseStorageOption()
    }
  },
  methods: {
    // 流量
    parseFlowOption() {
      // 转换单位 MiB 转 GiB
      this.data
      var option = {
        title: {
          text: '流量使用情况',
          subtext: '测试中',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['已用', '剩余']
        },
        series: [
          {
            name: '流量使用(GB)',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {value: this.data.usedFlow, name: '已用'},
              {value: this.data.leftFlow, name: '剩余'}
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option);
    },
    // 空间
    parseStorageOption() {
      var option = {
        title: {
          text: '空间使用情况',
          subtext: '测试中',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['已用', '剩余']
        },
        series: [
          {
            name: '空间使用(GB)',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {value: this.data.usedStorage, name: '已用'},
              {value: this.data.leftStorage, name: '剩余'}
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
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
