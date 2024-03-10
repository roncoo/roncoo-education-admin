<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '节修改' : '节添加'" width="600px" center align-center @close="onClose" :destroy-on-close="true">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent>
      <el-form-item class="form-group" label="节名称" prop="periodName">
        <el-input v-model="formModel.periodName" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item class="form-group" label="资源" prop="resourceName">
        <el-input v-model="formModel.resourceName" disabled style="width: 210px; margin-right: 20px" />
        <el-button plain type="primary" @click="resourceSelect">选择资源</el-button>
      </el-form-item>
      <el-form-item class="form-group" label="设置" prop="isFree">
        <enum-radio v-model="formModel.isFree" :enum-name="'FreeEnum'" />
      </el-form-item>
      <el-form-item class="form-group" label="排序" prop="sort">
        <el-input-number v-model="formModel.sort" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose()">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </span>
    </template>
    <select-resource v-if="resource.visible" :visible="resource.visible" @close="handleResource" />
  </el-dialog>
</template>

<script setup>
  import { ElMessage } from 'element-plus'
  import { reactive, ref } from 'vue'
  import { courseApi } from '@/api/course'
  import EnumRadio from '@/components/Enum/Radio/index.vue'
  import SelectResource from '@/components/Selector/Resource/index.vue'

  // 资源设置
  const resource = ref({
    visible: false
  })

  const resourceSelect = () => {
    resource.value.visible = true
  }

  const handleResource = (item) => {
    resource.value.visible = false
    if (item) {
      formModel.resourceName = item.resourceName
      formModel.resourceId = item.resourceId
    }
  }

  // 校验规则
  const formRef = ref()
  const rules = {
    periodName: [{ required: true, message: '不能为空', trigger: 'blur' }],
    resourceName: [{ required: true, message: '不能为空', trigger: 'blur' }]
  }

  // 表单
  const loading = ref(false) // 加载进度状态
  const emit = defineEmits(['refresh'])
  const formDefault = {
    id: undefined,
    periodName: undefined,
    resourceName: undefined,
    isFree: 1,
    sort: 1
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
  const onOpen = (item, chapterId) => {
    if (item) {
      Object.assign(formModel, item)
      formModel.resourceName = item.resourceViewResp.resourceName
    }
    if (chapterId) {
      formModel.chapterId = chapterId
    }
    visible.value = true
  }
  defineExpose({ onOpen })
  const onClose = () => {
    visible.value = false
    Object.assign(formModel, formDefault)
  }
</script>
