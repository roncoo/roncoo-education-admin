<template>
  <el-dialog :model-value="visible" :append-to-body="true" :title="formModel.data.id ? '修改' : '添加'" :width="900" center @close="cloneDialog">
    <el-form ref="ruleForm" :model="formModel.data" :rules="formModel.rules" class="demo-ruleForm" label-width="80px" @submit.prevent>
      <el-row>
        <el-col :span="12">
          <el-form-item label="" prop="courseLogo">
            <upload-image :image-url="formModel.data.courseLogo" :height="180" :width="360" class="avatar" @success=" (val) => {   formModel.data.courseLogo = val.url;  }"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类" prop="categoryName">
            <el-cascader v-model="formModel.data['categoryId']" :options="formModel.categoryList" :props="{value: 'id',label: 'categoryName',children: 'childrenList',checkStrictly: true,emitPath: false}" filterable clearable placeholder="请选择" :show-all-levels="false"/>
          </el-form-item>
          <el-form-item label="讲师" prop="lecturerName">
            <el-input v-model="formModel.data.lecturerName" disabled style="width: 230px; margin-right: 20px"></el-input>
            <el-button plain type="primary" @click="lecturerSelect">选择讲师</el-button>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="售价" prop="coursePrice">
                <el-input-number v-model="formModel.data.coursePrice" :min="0" :precision="2" show-word-limit></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="划线价" prop="rulingPrice">
                <el-input-number v-model="formModel.data.rulingPrice" :min="0" :precision="2" show-word-limit></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="排序" prop="courseSort">
                <el-input-number v-model="formModel.data.courseSort"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="售卖" prop="isPutaway">
                <el-select v-model="formModel.data.isPutaway" filterable placeholder="请选择">
                  <el-option v-for="item in putawayEnums" :key="item.code" :label="item.desc" :value="item.code"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="21">
          <el-form-item label="名称" prop="courseName">
            <el-input v-model="formModel.data.courseName" maxlength="100" show-word-limit></el-input>
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
    <select-lecturer v-if="lecturer.visible" :visible="lecturer.visible" :info="lecturer.info" @close="lecturerCallback"/>
  </el-dialog>
</template>

<script>
import {ElMessage} from 'element-plus';
import {defineComponent, onMounted, reactive, ref, toRefs, watch} from 'vue';
import {useStore} from 'vuex';
import {categoryList, courseEdit, courseSave} from '@/api/course.js';
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
      categoryList: [],
      data: {},
      rules: {
        nickname: [{required: true, courseName: '请输入课程名称', trigger: 'blur'}]
      }
    });

    // 获取分类列表
    const listCategory = () => {
      return new Promise((resolve, reject) => {
        categoryList({categoryType: 1}).then(res => {
          formModel.categoryList = res
          resolve()
        }).then(() => {
          reject()
        })
      })
    }

    let {modelValue, form} = toRefs(props);
    if (modelValue.value) {
      visible.value = modelValue.value;
    }
    const state = reactive({
      putawayEnums: {}
    });
    const store = useStore();
    onMounted(() => {
      // 获取分类
      listCategory()

      store.dispatch('GetOpts', {enumName: 'PutawayEnum'}).then((res) => {
        state.putawayEnums = res;
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
      if (info != null) {
        formModel.data.lecturerName = info.lecturerName;
        formModel.data.lecturerId = info.lecturerId;
      }
    }

    // 富文本改变
    const handleChangeIntro = (value) => {
      formModel.data.introduce = value
    }

    return {
      ...toRefs(state),
      visible,
      loading,
      lecturer,
      formModel,
      ruleForm,
      cloneDialog,
      onSubmit,
      lecturerSelect,
      lecturerCallback,
      handleChangeIntro
    };
  }
});
</script>


