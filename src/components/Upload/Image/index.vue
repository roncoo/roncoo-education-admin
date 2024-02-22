<template>
  <el-upload :before-upload="beforeAvatarUpload" :http-request="onUpload" :on-success="handleAvatarSuccess" :show-file-list="false" :style="'width:' + width + 'px;height:' + height + 'px;'" class="image-upload">
    <img class="img-info" v-if="imageUrl" :src="imageUrl"/>
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
  return await uploadApi.pic(file.file)
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

<style lang="less" scoped>
.image-upload {
  position: relative;
  border-radius: 6px;
  border: 1px dashed #d9d9d9;

  .el-upload {
    width: 100%;
    height: 100%;
    display: flex;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    align-items: center;
    justify-content: center;
  }

  .el-progress-circle {
    svg {
      padding: 10px;
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
    }
  }
}
</style>

