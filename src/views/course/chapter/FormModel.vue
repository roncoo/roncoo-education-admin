<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '章修改' : '章添加'" width="500px" center @close="onClose">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent>
      <el-form-item class="form-group" label="章名称" prop="chapterName">
        <el-input v-model="formModel.chapterName" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item class="form-group" label="收费" prop="isFree">
        <el-radio-group v-model="formModel.isFree">
          <template v-for="item in freeEnums" :key="item.code">
            <el-radio :label="item.code">{{ item.desc }}</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="form-group" label="排序" prop="sort">
        <el-input-number v-model="formModel.sort" min="1"/>
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
import {defineComponent, onMounted, reactive, ref, toRefs, watch} from 'vue';

import {courseApi} from '@/api/course.js';
import editor from '@/components/Wangeditor/index.vue';
import upload from '@/components/Upload/image.vue';
import {getEnumObj} from '@/utils/base.ts';

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

    const state = reactive({
      freeEnums: {}
    });

    onMounted(() => {
      state.freeEnums = getEnumObj('FreeEnum')
    });

    let formModel = reactive({
      data: {
        isFree: 1,
        sort: 1
      },
      rules: {
        chapterName: [{required: true, message: '不能为空', trigger: 'blur'}]
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
      FormModel = {
        ...val
      };
    });

    const resetForm = () => {
      formRef['value'].resetFields();
      FormModel = {};
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
            ...FormModel
          };
          if (data.id) {
            d = await courseApi.courseChapterEdit(data);
          } else {
            d = await courseApi.courseChapterSave(data);
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
      ...toRefs(state),
      visible,
      loading,
      FormModel,
      formRef,
      onClose,
      onSubmit
    };
  }
});
</script>


