<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '修改' : '添加'" width="800px" center align-center @close="onClose" :destroy-on-close="true">
    <el-form ref="formRef" :model="formModel" :rules="rules" @submit.prevent>
      <el-form-item prop="configValue">
        <!-- 文本类型 -->
        <el-input v-if="formModel.contentType === 1" v-model="formModel.configValue" :rows="6" placeholder="请输入内容" type="textarea" />
        <!-- 富文本类型 -->
        <editor v-if="formModel.contentType === 2" v-model="formModel.configValue" />
        <!-- 图片类型 -->
        <upload-image v-if="formModel.contentType === 3" v-model="formModel.configValue" :width="800" />
        <!-- 枚举类型 -->
        <enum-radio v-if="formModel.configKey === 'smsPlatform'" v-model="formModel.configValue" :enum-name="'SmsPlatformEnum'"></enum-radio>
        <enum-radio v-if="formModel.configKey === 'storagePlatform'" v-model="formModel.configValue" :enum-name="'StoragePlatformEnum'"></enum-radio>
        <enum-radio v-if="formModel.configKey === 'vodPlatform'" v-model="formModel.configValue" :enum-name="'VodPlatformEnum'"></enum-radio>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onClose()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ElMessage } from 'element-plus'
  import { reactive, ref } from 'vue'
  import { systemApi } from '@/api/system'
  import Editor from '@/components/Editor/index.vue'
  import UploadImage from '@/components/Upload/Image/index.vue'
  import EnumRadio from '@/components/Enum/Radio/index.vue'

  // 校验规则
  const formRef = ref()
  const rules = {
    configValue: [{ required: true, message: '不能为空', trigger: 'blur' }]
  }

  // 表单
  const loading = ref(false) // 加载进度状态
  const emit = defineEmits(['refresh'])
  const formDefault = {
    id: undefined,
    contentType: undefined,
    configKey: undefined,
    configValue: undefined
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
        await systemApi.sysConfigEdit(formModel)
        ElMessage.success('修改成功')
      } else {
        await systemApi.sysMenuSave(formModel)
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
    if (item) {
      Object.assign(formModel, item)
      if (formModel.contentType === 5) {
        formModel.configValue = parseInt(formModel.configValue)
      }
    }
    visible.value = true
  }
  defineExpose({ onOpen })
  const onClose = () => {
    visible.value = false
    Object.assign(formModel, formDefault)
  }
</script>
<style lang="scss" scoped>
  .image-upload {
    height: 200px !important;
    text-align: center;
    margin: 0 auto;
  }
</style>
