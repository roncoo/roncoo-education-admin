<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '修改' : '添加'" width="600px" center align-center :destroy-on-close="true" @close="onClose">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent>
      <el-form-item label="名称" prop="linkName">
        <el-input v-model="formModel.linkName" maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="linkUrl">
        <el-input v-model="formModel.linkUrl" maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="跳转方式" prop="linkTarget">
        <enum-radio v-model="formModel.linkTarget" :enum-name="'TargetEnum'"></enum-radio>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose()">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
  import { ElMessage } from 'element-plus'
  import { reactive, ref } from 'vue'
  import { systemApi } from '@/api/system'
  import EnumRadio from '@/components/Enum/Radio/index.vue'

  // 规则
  const formRef = ref()
  const rules = {
    linkName: [{ required: true, message: '不能为空', trigger: 'blur' }],
    linkUrl: [{ required: true, message: '不能为空', trigger: 'blur' }],
    linkTarget: [{ required: true, message: '不能为空', trigger: 'blur' }]
  }

  // 表单
  const emit = defineEmits(['refresh'])
  const loading = ref(false)
  const formDefault = {
    id: undefined,
    linkName: undefined,
    linkUrl: undefined,
    linkTarget: 1,
    sort: 1
  }
  const formModel = reactive({ ...formDefault })
  // 提交
  const onSubmit = async () => {
    // 校验
    const valid = await formRef.value.validate()
    if (!valid) return

    if (loading.value === true) {
      ElMessage.warning('正在处理···')
      return
    }
    loading.value = true
    try {
      if (formModel.id) {
        await systemApi.linkEdit(formModel)
        ElMessage.success('修改成功')
      } else {
        await systemApi.linkSave(formModel)
        ElMessage.success('添加成功')
      }
      emit('refresh')
      onClose()
    } finally {
      loading.value = false
    }
  }

  // 打开和关闭
  const visible = ref(false)
  const onOpen = (item) => {
    if (item) {
      Object.assign(formModel, item)
    }
    visible.value = true
  }
  const onClose = () => {
    visible.value = false
    Object.assign(formModel, formDefault)
  }
  defineExpose({ onOpen })
</script>
