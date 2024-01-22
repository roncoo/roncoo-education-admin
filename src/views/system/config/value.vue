<template>
  <el-dialog :before-close="handleClose" :model-value="props.visible" :title="props.title" width="800px">
    <div class="dialog-content">
      <div v-html="props.value"/>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
const props = defineProps({
      title: {
        type: String,
        default: null
      },
      value: {
        type: String,
        default: null
      },
      visible: {
        type: Boolean,
        default: false
      }
    }
)

const emit = defineEmits(['close-callback'])

function handleClose() {
  emit('close-callback');
}
</script>
