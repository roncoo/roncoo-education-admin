<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '分类修改' : '分类添加'" width="500px" center @close="onClose">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent>
      <el-form-item prop="configValue">
        <!-- 文本类型 -->
        <el-input v-if="formModel.contentType === 1" v-model="formModel.configValue" :rows="6" placeholder="请输入内容" type="textarea"/>
        <!-- 富文本类型 -->
        <wangeditor v-if="formModel.contentType === 2" v-model="formModel.configValue" :value="formModel.configValue" @input="(val) => { formModel.configValue = val; }"/>
        <!-- 图片类型 -->
        <upload-image v-if="formModel.contentType === 3" :image-url="formModel.configValue" class="avatar" @success=" (val) => {   formModel.configValue = val.url;  }"/>
        <!-- 枚举类型 -->
        <el-radio-group v-if="formModel.contentType === 5 && formModel.configKey === 'storagePlatform'" v-model="newFormData.configValue">
          <template v-for="(item,index) in storagePlatformEnum" :key="item.code">
            <el-radio :label="'' + item.code">{{ item.desc }}</el-radio>
          </template>
        </el-radio-group>
        <el-radio-group v-if="formModel.contentType === 5 && formModel.configKey === 'smsPlatform'" v-model="formModel.configValue">
          <template v-for="(item,index) in smsPlatformEnum" :key="item.code">
            <el-radio :label="'' + item.code">{{ item.desc }}</el-radio>
          </template>
        </el-radio-group>
        <el-radio-group v-if="formModel.contentType === 5 && formModel.configKey === 'vodPlatform'" v-model="formModel.configValue">
          <template v-for="(item,index) in vodPlatformEnum" :key="item.code">
            <el-radio :label="'' + item.code">{{ item.desc }}</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onClose()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ElMessage} from 'element-plus';
import {reactive, ref} from 'vue';
import {systemApi} from "@/api/system";

// 校验规则
const formRef = ref()
const rules = {
  categoryName: [{required: true, message: '不能为空', trigger: 'blur'}],
}

// 表单
const loading = ref(false);// 加载进度状态
const emit = defineEmits(['onReload'])
const formDefault = {
  id: undefined,
  contentType: undefined,
  configValue: undefined,
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
      await systemApi.sysConfigEdit(formModel);
      ElMessage({type: 'success', message: '修改成功'});
    } else {
      await systemApi.sysMenuSave(formModel);
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
