<template>
  <el-dialog :title="formModel.id ? '修改' : '添加'" :model-value="visible" width="600px" center @close="onClose()">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px">
      <el-form-item label="登录账号">
        <el-input v-model="formModel.mobile" class="form-group" disabled/>
      </el-form-item>
      <el-form-item label="用户昵称" prop="realName">
        <el-input v-model="formModel.realName" class="form-group" maxlength="50" show-word-limit/>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formModel.remark" class="form-group" maxlength="500" show-word-limit type="textarea"/>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formModel.sort"></el-input-number>
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
<script setup lang="ts">
import {systemApi} from '@/api/system.js'
import {reactive, ref} from 'vue';
import {ElMessage} from 'element-plus';

// 校验规则
const formRef = ref()
const rules = {
  carouselImg: [{required: true, message: '不能为空', trigger: 'blur'}],
  carouselUrl: [{required: true, message: '不能为空', trigger: 'blur'}]
}

// 表单
const loading = ref(false);// 加载进度状态
const emit = defineEmits(['onReload'])
const formDefault = {
  id: undefined,
  carouselImg: undefined,
  carouselTitle: undefined,
  carouselUrl: undefined,
  carouselTarget: '_blank',
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
    if (FormModel.id) {
      await systemApi.sysUserEdit(FormModel);
      ElMessage({type: 'success', message: '修改成功'});
    } else {
      await systemApi.carouselSave(FormModel);
      ElMessage({type: 'success', message: '添加成功'});
    }
    emit('onReload')
    onClose()
  } finally {
    loading.value = false;
  }
}

// 打开和关闭
const visible = ref(false);// 弹窗显示状态
const onOpen = (item: any) => {
  if (item) {
    Object.assign(FormModel, item);
  }
  visible.value = true
}
defineExpose({onOpen})
const onClose = () => {
  visible.value = false;
  Object.assign(FormModel, formDefault);
}
</script>

