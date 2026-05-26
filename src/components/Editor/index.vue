<template>
  <div style="border: 1px solid #ccc; margin-top: 10px; width: 100%">
    <toolbar :editor="editorRef" :default-config="toolbarConfig" mode="simple" style="border-bottom: 1px solid #ccc" />
    <editor :default-config="editorConfig" :model-value="props.modelValue" style="height: 300px" @on-change="handleChange" @on-created="handleCreated" />
  </div>
  <selector-resource v-if="picVisible" :title="'选择图片'" :resource-type="4" :multiple="true" :visible="picVisible" @close="handleCallback" />
  <ai-form v-if="aiVisible" :visible="aiVisible" @close="handleAiCallback" />
</template>

<script setup>
  import '@wangeditor/editor/dist/css/style.css'
  import { onBeforeUnmount, ref, shallowRef } from 'vue'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import registerMenu from './index.js'
  import SelectorResource from '@/components/Selector/Resource/index.vue'
  import AiForm from './module/plugin/ai/AiForm.vue'

  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    }
  })

  const emit = defineEmits(['update:modelValue'])

  const handleChange = (editor) => {
    emit('update:modelValue', editor.getHtml())
  }

  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
  })

  const editorRef = shallowRef()
  const handleCreated = (editor) => {
    editorRef.value = editor
    registerMenu(editorRef.value, toolbarConfig.value)
    initMenuEvent()
  }

  const toolbarConfig = ref({
    excludeKeys: ['insertLink', 'todo', 'clearStyle', 'emotion', 'group-image', 'insertVideo', 'insertTable', 'redo', 'undo', 'fullScreen']
  })
  const editorConfig = ref({})

  const picVisible = ref(false)
  const aiVisible = ref(false)

  const initMenuEvent = () => {
    const editor = editorRef.value
    editor.on('PicMenuClick', () => {
      picVisible.value = true
    })
    editor.on('AiMenuClick', () => {
      aiVisible.value = true
    })
  }

  const handleCallback = (val) => {
    picVisible.value = false
    if (val) {
      const editor = editorRef.value
      val.forEach((item) => {
        editor.insertNode({ type: 'image', src: item.resourceUrl, children: [{ text: '' }] })
      })
    }
  }

  const handleAiCallback = (val) => {
    aiVisible.value = false
    if (val) {
      editorRef.value.restoreSelection()
      editorRef.value.dangerouslyInsertHtml(val)
    }
  }
</script>

<style lang="scss">
  .w-e-text-container {
    height: 300px;
  }
</style>
