<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '修改' : '添加'" width="600px" center align-center :destroy-on-close="true" @close="onClose">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px">
      <el-form-item label="APP上传" prop="updateUrl">
        <el-input v-model="formModel.updateUrl" style="width: 300px"></el-input>
        <upload-app @callback="handleUpload"></upload-app>
      </el-form-item>
      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker v-model="formModel.publishTime" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" type="datetime" placeholder="请选择"></el-date-picker>
      </el-form-item>
      <el-form-item label="应用类型" prop="appType">
        <enum-radio v-model="formModel.appType" :enum-name="'AppTypeEnum'"></enum-radio>
      </el-form-item>
      <el-form-item class="form-group" label="应用版本" prop="appVersion">
        <el-input v-model="formModel.appVersion" maxlength="100" show-word-limit placeholder="格式：1.0.0" />
      </el-form-item>
      <el-form-item label="升级类型" prop="updateForce">
        <enum-radio v-model="formModel.updateForce" :enum-name="'UpdateForceEnum'"></enum-radio>
      </el-form-item>
      <el-form-item label="升级内容" prop="updateTips">
        <el-input v-model="formModel.updateTips" class="form-group" maxlength="500" show-word-limit type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onClose()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
  import { systemApi } from '@/api/system'
  import { reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import EnumRadio from '@/components/Enum/Radio/index.vue'
  import UploadApp from '@/components/Upload/App/index.vue'

  // 校验规则
  const formRef = ref()
  const rules = {
    appVersion: [{ required: true, message: '不能为空', trigger: 'blur' }],
    updateUrl: [{ required: true, message: '不能为空', trigger: 'blur' }]
  }

  // 上传
  const handleUpload = (url) => {
    formModel.updateUrl = url
  }

  // 表单
  const loading = ref(false) // 加载进度状态
  const emit = defineEmits(['refresh'])
  const formDefault = {
    id: undefined,
    updateUrl: '',
    publishTime: '',
    appVersion: '',
    updateTips: '',
    appType: 1,
    updateForce: 1,
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
        await systemApi.appEdit(formModel)
        ElMessage.success('修改成功')
      } else {
        await systemApi.appSave(formModel)
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
    }
    visible.value = true
  }
  defineExpose({ onOpen })
  const onClose = () => {
    visible.value = false
    Object.assign(formModel, formDefault)
  }
</script>
