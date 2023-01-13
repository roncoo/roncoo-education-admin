<template>
  <el-dialog :title="title" :model-value="visible" width="800px" :before-close="handleClose">
    <div class="dialog-content">
      <div class="" v-html="value"/>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
export default {
  name: 'SysConfigValue',
  props: {
    title: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: null
    }
  },
  emits: ['close-callback'],
  methods: {
    handleClose() {
      this.$emit('close-callback');
    }
  }
};
</script>
