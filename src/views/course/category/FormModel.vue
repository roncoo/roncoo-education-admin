<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '分类修改' : '分类添加'" width="600px" center @close="onClose">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent>
      <el-form-item class="form-group" label="名称" prop="categoryName">
        <el-input v-model="formModel.categoryName" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item class="form-group" label="排序" prop="sort">
        <el-input-number v-model="formModel.sort"/>
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
import {courseApi} from "@/api/course";

// 校验规则
const formRef = ref()
const rules = {
  categoryName: [{required: true, message: '不能为空', trigger: 'blur'}],
}

// 表单
const loading = ref(false);// 加载进度状态
const emit = defineEmits(['refresh'])
const formDefault = {
  id: undefined,
  parentId: '',
  categoryName: undefined,
  sort: 1
}
const formModel = reactive({...formDefault})
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
      await courseApi.categoryEdit(formModel);
      ElMessage({type: 'success', message: '修改成功'});
    } else {
      await courseApi.categorySave(formModel);
      ElMessage({type: 'success', message: '添加成功'});
    }
    emit('refresh')
    onClose()
  } finally {
    loading.value = false;
  }
}

// 打开和关闭
const visible = ref(false);// 弹窗显示状态
const onOpen = (item?: any, parentId?: string) => {
  if (item) {
    Object.assign(formModel, item);
  }
  if (parentId) {
    formModel.parentId = parentId
  }
  visible.value = true
}
defineExpose({onOpen})
const onClose = () => {
  visible.value = false;
  Object.assign(formModel, formDefault);
}
</script>