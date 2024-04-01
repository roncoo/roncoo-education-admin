<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="'余额变动'" width="600px" center align-center @close="onClose" :destroy-on-close="true">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent>
      <el-form-item class="form-group" label="消费类型" prop="consumeType">
        <enum-radio v-model="formModel.consumeType" :enum-name="'ConsumeTypeEnum'"></enum-radio>
      </el-form-item>
      <el-form-item class="form-group" label="金额大小" prop="consumeAmount">
        <el-input-number v-model="formModel.consumeAmount" :precision="2" :min="0" />
      </el-form-item>
      <el-form-item class="form-group" label="备注" prop="remark">
        <el-input v-model="formModel.remark" />
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
  import EnumRadio from '@/components/Enum/Radio/index.vue'
  import { usersApi } from '@/api/users.js'

  // 校验规则
  const formRef = ref()
  const rules = {
    consumeAmount: [{ required: true, message: '不能为空', trigger: 'blur' }]
  }

  // 表单
  const loading = ref(false) // 加载进度状态
  const emit = defineEmits(['refresh'])
  const formDefault = {
    userId: undefined,
    consumeType: 2,
    consumeAmount: 0
  }
  const formModel = reactive({ ...formDefault })
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
      await usersApi.usersAccountConsumeSave(formModel)
      ElMessage.success('添加成功')
      emit('refresh')
      onClose()
    } finally {
      loading.value = false
    }
  }

  // 打开和关闭
  const visible = ref(false) // 弹窗显示状态
  const onOpen = (userId) => {
    formModel.userId = userId
    visible.value = true
  }
  defineExpose({ onOpen })
  const onClose = () => {
    visible.value = false
    Object.assign(formModel, formDefault)
  }
</script>
