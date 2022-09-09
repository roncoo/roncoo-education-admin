<template>
  <el-dialog v-model="visible" :append-to-body="true" :title="formModel.data.id ? '节修改' : '节添加'" :width="500" center @close="cloneDialog">
    <el-form ref="ruleForm" :model="formModel.data" :rules="formModel.rules" class="demo-ruleForm" label-width="80px" @submit.prevent>
      <el-form-item class="form-group" label="节名称" prop="chapterName">
        <el-input v-model="formModel.data.chapterName" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item class="form-group" label="描述" prop="chapterDesc">
        <el-input v-model="formModel.data.chapterDesc" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item class="form-group" label="收费" prop="isFree">
        <el-input v-model="formModel.data.isFree" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item class="form-group" label="排序" prop="sort">
        <el-input v-model="formModel.data.sort" maxlength="100" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cloneDialog()">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {ElMessage} from 'element-plus';
import {defineComponent, reactive, ref, toRefs, watch} from 'vue';
import {courseChapterPeriodEdit, courseChapterPeriodSave} from '@/api/course.js';
import editor from '@/components/Wangeditor/index.vue';
import upload from '@/components/Upload/image.vue';

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
    const ruleForm = ref(null);
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
      formModel.data = {
        ...val
      };
    });

    const resetForm = () => {
      ruleForm['value'].resetFields();
      formModel.data = {};
    };

    const cloneDialog = () => {
      visible.value = false;
      emit('update:modelValue', false);
    };

    const onSubmit = () => {
      if (loading.value === true) {
        ElMessage({type: 'warning', message: '正在保存...'});
        return;
      }
      ruleForm['value'].validate(async(valid) => {
        if (valid) {
          loading.value = true;
          let d = null;
          const data = {
            ...formModel.data
          };
          if (data.id) {
            d = await courseChapterPeriodEdit(data);
          } else {
            d = await courseChapterPeriodSave(data);
          }
          if (d) {
            ElMessage({type: 'success', message: data.id ? '修改成功' : '保存成功'});
            emit('updateTable', d);
            cloneDialog();
          }
        }
        loading.value = false;
      });
    };

    return {
      visible,
      loading,
      formModel,
      ruleForm,
      cloneDialog,
      onSubmit
    };
  }
});
</script>


