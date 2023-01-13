<template>
  <el-dialog :model-value="visible" :append-to-body="true" :title="formModel.data.id ? '修改' : '添加'" :width="500" center @close="cloneDialog">
    <el-form ref="ruleForm" :model="formModel.data" :rules="formModel.rules" class="demo-ruleForm" label-width="80px" @submit.prevent>
      <el-form-item class="form-group" label="课程" prop="courseName">
        <el-input v-model="formModel.data.courseName" disabled style="width: 210px; margin-right: 20px"></el-input>
        <el-button plain type="primary" @click="courseSelect">选择课程</el-button>
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
    <select-course v-if="course.visible" :visible="course.visible" :info="course.info" @close="courseCallback"/>
  </el-dialog>
</template>

<script>
import {ElMessage} from 'element-plus';
import {defineComponent, onMounted, reactive, ref, toRefs, watch} from 'vue';
import {useStore} from 'vuex';
import {zoneCourseEdit, zoneCourseSave} from '@/api/course.js';
import editor from '@/components/Wangeditor/index.vue';
import upload from '@/components/Upload/image.vue';
import SelectCourse from '@/components/Selects/SelectCourse.vue';

export default defineComponent({
  components: {
    editor, upload, SelectCourse
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
    let course = reactive({
      visible: false,
      info: {}
    })

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
            d = await zoneCourseEdit(data);
          } else {
            d = await zoneCourseSave(data);
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

    const courseSelect = () => {
      course.visible = true;
    }

    const courseCallback = (info) => {
      course.visible = false
      console.log(info)
      if (info != null) {
        formModel.data.courseName = info.courseName;
        formModel.data.courseId = info.courseId;
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
      course,
      courseSelect,
      courseCallback
    };
  }
});
</script>
