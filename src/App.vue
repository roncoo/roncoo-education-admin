<template>
  <el-config-provider :locale="zhCn">
    <router-view/>
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import {ElConfigProvider} from 'element-plus'
</script>
