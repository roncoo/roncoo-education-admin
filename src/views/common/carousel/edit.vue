<template>
  <el-dialog :model-value="visible" :append-to-body="true" :title="formModel.data.id ? '修改' : '添加'" :width="600" center @close="cloneDialog">
    <el-form ref="ruleForm" :model="formModel.data" :rules="formModel.rules" class="demo-ruleForm" label-width="80px" @submit.prevent>

      <el-form-item label="图片" prop="carouselHead">
        <upload-image :image-url="formModel.data.carouselImg" :height="100" :width="400" class="avatar" @success=" (val) => {   formModel.data.carouselImg = val.url;  }"/>
      </el-form-item>
      <el-form-item class="form-group" label="说明" prop="carouselTitle">
        <el-input v-model="formModel.data.carouselTitle" maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <el-form-item class="form-group" label="地址" prop="carouselUrl">
        <el-input v-model="formModel.data.carouselUrl" maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <el-form-item class="form-group" label="跳转方式" prop="carouselTarget">
        <el-radio-group v-model="formModel.data.carouselTarget">
          <el-radio v-for="item in targetEnums" :key="item.code" :label="item.code">{{ item.desc }}</el-radio>
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
import UploadImage from '@/components/Upload/image.vue';
import editor from '@/components/Wangeditor/index.vue';
import {carouselEdit, carouselSave} from '@/api/system.js';
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
        carouselUrl: [{required: true, message: '不能为空', trigger: 'blur'}]
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
            d = await carouselEdit(data);
          } else {
            d = await carouselSave(data);
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


