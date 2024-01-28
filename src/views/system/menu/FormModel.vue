<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '分类修改' : '分类添加'" width="500px" center @close="onClose">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent>
      <el-form-item label="菜单类型" prop="menuType">
        <enum-radio v-model="formModel.menuType" :enum-name="'MenuTypeEnum'"></enum-radio>
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="formModel.menuName" class="form-group" maxlength="50" show-word-limit/>
      </el-form-item>
      <el-form-item label="路由地址" prop="menuUrl">
        <el-input v-model="formModel.menuUrl" class="form-group" maxlength="50" show-word-limit/>
      </el-form-item>
      <el-form-item label="图标">
        <el-row>
          <el-col :span="12">
            <el-select v-model="formModel.menuIcon" clearable filterable placeholder="请选择">
              <el-option v-for="item in svgIconList" :key="item.icon" :label="item.label" :value="item.icon">
                <span style="margin-right:5px;float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                  <svg-icon :icon-class="item.icon || ''"/>
                </span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="12" style="text-align: left">
            <svg-icon :icon-class="formModel.menuIcon || ''" class-name="icon"/>
          </el-col>
        </el-row>
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
import EnumRadio from "@/components/Enums/Radio/index.vue";

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
  menuType: '',
  menuName: undefined,
  menuUrl: undefined,
  menuIcon: undefined,
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
