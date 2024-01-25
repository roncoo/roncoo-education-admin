<template>
  <el-upload
      class="avatar-uploader"
      :http-request="onUpload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
    <el-icon v-else class="avatar-uploader-icon">
      <Plus/>
    </el-icon>
  </el-upload>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import type {UploadProps} from 'element-plus'
import {ElMessage} from 'element-plus'
import {Plus} from '@element-plus/icons-vue'
import {uploadApi} from "@/api/upload";

const emit = defineEmits(['success'])
const imageType = "image/jpeg,image/png,image/gif,image/x-icon"
const imageUrl = ref('')

/**
 * 上传
 * @param file
 */
const onUpload = (file: any) => {
  uploadApi.pic(file).then((res: any) => {
    emit("success", res)
  })
}

/**
 * 上传成功
 * @param response
 * @param uploadFile
 */
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

/**
 * 上传前校验
 * @param rawFile
 */
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (imageType.indexOf(rawFile.type) === -1) {
    ElMessage.error('图片格式不正确')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('图片大小不能超过10MB')
    return false
  }
  return true
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
