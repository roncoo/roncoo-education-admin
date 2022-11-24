<template>
  <div class="cache_pie">
    <div class="axis" id="cachePieTwo"></div>
    <div class="axis" id="cachePieOne"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'StatVod',
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    data() {
      this.vodOptions()
    }
  },
  data() {
    this.pieOne = {}
    this.pieTwo = {}
    return {}
  },
  mounted() {
    this.pieOne = echarts.init(document.getElementById('cachePieOne'), 'light');
    this.pieTwo = echarts.init(document.getElementById('cachePieTwo'), 'light');
    this.vodOptions();
  },
  methods: {
    vodOptions: function() {
      // 总流量
      const totalFlow = this.data.totalFlow;
      // 已用流量
      const usedFlow = this.data.usedFlow ? this.data.usedFlow.toFixed(2) : 0;
      // 剩余流量
      const surplusFlow = (totalFlow - usedFlow).toFixed(2);
      // 总空间
      const totalSpace = this.data.totalSpace;
      // 已用空间
      const usedSpace = this.data.usedSpace ? this.data.usedSpace.toFixed(2) : 0;
      // 剩余流量
      const surplusSpace = (totalSpace - usedSpace).toFixed(2);
      const option1 = {
        title: {
          text: '流量使用情况',
          subtext: `总流量：${totalFlow}GB`,
          subtextStyle: {
            color: '#FF8C00',
            fontSize: 12
          },
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br />{b}{c}' + 'GB'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          formatter(name) {
            let data = option1.series[0].data;
            let total = 0;
            let tarValue;
            for (let i = 0; i < data.length; i++) {
              total += data[i].value;
              if (data[i].name === name) {
                tarValue = data[i].value;
              }
            }
            const v = tarValue;
            return `${name}${v}GB`;
          }
        },
        series: [
          {
            name: `总流量:${totalFlow}GB`,
            type: 'pie',
            radius: '50%',
            data: [
              {value: usedFlow, name: `已用：`, itemStyle: {color: '#FF8C00'}},
              {value: surplusFlow, name: `剩余：`, itemStyle: {color: '#00bf8f'}}
            ],
            label: {
              normal: {
                show: true,
                position: 'top',
                formatter: '{d}%'
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 0.5,
                borderColor: '#fff'
              }
            }
          }
        ]
      };
      this.pieOne.setOption(option1)

      const option2 = {
        title: {
          text: '空间使用情况',
          subtext: `总空间：${totalSpace}GB`,
          subtextStyle: {
            color: '#FF8C00',
            fontSize: 12
          },
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br />{b}{c}' + 'GB'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          formatter(name) {
            const data = option2.series[0].data;
            let total = 0;
            let tarValue;
            for (let i = 0; i < data.length; i++) {
              total += data[i].value;
              if (data[i].name === name) {
                tarValue = data[i].value;
              }
            }
            const v = tarValue;
            return `${name}${v}GB`;
          }
        },
        series: [
          {
            name: `总空间：${totalSpace}GB`,
            type: 'pie',
            radius: '50%',
            data: [
              {value: usedSpace, name: `已用：`, itemStyle: {color: '#FF8C00'}},
              {value: surplusSpace, name: `剩余：`, itemStyle: {color: '#00bf8f'}}
            ],
            label: {
              normal: {
                show: true,
                // position: 'inner',
                // 自定义显示格式(b:name, c:value, d:百分比)
                formatter: '{d}%'
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 0.5,
                borderColor: '#fff'
              }
            }
          }
        ]
      };
      this.pieTwo.setOption(option2)
    }
  }
}

</script>

<style lang="scss">
.cache_pie {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .axis {
    width: 45%;
    height: 280px;
    display: inline-block;
  }
}
</style>
