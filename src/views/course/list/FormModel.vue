<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '修改' : '添加'" width="900px" center @close="onClose">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent>
      <el-row>
        <el-col :span="12">
          <el-form-item label="" prop="courseLogo">
            <upload-image :height="180" :image-url="formModel.courseLogo" :width="360" class="avatar" @success=" (val) => {   formModel.courseLogo = val.url;  }"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类" prop="categoryName">
            <el-cascader v-model="formModel['categoryId']" :options="formModel.categoryList" :props="{value: 'id',label: 'categoryName',children: 'childrenList',checkStrictly: true,emitPath: false}" :show-all-levels="false" clearable filterable placeholder="请选择"/>
          </el-form-item>
          <el-form-item label="讲师" prop="lecturerName">
            <el-input v-model="formModel.lecturerName" disabled style="width: 230px; margin-right: 20px"></el-input>
            <el-button plain type="primary" @click="lecturerSelect">选择讲师</el-button>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="售价" prop="coursePrice">
                <el-input-number v-model="formModel.coursePrice" :min="0" :precision="2" show-word-limit></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="划线价" prop="rulingPrice">
                <el-input-number v-model="formModel.rulingPrice" :min="0" :precision="2" show-word-limit></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="排序" prop="courseSort">
                <el-input-number v-model="formModel.courseSort"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="售卖" prop="isPutaway">
                <el-select v-model="formModel.isPutaway" filterable placeholder="请选择">
                  <el-option v-for="item in putawayEnums" :key="item.code" :label="item.desc" :value="item.code"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="21">
          <el-form-item label="名称" prop="courseName">
            <el-input v-model="formModel.courseName" maxlength="100" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="简介" prop="introduce">
        <editor ref="editor" :value="formModel.introduce" @input="handleChangeIntro"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose()">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </span>
    </template>
    <select-lecturer v-if="lecturer.visible" :info="lecturer.info" :visible="lecturer.visible" @close="lecturerCallback"/>
  </el-dialog>
</template>

<script>
import {ElMessage} from 'element-plus';
import {defineComponent, onMounted, reactive, ref, toRefs, watch} from 'vue';

import {courseApi} from '@/api/course.ts';
import editor from '@/components/Wangeditor/index.vue';
import UploadImage from '@/components/Upload/image.vue';
import SelectLecturer from '@/components/Selects/SelectLecturer.vue';
import {getEnum} from '@/utils/base.ts';

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
    const formRef = ref(null);
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
        courseApi.categoryList({categoryType: 1}).then(res => {
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

    onMounted(() => {
      // 获取分类
      listCategory()
      state.putawayEnums = getEnum('PutawayEnum');
    });
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
          if (data.id) {
            d = await courseApi.courseEdit(data);
          } else {
            d = await courseApi.courseSave(data);
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

    const lecturerSelect = () => {
      lecturer.visible = true;
    }

    const lecturerCallback = (info) => {
      lecturer.visible = false
      if (info != null) {
        formModel.lecturerName = info.lecturerName;
        formModel.lecturerId = info.lecturerId;
      }
    }

    // 富文本改变
    const handleChangeIntro = (value) => {
      formModel.introduce = value
    }

    return {
      ...toRefs(state),
      visible,
      loading,
      lecturer,
      formModel,
      formRef,
      onClose,
      onSubmit,
      lecturerSelect,
      lecturerCallback,
      handleChangeIntro
    };
  }
});
</script>


