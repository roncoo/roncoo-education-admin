<template>
  <div class="form-container">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent style="max-width: 980px">
      <div class="form-main">
        <div class="form-main-title">基础信息</div>
        <div class="form-main-content">
          <el-form-item label="分类" prop="categoryName">
            <el-cascader v-model="formModel['categoryId']" :options="formModel.categoryList" :props="{value: 'id',label: 'categoryName',children: 'childrenList',checkStrictly: true,emitPath: false}" :show-all-levels="false" clearable filterable placeholder="请选择"/>
          </el-form-item>
          <el-form-item label="名称" prop="courseName">
            <el-input v-model="formModel.courseName" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="讲师" prop="lecturerName">
            <el-input v-model="formModel.lecturerName" disabled style="width: 230px; margin-right: 20px"></el-input>
            <el-button plain type="primary" @click="lecturerSelect">选择讲师</el-button>
          </el-form-item>
          <el-form-item label="封面" prop="courseLogo">
            <upload-image :width="260" :height="130" :image-url="formModel.courseLogo" class="avatar" @success=" (val) => {   formModel.courseLogo = val.url;  }"/>
          </el-form-item>
          <el-form-item label="简介" prop="introduce">
            <editor v-model="formModel.introduce"/>
          </el-form-item>
        </div>
      </div>
      <div class="form-main">
        <div class="form-main-title">课程设置</div>
        <div class="form-main-content">
          <el-form-item label="售价" prop="coursePrice">
            <el-input-number v-model="formModel.coursePrice" :min="0" :precision="2" show-word-limit></el-input-number>
          </el-form-item>
          <el-form-item label="划线价" prop="rulingPrice">
            <el-input-number v-model="formModel.rulingPrice" :min="0" :precision="2" show-word-limit></el-input-number>
          </el-form-item>
          <el-form-item label="排序" prop="courseSort">
            <el-input-number v-model="formModel.courseSort"/>
          </el-form-item>
          <el-form-item label="售卖" prop="isPutaway">
            <enum-radio v-model="formModel.isPutaway" :enum-name="'PutawayEnum'"></enum-radio>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="form-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="onSubmit()">确定</el-button>
    </div>
  </div>

  <select-lecturer v-if="lecturer.visible" :visible="lecturer.visible" @close="handleLecturer"/>
</template>

<script setup lang="ts">
import {ElMessage} from 'element-plus';
import {reactive, ref} from 'vue';
import {courseApi} from '@/api/course'
import UploadImage from '@/components/Upload/Image/index.vue';
import Editor from '@/components/Editor/index.vue'
import SelectLecturer from '@/components/Selects/Lecturer/index.vue'
import EnumRadio from '@/components/Enums/Radio/index.vue'
import {useRouter} from "vue-router";

const router = useRouter()
// 讲师选择
const lecturer = reactive({
  visible: false
})
const lecturerSelect = () => {
  lecturer.visible = true
}
const handleLecturer = (item?: any) => {
  lecturer.visible = false
}

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

const handleClose = () => {
  router.go(-1)
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

<style lang="less">
.form-main-title {
  width: 120px;
}

.form-main-content {
  margin-left: 100px;
  padding-bottom: 60px;
}

.form-footer {
  text-align: center;
  width: calc(100% - 260px);
  position: fixed;
  height: 30px;
  display: flex;
  bottom: 0px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 20px;
  border-top: 1px solid #EBEEF5;
  border-bottom: 10px solid #f2f3f5;
  margin-left: -20px;
}
</style>
