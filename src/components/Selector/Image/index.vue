<template>
  <div style="display: flex; align-items: flex-start">
    <el-image :src="imageUrl" :preview-src-list="[imageUrl]" :style="'width:' + width + ';height:' + height + ';'">
      <template #error>
        <div class="image-slot">
          <el-icon><Picture /></el-icon>
        </div>
      </template>
    </el-image>
    <div class="image-box">
      <el-button type="primary" @click="handleSelect">选择图片</el-button>
      <div class="image-box-info">{{ props.sugImg }}</div>
      <div></div>
    </div>
  </div>
  <selector-resource v-if="picVisible" :title="'选择图片'" :resource-type="4" :visible="picVisible" @close="handleCallback" />
</template>

<script setup>
  import { ref, toRefs, watch } from 'vue'
  import SelectorResource from '@/components/Selector/Resource/index.vue'
  const emit = defineEmits(['update:modelValue'])

  const props = defineProps({
    modelValue: { type: String, default: '' },
    sugImg: { type: String, default: '' },
    width: { type: String, default: '100%' },
    height: { type: String, default: '100%' }
  })

  const picVisible = ref(false)

  // 图片
  const imageUrl = ref()
  const { modelValue } = toRefs(props)
  watch(
    modelValue,
    (newValue) => {
      imageUrl.value = newValue
    },
    {
      immediate: true
    }
  )

  /**
   * 上传成功
   * @param response
   * @param uploadFile
   */
  const handleSelect = () => {
    picVisible.value = true
  }

  const handleCallback = (item) => {
    picVisible.value = false
    emit('update:modelValue', item[0].resourceUrl)
  }
</script>

<style lang="scss" scoped>
  .image-box {
    margin-left: 20px;
    font-size: 12px;
    color: #999;
    .image-box-info {
      margin-top: 20px;
    }
  }

  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
    .el-icon {
      font-size: 30px;
    }
  }
</style>
