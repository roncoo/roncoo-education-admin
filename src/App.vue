<template>
  <el-config-provider :locale="zhCN">
    <router-view/>
  </el-config-provider>
</template>

<script setup>
import zhCN from 'element-plus/dist/locale/zh-cn.mjs';
import {ElConfigProvider} from 'element-plus'
</script>
