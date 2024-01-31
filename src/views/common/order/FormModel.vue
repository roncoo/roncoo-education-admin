<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '修改' : '添加'" width="500px" center @close="onClose">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent>
      <el-form-item class="form-group" label="备注" prop="remark">
        <el-input v-model="formModel.remark" maxlength="100" show-word-limit></el-input>
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

<script setup lang="ts">
import {ElMessage} from 'element-plus';
import {reactive, ref} from 'vue';
import {systemApi} from '@/api/system';

// 规则
const formRef = ref()
const rules = {
  remark: [{required: true, message: '不能为空', trigger: 'blur'}],
}

// 表单
const emit = defineEmits(['refresh'])
const loading = ref(false);
const formDefault = {
  id: undefined,
  remark: undefined
}
const formModel = reactive({...formDefault})
// 提交
const onSubmit = async () => {
  // 校验
  const valid = await formRef.value.validate()
  if (!valid) return

  if (loading.value === true) {
    ElMessage({type: 'warning', message: '正在处理···'});
    return;
  }
  loading.value = true;
  try {
    if (formModel.id) {
      await systemApi.linkEdit(formModel);
      ElMessage({type: 'success', message: '修改成功'});
    } else {
      await systemApi.linkSave(formModel);
      ElMessage({type: 'success', message: '添加成功'});
    }
    emit('refresh')
    onClose()
  } finally {
    loading.value = false;
  }
}


// 打开和关闭
const visible = ref(false);
const onOpen = (item: any) => {
  if (item) {
    Object.assign(formModel, item);
  }
  visible.value = true
}
const onClose = () => {
  visible.value = false;
  Object.assign(formModel, formDefault);
}
defineExpose({onOpen})
</script>


