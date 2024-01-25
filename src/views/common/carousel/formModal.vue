<template>
  <el-dialog :title="formModel.id ? '修改' : '添加'" :model-value="modelVisible" :append-to-body="true" :width="600" center @close="onClose">
    <el-form :model="formModel" :rules="rules" :label-width="80" ref="formRef" @submit.prevent>
      <el-form-item label="图片" prop="carouselImg">
        <upload-image :height="100" :image-url="formModel.carouselImg" :width="400" class="avatar" @success=" (val) => {   formModel.carouselImg = val.url;  }"/>
      </el-form-item>
      <el-form-item class="form-group" label="描述" prop="carouselTitle">
        <el-input v-model="formModel.carouselTitle" maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <el-form-item class="form-group" label="地址" prop="carouselUrl">
        <el-input v-model="formModel.carouselUrl" maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <el-form-item class="form-group" label="跳转方式" prop="carouselTarget">
        <el-radio-group v-model="formModel.carouselTarget">
          <el-radio v-for="item in targetEnums" :key="item.code" :label="item.code">{{ item.desc }}</el-radio>
        </el-radio-group>
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

<script setup lang="ts">
import {ElMessage} from 'element-plus';
import {onMounted, ref} from 'vue';
import UploadImage from '@/components/Upload/Image/index.vue';
import {systemApi} from '@/api/system';
import {getEnum} from '@/utils/base';

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
  carouselTarget: '_blank',
  sort: 1
})
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
      await systemApi.carouselEdit(formModel.value);
      ElMessage({type: 'success', message: '修改成功'});
    } else {
      await systemApi.carouselSave(formModel.value);
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
  carouselImg: [{required: true, message: '不能为空', trigger: 'blur'}],
  carouselUrl: [{required: true, message: '不能为空', trigger: 'blur'}]
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


