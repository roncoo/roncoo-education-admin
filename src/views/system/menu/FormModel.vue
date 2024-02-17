<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '修改' : '添加'" width="600px" center @close="onClose">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent>
      <el-form-item label="类型" prop="menuType">
        <enum-radio v-model="formModel.menuType" :enum-name="'MenuTypeEnum'"></enum-radio>
      </el-form-item>
      <el-form-item label="名称" prop="menuName">
        <el-input v-model="formModel.menuName" class="form-group" maxlength="50" show-word-limit/>
      </el-form-item>
      <el-form-item v-if="formModel.menuType === 2" label="路径" prop="path">
        <el-input v-model="formModel.path" class="form-group" maxlength="50" show-word-limit/>
      </el-form-item>
      <el-form-item v-if="formModel.menuType === 2" label="组件" prop="path">
        <el-input v-model="formModel.component" class="form-group" maxlength="50" show-word-limit/>
      </el-form-item>
      <el-form-item v-if="formModel.menuType != 1" label="前端权限" prop="path">
        <el-input v-model="formModel.permission" class="form-group" maxlength="50" show-word-limit/>
      </el-form-item>
      <el-form-item v-if="formModel.menuType != 1" label="后端接口" prop="path">
        <el-input v-model="formModel.apis" class="form-group" type="textarea" maxlength="1000" show-word-limit/>
      </el-form-item>
      <el-form-item v-if="formModel.menuType === 2" label="属性" prop="isShow">
        <el-switch v-model="formModel.isShow" inline-prompt active-text="菜单" inactive-text="路由"/>
        <span class="tip-info">当为菜单时，也有路由功能</span>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formModel.sort" :min="0" controls-position="right"/>
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
import {ElMessage} from 'element-plus';
import {reactive, ref} from 'vue';
import {systemApi} from "@/api/system";
import EnumRadio from "@/components/Enum/Radio/index.vue";

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
  menuType: 1,
  menuName: undefined,
  menuUrl: undefined,
  menuIcon: undefined,
  isShow: true,
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
      await systemApi.sysMenuEdit(formModel);
      ElMessage({type: 'success', message: '修改成功'});
    } else {
      await systemApi.sysMenuSave(formModel);
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
