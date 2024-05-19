<template>
  <div style="border: 1px solid #ccc; margin-top: 10px; width: 100%">
    <toolbar :editor="editorRef" :default-config="toolbarConfig" mode="simple" style="border-bottom: 1px solid #ccc" />
    <editor :default-config="editorConfig" :model-value="props.modelValue" style="height: 300px" @on-change="handleChange" @on-created="handleCreated" />
  </div>
  <selector-resource v-if="picVisible" :title="'选择图片'" :resource-type="4" :multiple="true" :visible="picVisible" @close="handleCallback" />
</template>

<script setup>
  import '@wangeditor/editor/dist/css/style.css'
  import { onBeforeUnmount, ref, shallowRef } from 'vue'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import registerMenu from './index.js'
  import SelectorResource from '@/components/Selector/Resource/index.vue'

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
    // 注册自定义菜单
    registerMenu(editorRef.value, toolbarConfig.value)
    // 注册自定义菜单点击事件
    initMenuEvent()
  }
  const toolbarConfig = ref({
    // https://blog.csdn.net/weixin_62277266/article/details/130645112
    excludeKeys: ['insertLink', 'todo', 'clearStyle', 'emotion', 'group-image', 'insertVideo', 'insertTable', 'redo', 'undo', 'fullScreen']
  })
  const editorConfig = ref({})

  const picVisible = ref(false)
  const initMenuEvent = () => {
    const editor = editorRef.value
    editor.on('PicMenuClick', () => {
      picVisible.value = true
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
</script>
<style lang="scss">
  .w-e-text-container {
    height: 300px;
  }
</style>
