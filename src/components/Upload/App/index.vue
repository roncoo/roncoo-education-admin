<template>
  <el-upload id="upload" ref="upload" :before-upload="beforeUpload" :http-request="onUpload" :show-file-list="false">
    <el-button v-loading="loading" type="success">上传</el-button>
    <el-progress v-if="progress > 0 && progress < 100" :percentage="progress" />&nbsp;
    <el-tag v-if="loading && progress === 100" type="warning">处理中</el-tag>
    <el-tag v-if="!loading && progress === 100" type="success">成功</el-tag>
  </el-upload>
</template>

<script setup>
  import { ElMessage } from 'element-plus'
  import { uploadApi } from '@/api/upload'
  import { ref } from 'vue'

  const fileType = 'application/vnd.android.package-archive,ipa'
  const emit = defineEmits(['callback'])
  const progress = ref(0)
  const loading = ref(false)

  /**
   * 上传前校验
   * @param rawFile
   */
  const beforeUpload = (rawFile) => {
    if (fileType.indexOf(rawFile.type) === -1) {
      ElMessage.error('格式不支持：' + rawFile.type)
      return false
    }
    return true
  }

  /**
   * 上传
   * @param file
   */
  const onUpload = (file) => {
    loading.value = true
    uploadApi
      .app(file.file, (p) => {
        progress.value = p
      })
      .then((res) => {
        loading.value = false
        emit('callback', res.docUrl)
      })
  }
</script>

<style lang="scss" scoped>
  .el-button {
    margin-left: 12px;
  }
</style>
