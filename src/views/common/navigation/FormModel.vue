<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '修改' : '添加'" width="600px" center @close="onClose()">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent>
      <el-form-item label="导航名称" prop="navTitle">
        <el-input v-model="formModel.navTitle" maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="导航地址" prop="navUrl">
        <el-input v-model="formModel.navUrl" maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="跳转方式" prop="target">
        <enum-radio v-model="formModel.target" :enum-name="'TargetEnum'"></enum-radio>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
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

<script setup lang="ts">
import {ElMessage} from 'element-plus';
import {reactive, ref} from 'vue';
import {systemApi} from '@/api/system';
import EnumRadio from "@/components/Enums/Radio/index.vue";

// 校验规则
const formRef = ref()
const rules = {
  navTitle: [{required: true, message: '不能为空', trigger: 'blur'}],
  navUrl: [{required: true, message: '不能为空', trigger: 'blur'}]
}

// 表单
const loading = ref(false);// 加载进度状态
const emit = defineEmits(['refresh'])
const formDefault = {
  id: undefined,
  navTitle: undefined,
  navUrl: undefined,
  target: '_blank',
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
      await systemApi.navEdit(formModel);
      ElMessage({type: 'success', message: '修改成功'});
    } else {
      await systemApi.navSave(formModel);
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
const onOpen = (item: any) => {
  if (item) {
    Object.assign(formModel, item);
  }
  visible.value = true
}
defineExpose({onOpen})
const onClose = () => {
  visible.value = false;
  Object.assign(formModel, formDefault);
}
</script>
