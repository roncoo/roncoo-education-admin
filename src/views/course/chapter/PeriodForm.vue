<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '修改' : '添加'" width="600px" center align-center :destroy-on-close="true" @close="onClose">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent>
      <el-form-item class="form-group" label="课时名称" prop="periodName">
        <el-input v-model="formModel.periodName" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item v-if="coursePrice > 0" class="form-group" label="收费设置" prop="isFree">
        <enum-radio v-model="formModel.isFree" :enum-name="'FreeEnum'" />
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
  import { courseApi } from '@/api/course'
  import EnumRadio from '@/components/Enum/Radio/index.vue'

  // 校验规则
  const formRef = ref()
  const rules = {
    periodName: [{ required: true, message: '不能为空', trigger: 'blur' }]
  }

  // 表单
  const coursePrice = ref(0)
  const loading = ref(false) // 加载进度状态
  const emit = defineEmits(['refresh'])
  const formDefault = {
    id: undefined,
    periodName: undefined,
    periodType: 10,
    isFree: 0
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
      if (formModel.id) {
        await courseApi.courseChapterPeriodEdit(formModel)
        ElMessage.success('修改成功')
      } else {
        await courseApi.courseChapterPeriodSave(formModel)
        ElMessage.success('添加成功')
      }
      emit('refresh')
      onClose()
    } finally {
      loading.value = false
    }
  }

  // 打开和关闭
  const visible = ref(false) // 弹窗显示状态
  const onOpen = (item) => {
    coursePrice.value = item.coursePrice
    if (item) {
      formModel.id = item.id
      formModel.periodName = item.periodName
      formModel.isFree = item.isFree
    }
    visible.value = true
  }
  defineExpose({ onOpen })
  const onClose = () => {
    visible.value = false
    Object.assign(formModel, formDefault)
  }
</script>
