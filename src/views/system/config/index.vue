<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabPanes" :label="item.label" :name="item.configType" :key="item.configType">
        <list :list="page.list" @refresh="handlePage"></list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
  import { reactive, ref } from 'vue'
  import List from './List.vue'
  import { systemApi } from '@/api/system'
  import useTable from '@/utils/table'

  // 切换tab
  const handleClick = (tab) => {
    query.configType = tab.props.name
    handlePage()
  }

  const activeName = ref('1')
  // 基础功能
  const { page, handlePage, query } = reactive({
    ...useTable(
      {
        page: systemApi.sysConfigList
      },
      { configType: activeName.value }
    )
  })

  const tabPanes = [
    {
      label: '站点设置',
      configType: '1'
    },
    {
      label: '视频设置',
      configType: '3'
    },
    {
      label: '存储设置',
      configType: '4'
    },
    {
      label: '短信设置',
      configType: '5'
    },
    {
      label: '支付设置',
      configType: '6'
    }
  ]
</script>
