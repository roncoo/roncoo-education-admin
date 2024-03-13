<template>
  <div class="app-container">
    <div v-if="query.configType === '3'" class="page_head">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item>
            <el-button v-loading="loading" v-permission="'sys:config:video:init'" @click="vodInit()">视频云初始化</el-button>
            <span style="color: red; font-size: 12px; margin-left: 10px">视频配置完成，请进行初始化处理</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
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
  import { ElMessage } from 'element-plus'

  // 初始化
  const loading = ref(false)
  const vodInit = async () => {
    loading.value = true
    const res = await systemApi.videoInit()
    loading.value = false
    ElMessage.success(res)
  }

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
