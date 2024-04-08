<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="'查看'" width="600px" align-center @close="onClose" :destroy-on-close="true">
    <vue-json-pretty :data="formModel.content"></vue-json-pretty>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onClose()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
  import { reactive, ref } from 'vue'
  import VueJsonPretty from 'vue-json-pretty'
  import 'vue-json-pretty/lib/styles.css'

  // 表单
  const formDefault = {
    id: undefined,
    content: undefined
  }
  const formModel = reactive({ ...formDefault })
  const onSubmit = async () => {
    onClose()
  }

  // 打开和关闭
  const visible = ref(false) // 弹窗显示状态
  const onOpen = (item) => {
    if (item) {
      formModel.id = item.id
      formModel.content = JSON.parse(item.content)
    }
    visible.value = true
  }
  defineExpose({ onOpen })
  const onClose = () => {
    visible.value = false
    Object.assign(formModel, formDefault)
  }
</script>
