<template>
  <el-dialog :append-to-body="true" :model-value="modelVisible" :title="formModel.id ? '修改' : '添加'" :width="600" center @close="onClose">
    <el-form ref="ruleForm" :model="formModel" :rules="rules" class="demo-ruleForm" label-width="80px" @submit.prevent>
      <el-form-item label="友情名称" prop="linkName">
        <el-input v-model="formModel.linkName" maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="友情地址" prop="linkUrl">
        <el-input v-model="formModel.linkUrl" maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="跳转方式" prop="linkTarget">
        <el-radio-group v-model="formModel.linkTarget">
          <el-radio v-for="item in targetEnums" :key="item.code" :label="item.code">{{ item.desc }}</el-radio>
        </el-radio-group>
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
import {onMounted, ref} from 'vue';
import {systemApi} from '@/api/system';
import {getEnum} from '@/utils/base.ts';

// 打开和关闭
const onOpen = (item: any) => {
  if (item) {
    Object.assign(formModel.value, item);
  }
  modelVisible.value = true
}
defineExpose({onOpen})
const onClose = () => {
  Object.assign(formModel.value, formDefault);
  modelVisible.value = false;
}

// 表单
const formDefault = {
  id: undefined,
  sort: 1
}
const formModel = ref({...formDefault})
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
    if (formModel.value.id) {
      await systemApi.linkEdit(formModel.value);
      ElMessage({type: 'success', message: '修改成功'});
    } else {
      await systemApi.linkSave(formModel.value);
      ElMessage({type: 'success', message: '添加成功'});
    }
    emit('onReload')
    onClose()
  } finally {
    loading.value = false;
  }
}

// 规则
const formRef = ref()
const rules = {
  linkName: [{required: true, message: '不能为空', trigger: 'blur'}],
  linkUrl: [{required: true, message: '不能为空', trigger: 'blur'}],
  linkTarget: [{required: true, message: '不能为空', trigger: 'blur'}]
}

// 枚举
const targetEnums = ref();
onMounted(() => {
  targetEnums.value = getEnum('TargetEnum');
});

const emit = defineEmits(['onReload'])
const modelVisible = ref(false);
const loading = ref(false);
</script>
