<template>
  <el-dialog :model-value="visible" :append-to-body="true" :title="formModel.data.id ? '修改' : '添加'" :width="500" center @close="cloneDialog">
    <el-form ref="ruleForm" :model="formModel.data" :rules="formModel.rules" class="demo-ruleForm" label-width="80px" @submit.prevent>
      <el-form-item class="form-group" label="名称" prop="zoneName">
        <el-input v-model="formModel.data.zoneName" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item class="form-group" label="描述" prop="zoneDesc">
        <el-input v-model="formModel.data.zoneDesc" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="statusId">
        <el-radio-group v-model="formModel.data.statusId">
          <template v-for="item in statusIdEnums" :key="item.code">
            <el-radio :label="item.code">{{ item.desc }}</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="form-group" label="排序" prop="sort">
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
import {useStore} from 'vuex';
import {zoneEdit, zoneSave} from '@/api/course.js';
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
        zoneName: [{required: true, message: '不能为空', trigger: 'blur'}]
      }
    });

    let {modelValue, form} = toRefs(props);
    if (modelValue.value) {
      visible.value = modelValue.value;
    }
    const state = reactive({
      statusIdEnums: {}
    });
    const store = useStore();
    onMounted(() => {
      store.dispatch('GetOpts', {enumName: 'StatusIdEnum'}).then((res) => {
        state.statusIdEnums = res;
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
            d = await zoneEdit(data);
          } else {
            d = await zoneSave(data);
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


