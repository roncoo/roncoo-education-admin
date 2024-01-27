<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '修改' : '添加'" :width="500" center @close="onClose">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent>
      <el-form-item class="form-group" label="资源名称" prop="resourceName">
        <el-input v-model="formModel.resourceName" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item class="form-group" label="排序" prop="sort">
        <el-input-number v-model="formModel.sort"/>
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

<script>
import {ElMessage} from 'element-plus';
import {defineComponent, reactive, ref, toRefs, watch} from 'vue';
import editor from '@/components/Wangeditor/index.vue';
import upload from '@/components/Upload/image.vue';
import {courseApi} from '@/api/course';

export default defineComponent({
  components: {
    editor, upload
  },
  props: {
    modelValue: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    form: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  emits: ['update:modelValue', 'updateTable'],
  setup(props, {emit}) {
    const visible = ref(false);
    const formRef = ref(null);
    const loading = ref(false);

    let formModel = reactive({
      data: {},
      rules: {
        //nickname: [{required: true, message: '请输入用户昵称', trigger: 'blur'}]
      }
    });

    let {modelValue, form} = toRefs(props);
    if (modelValue.value) {
      visible.value = modelValue.value;
    }

    // 弹窗是否要打开监控
    watch(modelValue, async(val) => {
      visible.value = val;
    });
    // form 数据监控
    watch(form, async(val) => {
      formModel = {
        ...val
      };
    });

    const resetForm = () => {
      formRef['value'].resetFields();
      formModel = {};
    };

    const onClose = () => {
      visible.value = false;
      emit('update:modelValue', false);
    };

    const onSubmit = () => {
      if (loading.value === true) {
        ElMessage({type: 'warning', message: '正在保存...'});
        return;
      }
      formRef['value'].validate(async(valid) => {
        if (valid) {
          loading.value = true;
          let d = null;
          const data = {
            ...formModel
          };
          if (data.id) {
            d = await courseApi.resourceEdit(data);
          } else {
            d = await courseApi.resourceSave(data);
          }
          if (d) {
            ElMessage({type: 'success', message: data.id ? '修改成功' : '保存成功'});
            emit('updateTable', d);
            onClose();
          }
        }
        loading.value = false;
      });
    };

    return {
      visible,
      loading,
      formModel,
      formRef,
      onClose,
      onSubmit
    };
  }
});
</script>


