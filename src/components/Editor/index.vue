<template>
  <div style="border: 1px solid #ccc; margin-top: 10px">
    <toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        style="border-bottom: 1px solid #ccc"
    />
    <editor
        :defaultConfig="editorConfig"
        :model-value="props.modelValue"
        @onChange="handleChange"
        class="editors"
    />
  </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css';
import {onBeforeUnmount, shallowRef} from 'vue';
import {Editor, Toolbar} from '@wangeditor/editor-for-vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
// 编辑器回调函数
const handleChange = (editor: any) => {
  emit('update:modelValue', editor.getHtml())
}

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

// 编辑器实例
const editorRef = shallowRef();
const toolbarConfig = {};
const editorConfig = {};
</script>
<style lang="less">
.w-e-text-container {
  width: 500px;
  height: 300px;
  overflow-y: hidden
}
</style>