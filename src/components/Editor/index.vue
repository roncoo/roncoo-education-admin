<template>
  <div style="border: 1px solid #ccc; margin-top: 10px">
    <toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        style="border-bottom: 1px solid #ccc"
    />
    <editor
        :defaultConfig="editorConfig"
        :model-value="props.value"
        @onChange="handleChange"
        class="editors"
    />
  </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css';
import {onBeforeUnmount, shallowRef} from 'vue';
import {Editor, Toolbar} from '@wangeditor/editor-for-vue';
import {IToolbarConfig} from '@wangeditor/editor'

const emit = defineEmits(['input'])

const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})

// 编辑器实例
const editorRef = shallowRef();
const toolbarConfig: Partial<IToolbarConfig> = {};
const editorConfig = {};

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

// 编辑器回调函数
const handleChange = (editor: any) => {
  emit('input', editor.getHtml())
}

</script>
<style lang="less">
.w-e-text-container {
  height: 500px;
  width: 500px;
  overflow-y: hidden
}
</style>