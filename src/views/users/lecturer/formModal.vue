<template>
  <el-dialog :append-to-body="true" :model-value="modelVisible" :title="formModel.id ? '修改' : '添加'" :width="800" center @close="onClose">
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
            <upload-image :height="120" :image-url="formModel.lecturerHead" :width="120" class="avatar" @success=" (val) => {   formModel.lecturerHead = val.url;  }"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="简介" prop="introduce">
        <editor ref="editor" :value="formModel.introduce" @input="handleChange"/>
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
import {onMounted, ref,} from 'vue';
import UploadImage from '@/components/Upload/Image/index.vue';
import Editor from '@/components/Wangeditor/index.vue';
import {usersApi} from '@/api/users';
import {getEnum} from '@/utils/base.js';

// 编辑器
const handleChange = (value: string) => {
  formModel.value.introduce = value
}

// 打开和关闭
const onOpen = (item: any) => {
  if (item) {
    Object.assign(formModel.value, item);
  }
  modelVisible.value = true
}
defineExpose({onOpen})
const onClose = () => {
  modelVisible.value = false;
}

// 表单
const formModel = ref({
  id: undefined,
  sort: 1
})
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
    if (formModel.value.id) {
      await usersApi.lecturerEdit(formModel.value);
      ElMessage({type: 'success', message: '修改成功'});
    } else {
      await usersApi.lecturerSave(formModel.value);
      ElMessage({type: 'warning', message: '添加成功'});
    }
    emit('onReload')
    onClose()
  } finally {
    loading.value = false;
  }
};

// 规则
const formRef = ref()
const rules = {
  lecturerName: [{required: true, message: '不能为空', trigger: 'blur'}],
  lecturerPosition: [{required: true, message: '不能为空', trigger: 'blur'}],
  introduce: [{required: true, message: '不能为空', trigger: 'blur'}]
}

const userSexEnums = ref();
onMounted(() => {
  userSexEnums.value = getEnum('UserSexEnum');
});

const emit = defineEmits(['onReload'])
const modelVisible = ref(false);
const loading = ref(false);
</script>


