<template>
  <el-dialog :model-value="visible" :append-to-body="true" :title="formModel.data.id ? '修改' : '添加'" :width="800" center @close="cloneDialog">
    <el-form ref="ruleForm" :model="formModel.data" :rules="formModel.rules" class="demo-ruleForm" label-width="80px" @submit.prevent>
      <el-row>
        <el-col :span="12">
          <el-form-item class="form-group" label="名称" prop="lecturerName">
            <el-input v-model="formModel.data.lecturerName" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item class="form-group" label="职位" prop="lecturerPosition">
            <el-input v-model="formModel.data.lecturerPosition" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <!--          <el-form-item class="form-group" label="手机" prop="lecturerMobile">
                      <el-input v-model="formModel.data.lecturerMobile" maxlength="100" show-word-limit></el-input>
                    </el-form-item>-->
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="formModel.data.sort"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="form-group" label="" prop="lecturerHead">
            <upload-image :image-url="formModel.data.lecturerHead" :height="120" :width="120" class="avatar" @success=" (val) => {   formModel.data.lecturerHead = val.url;  }"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="简介" prop="introduce">
        <editor ref="editor" :value="formModel.data.introduce" @input="handleChangeIntro"/>
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
import UploadImage from '@/components/Upload/image.vue';
import editor from '@/components/Wangeditor/index.vue';
import {lecturerEdit, lecturerSave} from '@/api/user.js';

export default defineComponent({
  components: {
    editor, UploadImage
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
        lecturerName: [{required: true, message: '不能为空', trigger: 'blur'}],
        lecturerPosition: [{required: true, message: '不能为空', trigger: 'blur'}],
        introduce: [{required: true, message: '不能为空', trigger: 'blur'}]
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
            d = await lecturerEdit(data);
          } else {
            d = await lecturerSave(data);
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
// 富文本改变
    const handleChangeIntro = (value) => {
      formModel.data.introduce = value
    }
    return {
      visible,
      loading,
      formModel,
      ruleForm,
      cloneDialog,
      onSubmit,
      handleChangeIntro
    };
  }
});
</script>


