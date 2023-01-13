<template>
  <el-dialog :model-value="visible" :append-to-body="true" :title="formModel.data.id ? '修改' : '添加'" :width="600" center @close="cloneDialog">
    <el-form ref="ruleForm" :model="formModel.data" :rules="formModel.rules" class="demo-ruleForm" label-width="80px" @submit.prevent>
      <el-form-item label="友情名称" prop="linkName">
        <el-input v-model="formModel.data.linkName" maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="友情地址" prop="linkUrl">
        <el-input v-model="formModel.data.linkUrl" maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="跳转方式" prop="linkTarget">
        <el-radio-group v-model="formModel.data.linkTarget">
          <el-radio v-for="item in targetEnums" :key="item.code" :label="item.code">{{ item.desc }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formModel.data.sort"></el-input-number>
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
import {defineComponent, onMounted, reactive, ref, toRefs, watch} from 'vue';
import UploadImage from '@/components/Upload/image.vue';
import editor from '@/components/Wangeditor/index.vue';
import {linkEdit, linkSave} from '@/api/system.js';
import {useStore} from 'vuex';

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
      data: {
        sort: 1
      },
      rules: {
        linkName: [{required: true, message: '不能为空', trigger: 'blur'}],
        linkUrl: [{required: true, message: '不能为空', trigger: 'blur'}],
        linkTarget: [{required: true, message: '不能为空', trigger: 'blur'}]
      }
    });

    let {modelValue, form} = toRefs(props);
    if (modelValue.value) {
      visible.value = modelValue.value;
    }
    const state = reactive({
      targetEnums: {}
    });
    const store = useStore();
    onMounted(() => {
      store.dispatch('GetOpts', {enumName: 'TargetEnum'}).then((res) => {
        state.targetEnums = res;
      });
    });

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
            d = await linkEdit(data);
          } else {
            d = await linkSave(data);
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
      ...toRefs(state),
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
