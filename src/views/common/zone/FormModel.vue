<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '修改' : '添加'" width="500px" center @close="onClose">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent>
      <el-form-item class="form-group" label="名称" prop="zoneName">
        <el-input v-model="formModel.zoneName" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item class="form-group" label="描述" prop="zoneDesc">
        <el-input v-model="formModel.zoneDesc" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="statusId">
        <enum-radio v-model="formModel.statusId" :enum-name="'StatusIdEnum'"></enum-radio>
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
import {reactive, ref} from 'vue';
import {courseApi} from '@/api/course';
import EnumRadio from "@/components/Enums/Radio/index.vue";

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
  zoneName: undefined,
  zoneDesc: undefined,
  statusId: undefined,
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
      await courseApi.zoneEdit(formModel);
      ElMessage({type: 'success', message: '修改成功'});
    } else {
      await courseApi.zoneSave(formModel);
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


