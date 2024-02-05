<template>
  <el-upload :before-upload="beforeAvatarUpload" :http-request="onUpload" :on-success="handleAvatarSuccess" :show-file-list="false" :style="'width:' + width + 'px;height:' + height + 'px;'" class="image-upload">
    <img v-if="imageUrl" :src="imageUrl"/>
    <el-icon v-else class="image-upload-icon">
      <Plus/>
    </el-icon>
  </el-upload>
</template>

<script setup lang="ts">
import {ref, toRefs, watch} from 'vue'
import type {UploadProps} from 'element-plus'
import {ElMessage} from 'element-plus'
import {uploadApi} from "@/api/upload"

const imageType = "image/jpeg,image/png,image/gif,image/x-icon"
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {type: String, default: ''},
  width: {type: Number, default: 100},
  height: {type: Number, default: 100},
});

// 图片
const imageUrl = ref()
const {modelValue} = toRefs(props)
watch(modelValue,
    (newValue: string) => {
      imageUrl.value = newValue
    },
    {
      immediate: true,
    }
)

/**
 * 上传
 * @param file
 */
const onUpload = async (file: any) => {
  return await uploadApi.pic(file)
}

/**
 * 上传成功
 * @param response
 * @param uploadFile
 */
const handleAvatarSuccess: UploadProps['onSuccess'] = (response: any) => {
  imageUrl.value = response
  emit("update:modelValue", response)
}

/**
 * 上传前校验
 * @param rawFile
 */
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (imageType.indexOf(rawFile.type) === -1) {
    ElMessage.error('图片格式不支持：' + rawFile.type)
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('图片大小不能超过10MB')
    return false
  }
  return true
}
</script>

<style lang="less">
.image-upload {
  position: relative;

  .el-upload, .upload-progress {
    width: 100%;
    height: 100%;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      border-color: #409eff;
    }
  }

  .avatar-uploader-icon {
    width: 100%;
    font-size: 28px;
    line-height: 0;
    color: #8c939d;
    text-align: center;
    height: 0;
    position: absolute;
    top: 50%;
    left: 0;
  }

  .avatar {
    height: 100%;
    display: block;
    margin: 0 auto;
    overflow: hidden;
  }

  .el-progress-circle {
    width: 100% !important;
    height: 100% !important;
    display: flex;
    justify-content: center;

    svg {
      padding: 10px;
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
    }
  }

  .close-dialog {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 6px;

    .avatar-uploader-icon {
      color: #fff;
      font-size: 42px;
    }

    .reset-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -14px;
      margin-left: -40px;
    }
  }

  &:hover {
    .close-dialog {
      display: block;
    }
  }
}
</style>

