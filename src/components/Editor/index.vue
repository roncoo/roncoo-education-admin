<template>
  <div class="editor-container">
    <toolbar :editor="editorRef" :default-config="toolbarConfig" mode="simple" style="border-bottom: 1px solid #ccc" />
    <editor :default-config="editorConfig" :model-value="props.modelValue" style="height: 300px" @on-change="handleChange" @on-created="handleCreated" />
  </div>
  <selector-resource v-if="picVisible" :title="'选择图片'" :resource-type="4" :multiple="true" :visible="picVisible" @close="handleImageCallback" />
  <ai-form v-if="aiVisible" :visible="aiVisible" @close="handleAiCallback" />
</template>

<script setup>
  import '@wangeditor/editor/dist/css/style.css'
  import { onBeforeUnmount, ref, shallowRef } from 'vue'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import { Menus } from './index.js'
  import { registerMenu } from './module/module.js'
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
    registerMenu(editorRef.value, toolbarConfig.value, Menus)
    initMenuEvent(editor)
  }

  const toolbarConfig = ref({
    toolbarKeys: [
      'fontSize',
      '|',
      'bold',
      'italic',
      'underline',
      'through',
      'color',
      'bgColor',
      '|',
      'justifyLeft',
      'justifyRight',
      'justifyCenter',
      'justifyJustify',
      '|',
      'redo',
      'undo',
      'clearStyle',
      '|'
    ]
  })
  const editorConfig = ref({})

  const picVisible = ref(false)
  const aiVisible = ref(false)

  const initMenuEvent = (editor) => {
    editor.on('ImageMenuClick', () => {
      picVisible.value = true
    })
    editor.on('AiMenuClick', () => {
      aiVisible.value = true
    })
  }

  const handleImageCallback = (val) => {
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
  .editor-container {
    border: 1px solid #ccc;
    margin-top: 10px;
    width: 100%;
  }

  .w-e-text-container {
    height: 300px;
  }
</style>
