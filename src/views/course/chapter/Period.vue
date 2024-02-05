<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.chapterId ? '节修改' : '节添加'" width="500px" center @close="onClose">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent>
      <el-form-item class="form-group" label="节名称" prop="periodName">
        <el-input v-model="formModel.periodName" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item class="form-group" label="资源" prop="resourceName">
        <el-input v-model="formModel.resourceName" disabled style="width: 210px; margin-right: 20px"></el-input>
        <el-button plain type="primary" @click="resourceSelect">选择资源</el-button>
      </el-form-item>
      <el-form-item class="form-group" label="收费" prop="isFree">
        <el-radio-group v-model="formModel.isFree">
          <template v-for="item in freeEnums" :key="item.code">
            <el-radio :label="item.code">{{ item.desc }}</el-radio>
          </template>
        </el-radio-group>
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
    <select-resource v-if="resource.visible" :info="resource.info" :visible="resource.visible" @close="resourceCallback"/>
  </el-dialog>
</template>

<script>
import {ElMessage} from 'element-plus';
import {defineComponent, onMounted, reactive, ref, toRefs, watch} from 'vue';

import {courseApi} from '@/api/course';
import upload from '@/components/Upload/Image/index.vue';
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
    const formRef = ref(null);
    const loading = ref(false);
    const state = reactive({
      freeEnums: {}
    });

    onMounted(() => {
      state.freeEnums = getEnum('FreeEnum')
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
          if (data.chapterId) {
            d = await courseApi.courseChapterPeriodEdit(data);
          } else {
            data.chapterId = data.id
            data.id = ''
            data.periodViewRespList = {}
            d = await courseApi.courseChapterPeriodSave(data);
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

    const resourceSelect = () => {
      resource.visible = true;
    }

    const resourceCallback = (info) => {
      resource.visible = false
      console.log(info)
      if (info != null) {
        formModel.resourceName = info.resourceName;
        formModel.resourceId = info.resourceId;
      }
    }

    return {
      ...toRefs(state),
      visible,
      loading,
      formModel,
      formRef,
      onClose,
      onSubmit,
      resource,
      resourceSelect,
      resourceCallback
    };
  }
});
</script>


