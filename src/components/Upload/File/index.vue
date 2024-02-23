<template>
  <el-upload
    :before-upload="beforeAvatarUpload"
    :http-request="onUpload"
    :show-file-list="false"
    :multiple="true"
    ref="upload"
  >
    <el-button type="success">上传</el-button>
  </el-upload>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { useUploadStore } from '@/store/modules/upload'

const props = defineProps({
  categoryId: { type: String, default: '' }
})

/**
 * 上传
 * @param file
 */
const onUpload = (file) => {
  // 参数初始化
  const uploadFile = {
    categoryId: props.categoryId,
    file: file.file,
    fileName: file.file.name,
    fileSize: file.file.size,
    uid: file.file.uid,
    status: 'ready',
    progress: 0
  }
  // 资源类型：视频1，音频2，文档3，图片4，压缩文件5
  if (vodType.indexOf(file.file.type) > -1) {
    uploadFile.resourceType = 1
  } else if (audioType.indexOf(file.file.type) > -1) {
    uploadFile.resourceType = 2
  } else if (docType.indexOf(file.file.type) > -1) {
    uploadFile.resourceType = 3
  } else if (imageType.indexOf(file.file.type) > -1) {
    uploadFile.resourceType = 4
  } else if (zipType.indexOf(file.file.type) > -1) {
    uploadFile.resourceType = 5
  } else {
    console.warn(file.file.type)
    ElMessage.error('暂不支持该文件类型：' + file.file.type)
    return false
  }
  useUploadStore().addFile(uploadFile)
}

/* 类型设置 */
const vodType = 'video/mp4,video/avi'
const audioType = 'audio/mpeg,audio/mp3,audio/mp4'
const docType =
  'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/x-xls,text/plain'
const imageType = 'image/jpeg,image/png,image/gif,image/x-icon'
const zipType = 'application/zip,application/gzip,application/x-zip-compressed'

/**
 * 上传前处理
 * @param rawFile
 */
const beforeAvatarUpload = (rawFile) => {
  if (!rawFile) {
    return false
  }
  return true
}
</script>

<style lang="scss" scoped>
.el-button {
  margin-left: 12px;
}
</style>
