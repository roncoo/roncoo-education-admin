<template>
  <el-config-provider :locale="zhCN">
    <router-view/>
  </el-config-provider>
</template>

<script setup lang="ts">
import {zhCN} from 'element-plus/dist/locale/zh-cn.min.js'
import {ElConfigProvider} from 'element-plus'
</script>
