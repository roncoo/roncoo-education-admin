<template>
  <div style="border: 1px solid #ccc; margin-top: 10px; width: 100%">
    <toolbar
      :editor="editorRef"
      :default-config="toolbarConfig"
      mode="simple"
      style="border-bottom: 1px solid #ccc"
    />
    <editor
      :default-config="editorConfig"
      :model-value="props.modelValue"
      @onChange="handleChange"
      @onCreated="handleCreated"
      style="height: 300px"
    />
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
// 编辑器回调函数
const handleChange = (editor) => {
  emit('update:modelValue', editor.getHtml())
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

// 编辑器实例
const editorRef = shallowRef()
const handleCreated = (editor) => {
  editorRef.value = editor
}
const toolbarConfig = ref({
  // https://blog.csdn.net/weixin_62277266/article/details/130645112
  excludeKeys: [
    'insertLink',
    'todo',
    'clearStyle',
    'emotion',
    'group-image',
    'insertVideo',
    'insertTable',
    'redo',
    'undo',
    'fullScreen'
  ]
})
const editorConfig = ref({})
</script>
<style lang="scss">
.w-e-text-container {
  height: 300px;
}
</style>
