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

<script setup lang="ts">
import {ElMessage} from 'element-plus';
import {reactive, ref} from 'vue';
import {courseApi} from "@/api/course";
import UploadImage from '@/components/Upload/Image/index.vue';
import Editor from '@/components/Editor/index.vue'


// 校验规则
const formRef = ref()
const rules = {
  carouselImg: [{required: true, message: '不能为空', trigger: 'blur'}],
  carouselUrl: [{required: true, message: '不能为空', trigger: 'blur'}]
}

// 表单
const loading = ref(false);// 加载进度状态
const emit = defineEmits(['refresh'])
const formDefault = {
  id: undefined,
  carouselImg: undefined,
  carouselTitle: undefined,
  carouselUrl: undefined,
  carouselTarget: '_blank',
  sort: 1
}
const formModel = reactive({...formDefault})
const onSubmit = async () => {
  // 校验
  const valid = await formRef.value.validate()
  if (!valid) return

  if (loading.value === true) {
    ElMessage({type: 'warning', message: '正在处理···'});
    return;
  }
  loading.value = true;
  try {
    if (formModel.id) {
      await courseApi.courseEdit(formModel);
      ElMessage({type: 'success', message: '修改成功'});
    } else {
      await courseApi.courseSave(formModel);
      ElMessage({type: 'success', message: '添加成功'});
    }
    emit('refresh')
    onClose()
  } finally {
    loading.value = false;
  }
}

// 打开和关闭
const visible = ref(false);// 弹窗显示状态
const onOpen = (item: any) => {
  if (item) {
    Object.assign(formModel, item);
  }
  visible.value = true
}
defineExpose({onOpen})
const onClose = () => {
  visible.value = false;
  Object.assign(formModel, formDefault);
}
</script>


