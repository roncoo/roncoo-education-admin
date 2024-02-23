<template>
  <el-upload
      :before-upload="beforeAvatarUpload"
      :http-request="onUpload"
      :on-success="handleAvatarSuccess"
      :show-file-list="false"
      ref="upload"
      id="upload"
  >
    <el-button type="success">上传</el-button>
  </el-upload>
</template>

<script setup>
import type {UploadProps} from 'element-plus'
import {ElMessage} from "element-plus";
import polyvUpload from "@/utils/vod/polyv"
import {uploadApi} from "@/api/upload";
import {courseApi} from "@/api/course";

const props = defineProps({
  categoryId: {type: String, default: ''},
});
const vodType = "video/mp4,video/avi"
const emit = defineEmits(['refresh'])


/**
 * 上传
 * @param file
 */
const onUpload = (file) => {
  // 参数初始化
  uploadApi.getVodConfig().then((res) => {
    if (res.vodPlatform == 1) {
      // 私有化上传

    } else if (res.vodPlatform == 2) {
      // 保利威上传
      polyvUpload(file.file, JSON.parse(res.vodUploadConfig), (type: string, data) => {
        if (type === 'FileSucceed') {
          handleResource(data)
          emit("refresh", data)
        } else if (type === 'FileFailed') {
          console.error(data)
          ElMessage.error('上传失败，请重试')
        }
      })
    } else {
      ElMessage.error('暂不支持该上传平台：' + res.vodPlatform)
    }
  })
}

/**
 * 上传成功
 * @param response
 * @param uploadFile
 */
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  emit("refresh", response)
}

/**
 * 上传前校验
 * @param rawFile
 */
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (vodType.indexOf(rawFile.type) === -1) {
    ElMessage.error('视频格式不支持：' + rawFile.type)
    return false
  }
  return true
}

const handleResource = async (data) => {
  await courseApi.resourceSave({
    categoryId: props.categoryId,
    resourceName: data.fileData.filename,
    resourceType: 1,
    resourceSize: data.fileData.size,
    videoVid: data.fileData.vid
  })
  ElMessage.success('上传成功')
}
</script>

<style lang="less" scoped>
.el-button {
  margin-left: 12px;
}
</style>

