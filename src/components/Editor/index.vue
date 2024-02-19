<template>
  <div style="border: 1px solid #ccc; margin-top: 10px; width: 100%; ">
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

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css';
import {onBeforeUnmount, ref, shallowRef} from 'vue';
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
const handleCreated = (editor: any) => {
  editorRef.value = editor
}
const toolbarConfig = ref({
  excludeKeys: ["emotion", 'group-image', 'group-video', 'insertVideo', 'uploadVideo', 'redo', 'undo', 'fullScreen'],
})
const editorConfig = ref({});
</script>
<style lang="less">
.w-e-text-container {
  height: 300px;
}
</style>