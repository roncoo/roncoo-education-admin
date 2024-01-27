<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '修改' : '添加'" :width="800" center @close="onClose">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent>
      <el-row>
        <el-col :span="12">
          <el-form-item class="form-group" label="名称" prop="lecturerName">
            <el-input v-model="formModel.lecturerName" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item class="form-group" label="职位" prop="lecturerPosition">
            <el-input v-model="formModel.lecturerPosition" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="formModel.sort"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="form-group" label="" prop="lecturerHead">
            <upload-image v-model="formModel.lecturerHead" :width="120" :height="120"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="简介" prop="introduce">
        <editor v-model="formModel.introduce"/>
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
import {reactive, ref,} from 'vue';
import UploadImage from '@/components/Upload/Image/index.vue';
import Editor from '@/components/Editor/index.vue';
import {usersApi} from '@/api/users';

// 规则
const formRef = ref()
const rules = {
  lecturerName: [{required: true, message: '不能为空', trigger: 'blur'}],
  lecturerPosition: [{required: true, message: '不能为空', trigger: 'blur'}],
  introduce: [{required: true, message: '不能为空', trigger: 'blur'}]
}

// 表单
const emit = defineEmits(['onReload'])
const loading = ref(false);
const formDefault = {
  id: undefined,
  lecturerName: undefined,
  lecturerPosition: undefined,
  lecturerHead: undefined,
  introduce: undefined,
  sort: 1
}
const formModel = reactive({...formDefault})
const onSubmit = async () => {
  // 校验
  const valid = await formRef.value.validate()
  if (!valid) return
  if (loading.value === true) {
    ElMessage({type: 'warning', message: '正在处理...'});
    return;
  }

  loading.value = true;
  try {
    if (formModel.id) {
      await usersApi.lecturerEdit(formModel);
      ElMessage({type: 'success', message: '修改成功'});
    } else {
      await usersApi.lecturerSave(formModel);
      ElMessage({type: 'warning', message: '添加成功'});
    }
    emit('onReload')
    onClose()
  } finally {
    loading.value = false;
  }
};

// 打开和关闭
const visible = ref(false);
const onOpen = (item: any) => {
  if (item) {
    Object.assign(formModel, item);
  }
  visible.value = true
}
defineExpose({onOpen})
const onClose = () => {
  Object.assign(formModel, formDefault);
  visible.value = false;
}
</script>


