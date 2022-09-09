<template>
  <el-dialog v-model="visible" :append-to-body="true" :title="formModel.data.id ? '修改' : '添加'" :width="900" center @close="cloneDialog">
    <el-form ref="ruleForm" :model="formModel.data" :rules="formModel.rules" class="demo-ruleForm" label-width="80px" @submit.prevent>
      <el-row>
        <el-col :span="12">
          <el-form-item class="form-group" label="" prop="lecturerHead">
            <upload-image :image-url="formModel.data.courseLogo" :height="180" :width="360" class="avatar" @success=" (val) => {   formModel.data.courseLogo = val.url;  }"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="form-group" label="分类" prop="lecturerName">
            <el-input v-model="formModel.data.categoryName" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item class="form-group" label="讲师" prop="lecturerName">
            <el-input v-model="formModel.data.lecturerName" disabled style="width: 210px; margin-right: 20px"></el-input>
            <el-button plain type="primary" @click="lecturerSelect">选择讲师</el-button>
          </el-form-item>
          <el-form-item class="form-group" label="销售价" prop="lecturerPosition">
            <el-input v-model="formModel.data.coursePrice" type="number" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item class="form-group" label="划线价" prop="lecturerMobile">
            <el-input v-model="formModel.data.rulingPrice" type="number" maxlength="100" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="21">
          <el-form-item label="课程名称" prop="lecturerName">
            <el-input v-model="formModel.data.courseName" maxlength="100" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="简介" prop="introduce">
        <editor ref="editor" :value="formModel.data['introduce']"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cloneDialog()">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </span>
    </template>
    <select-lecturer v-if="lecturer.visible" :visible="lecturer.visible" :info="lecturer.info" @close="lecturerCallback"/>
  </el-dialog>
</template>

<script>
import {ElMessage} from 'element-plus';
import {defineComponent, reactive, ref, toRefs, watch} from 'vue';
import {courseEdit, courseSave} from '@/api/course.js';
import editor from '@/components/Wangeditor/index.vue';
import UploadImage from '@/components/Upload/image.vue';
import SelectLecturer from '@/components/Selects/SelectLecturer.vue';

export default defineComponent({
  components: {
    editor, UploadImage, SelectLecturer
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

    let lecturer = reactive({
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
            d = await courseEdit(data);
          } else {
            d = await courseSave(data);
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

    const lecturerSelect = () => {
      lecturer.visible = true;
    }

    const lecturerCallback = (info) => {
      lecturer.visible = false
      console.log(info)
      if (info != null) {
        formModel.data.lecturerName = info.lecturerName;
        formModel.data.lecturerId = info.lecturerId;
      }
    }

    return {
      visible,
      loading,
      lecturer,
      formModel,
      ruleForm,
      cloneDialog,
      onSubmit,
      lecturerSelect,
      lecturerCallback
    };
  }
});
</script>


