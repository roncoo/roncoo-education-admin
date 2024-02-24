<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '修改' : '添加'" width="600px" center @close="onClose" :destroy-on-close="true">
    <el-form :model="formModel" :rules="rules" label-width="80px" ref="formRef" @submit.prevent>
      <el-form-item label="轮播广告" prop="carouselImg">
        <upload-image v-model="formModel.carouselImg" :width="520" :height="100" />
      </el-form-item>
      <el-form-item class="form-group" label="跳转地址" prop="carouselUrl">
        <el-input v-model="formModel.carouselUrl" maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <el-form-item class="form-group" label="跳转方式" prop="carouselTarget">
        <enum-radio v-model="formModel.carouselTarget" :enum-name="'TargetEnum'"></enum-radio>
      </el-form-item>
      <el-form-item class="form-group" label="排序" prop="sort">
        <el-input-number v-model="formModel.sort"></el-input-number>
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
  import UploadImage from '@/components/Upload/Image/index.vue'
  import { systemApi } from '@/api/system'
  import EnumRadio from '@/components/Enum/Radio/index.vue'

  // 校验规则
  const formRef = ref()
  const rules = {
    carouselImg: [{ required: true, message: '不能为空', trigger: 'blur' }],
    carouselTarget: [{ required: true, message: '不能为空', trigger: 'blur' }],
    carouselUrl: [{ required: true, message: '不能为空', trigger: 'blur' }]
  }

  // 表单
  const loading = ref(false) // 加载进度状态
  const emit = defineEmits(['refresh'])
  const formDefault = {
    id: undefined,
    carouselImg: undefined,
    carouselTitle: undefined,
    carouselUrl: undefined,
    carouselTarget: 1,
    sort: 1
  }
  const formModel = reactive({ ...formDefault })
  const onSubmit = async () => {
    // 校验
    const valid = await formRef.value.validate()
    if (!valid) return

    if (loading.value === true) {
      ElMessage({ type: 'warning', message: '正在处理···' })
      return
    }
    loading.value = true
    try {
      if (formModel.id) {
        await systemApi.carouselEdit(formModel)
        ElMessage({ type: 'success', message: '修改成功' })
      } else {
        await systemApi.carouselSave(formModel)
        ElMessage({ type: 'success', message: '添加成功' })
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
