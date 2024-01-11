<template>
  <el-config-provider :locale="locale">
    <router-view/>
  </el-config-provider>
</template>

<script setup>
import locale from 'element-plus/lib/locale/lang/zh-CN'
import {ElConfigProvider} from 'element-plus'
</script>
