<template>
  <el-upload ref="upload" :before-upload="beforeAvatarUpload" :http-request="onUpload" :show-file-list="false" :multiple="true">
    <el-button type="primary">上传</el-button>
  </el-upload>
</template>

<script setup>
  import { ElMessage } from 'element-plus'
  import { useUploadStore } from '@/store/modules/upload'
  import { toRefs, watch } from 'vue'
  import bus from '@/utils/bus.js'

  const props = defineProps({
    onBus: { type: Boolean, default: false },
    categoryId: { type: String, default: '' }
  })

  const { onBus } = toRefs(props)

  const emit = defineEmits(['refresh'])
  const refresh = () => {
    emit('refresh')
  }

  watch(
    () => onBus.value,
    (val) => {
      if (val) {
        bus.on('upload-event', refresh)
      } else {
        bus.off('upload-event', refresh)
      }
    },
    {
      immediate: true
    }
  )

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
    // 资源类型：视频1，音频2，文档3，图片4，压缩包5
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
    'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/x-xls,text/plain'
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
