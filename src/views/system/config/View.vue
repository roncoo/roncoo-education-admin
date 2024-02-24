<template>
  <el-dialog :before-close="onClose" :model-value="visible" :title="config.configName" center width="800px" :destroy-on-close="true">
    <div class="dialog-content">
      <div v-html="config.configValue" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
  // 打开和关闭
  import { reactive, ref } from 'vue'

  const config = reactive({
    configValue: undefined,
    configName: undefined
  })

  const visible = ref(false) // 弹窗显示状态
  const onOpen = (item) => {
    if (item) {
      Object.assign(config, item)
    }
    visible.value = true
  }
  defineExpose({ onOpen })
  const onClose = () => {
    visible.value = false
    Object.assign(config, {})
  }
</script>
