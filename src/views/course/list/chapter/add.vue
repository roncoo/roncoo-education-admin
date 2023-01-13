<template>
  <el-dialog :model-value="visible" :append-to-body="true" :title="formModel.data.chapterId ? '节修改' : '节添加'" :width="500" center @close="cloneDialog">
    <el-form ref="ruleForm" :model="formModel.data" :rules="formModel.rules" class="demo-ruleForm" label-width="80px" @submit.prevent>
      <el-form-item class="form-group" label="节名称" prop="periodName">
        <el-input v-model="formModel.data.periodName" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item class="form-group" label="资源" prop="resourceName">
        <el-input v-model="formModel.data.resourceName" disabled style="width: 210px; margin-right: 20px"></el-input>
        <el-button plain type="primary" @click="resourceSelect">选择资源</el-button>
      </el-form-item>
      <el-form-item class="form-group" label="收费" prop="isFree">
        <el-radio-group v-model="formModel.data.isFree">
          <template v-for="item in freeEnums" :key="item.code">
            <el-radio :label="item.code">{{ item.desc }}</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="form-group" label="排序" prop="sort">
        <el-input-number v-model="formModel.data.sort"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cloneDialog()">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </span>
    </template>
    <select-resource v-if="resource.visible" :visible="resource.visible" :info="resource.info" @close="resourceCallback"/>
  </el-dialog>
</template>

<script>
import {ElMessage} from 'element-plus';
import {defineComponent, onMounted, reactive, ref, toRefs, watch} from 'vue';
import {useStore} from 'vuex';
import {courseChapterPeriodEdit, courseChapterPeriodSave} from '@/api/course.js';
import editor from '@/components/Wangeditor/index.vue';
import upload from '@/components/Upload/image.vue';
import SelectResource from '@/components/Selects/SelectResource.vue';

export default defineComponent({
  components: {
    editor, upload, SelectResource
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
    const state = reactive({
      freeEnums: {}
    });
    const store = useStore();
    onMounted(() => {
      store.dispatch('GetOpts', {enumName: 'FreeEnum'}).then((res) => {
        state.freeEnums = res;
      });
    });
    let resource = reactive({
      visible: false,
      info: {}
    })

    let formModel = reactive({
      data: {},
      rules: {
        periodName: [{required: true, message: '不能为空', trigger: 'blur'}]
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
          if (data.chapterId) {
            d = await courseChapterPeriodEdit(data);
          } else {
            data.chapterId = data.id
            data.id = ''
            data.periodViewRespList = {}
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

    const resourceSelect = () => {
      resource.visible = true;
    }

    const resourceCallback = (info) => {
      resource.visible = false
      console.log(info)
      if (info != null) {
        formModel.data.resourceName = info.resourceName;
        formModel.data.resourceId = info.resourceId;
      }
    }

    return {
      ...toRefs(state),
      visible,
      loading,
      formModel,
      ruleForm,
      cloneDialog,
      onSubmit,
      resource,
      resourceSelect,
      resourceCallback
    };
  }
});
</script>


