<template>
  <div class="title-info">
    <span class="title">视频云使用情况</span>
  </div>
  <div class="cache_pie">
    <div id="cachePieTwo" ref="pieOneRef" class="axis"></div>
    <div id="cachePieOne" ref="pieTwoRef" class="axis"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import {EChartsType} from 'echarts/'
import {onMounted,reactive,ref} from 'vue';
import {statApi} from "@/api/dashboard";


const charts = reactive({
  pieOne:<EChartsType | null>null,
  pieTwo:<EChartsType | null>null
})
const pieOneRef = ref<HTMLElement>()
const pieTwoRef = ref<HTMLElement>()

onMounted(() => {

  if(!charts.pieOne) {
    charts.pieOne = echarts.init(pieOneRef.value)
  }
  if(!charts.pieTwo) {
    charts.pieTwo = echarts.init(pieTwoRef.value)
  }

  statApi.vod().then(res => {
    init1( res)
    init2( res)
  })
})

const init1 = ( data: any) => {
  // 总流量
  const totalFlow = data.totalFlow;
  // 已用流量
  const usedFlow = data.usedFlow ? data.usedFlow.toFixed(2) : 0;
  // 剩余流量
  const surplusFlow = (totalFlow - usedFlow).toFixed(2);
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
      formatter(name: any) {
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
          itemStyle: {
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
          borderWidth: 0.5,
          borderColor: '#fff'
        }
      }
    ]
  };
  // pieOne.setOption(option1)
  charts.pieOne?.setOption(option1)
}

const init2 = (data: any) => {
  // 总空间
  const totalSpace = data.totalSpace;
  // 已用空间
  const usedSpace = data.usedSpace ? data.usedSpace.toFixed(2) : 0;
  // 剩余流量
  const surplusSpace = (totalSpace - usedSpace).toFixed(2);

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
      formatter(name: any) {
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
          itemtype: {
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
          borderWidth: 0.5,
          borderColor: '#fff'
        }
      }
    ]
  };
  charts.pieTwo?.setOption(option2)

}

</script>

<style lang="less" scoped>
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

.title-info {
  margin: 20px 0;
  padding: 5px;
  background-color: #ecf8ff;
  border-left: 5px solid #50bfff;
  border-radius: 4px;
  font-size: 16px;
}
</style>
