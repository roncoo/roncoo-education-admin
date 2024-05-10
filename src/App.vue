<template>
  <el-config-provider :locale="zhCn">
    <router-view />
    <!-- 上传文件面板 -->
    <upload-file-panel />
  </el-config-provider>
</template>

<script setup>
  import zhCn from 'element-plus/dist/locale/zh-cn.js'
  import { ElConfigProvider } from 'element-plus'
  import UploadFilePanel from '@/components/Upload/File/Panel/index.vue'
</script>
