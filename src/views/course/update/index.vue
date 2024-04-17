<template>
  <div class="form-container">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent style="max-width: 980px">
      <div class="form-main">
        <div class="form-main-title">基础信息</div>
        <div class="form-main-content">
          <el-form-item label="分类" prop="categoryId">
            <cascader-course v-model="formModel.categoryId"></cascader-course>
          </el-form-item>
          <el-form-item label="名称" prop="courseName">
            <el-input v-model="formModel.courseName" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="讲师" prop="lecturerId">
            <el-input v-model="formModel.lecturerName" disabled style="width: 260px; margin-right: 20px"></el-input>
            <el-button type="primary" @click="lecturerSelect">选择讲师</el-button>
          </el-form-item>
          <el-form-item label="封面" prop="courseLogo">
            <selector-image v-model="formModel.courseLogo" :width="'270px'" :height="'150px'" :sug-img="'尺寸：900x500px，格式：JPG、PNG，大小：<2M'" />
          </el-form-item>
          <el-form-item label="简介" prop="introduce">
            <editor v-model="formModel.introduce" />
          </el-form-item>
        </div>
      </div>
      <div class="form-main">
        <div class="form-main-title">课程设置</div>
        <div class="form-main-content">
          <el-form-item class="form-group" label="倍速播放" prop="speedDouble">
            <enum-radio v-model="formModel.speedDouble" :enum-name="'SpeedDoubleEnum'" />
            <span class="tooltip">开启后，用户可在播放页面选择播放速度，默认为1倍速播放。 </span>
          </el-form-item>
          <el-form-item class="form-group" label="拖拽播放" prop="speedDrag">
            <enum-radio v-model="formModel.speedDrag" :enum-name="'SpeedDragEnum'" />
            <span class="tooltip">开启后，用户可在播放页面快速拖拽播放，关闭则无法进行拖拽播放。</span>
          </el-form-item>
          <el-form-item label="销售价" prop="coursePrice">
            <el-input-number v-model="formModel.coursePrice" :min="0" :precision="2" show-word-limit></el-input-number>
          </el-form-item>
          <el-form-item label="划线价" prop="rulingPrice">
            <el-input-number v-model="formModel.rulingPrice" :min="0" :precision="2" show-word-limit></el-input-number>
          </el-form-item>
          <el-form-item label="售卖" prop="isPutaway">
            <enum-radio v-model="formModel.isPutaway" :enum-name="'PutawayEnum'" />
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="form-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="onSubmit()">确定</el-button>
    </div>
  </div>
  <select-lecturer v-if="lecturer.visible" @close="handleLecturer" />
</template>
<script setup>
  import { ElMessage } from 'element-plus'
  import { onMounted, reactive, ref } from 'vue'
  import { courseApi } from '@/api/course'
  import Editor from '@/components/Editor/index.vue'
  import SelectLecturer from '@/components/Selector/Lecturer/index.vue'
  import CascaderCourse from '@/components/Cascader/Course/index.vue'
  import EnumRadio from '@/components/Enum/Radio/index.vue'
  import { useRouter } from 'vue-router'
  import { useRoute } from 'vue-router/dist/vue-router'
  import SelectorImage from '@/components/Selector/Image/index.vue'

  const router = useRouter()

  // 讲师选择功能
  const lecturer = reactive({
    visible: false
  })
  const lecturerSelect = () => {
    lecturer.visible = true
  }
  const handleLecturer = (item) => {
    lecturer.visible = false
    if (item) {
      formModel.lecturerName = item.lecturerName
      formModel.lecturerId = item.lecturerId
    }
  }

  // 校验规则
  const formRef = ref()
  const rules = {
    categoryId: [{ required: true, message: '不能为空', trigger: 'blur' }],
    courseName: [{ required: true, message: '不能为空', trigger: 'blur' }],
    lecturerId: [{ required: true, message: '不能为空', trigger: 'blur' }],
    courseLogo: [{ required: true, message: '不能为空', trigger: 'blur' }]
  }

  // 表单
  const loading = ref(false) // 加载进度状态
  const emit = defineEmits(['refresh'])
  const formDefault = {
    id: undefined,
    categoryId: undefined,
    courseName: undefined,
    lecturerName: undefined,
    lecturerId: undefined,
    courseLogo: undefined,
    introduce: undefined,
    coursePrice: 0,
    rulingPrice: 0,
    isPutaway: 1,
    speedDouble: 1,
    speedDrag: 1
  }
  const formModel = reactive({ ...formDefault })
  const onSubmit = async () => {
    // 校验
    const valid = await formRef.value.validate()
    if (!valid) return

    if (loading.value === true) {
      ElMessage.warning('正在处理···')
      return
    }
    loading.value = true
    try {
      if (formModel.id) {
        await courseApi.courseEdit(formModel)
        ElMessage.success('修改成功')
      } else {
        await courseApi.courseSave(formModel)
        ElMessage.success('添加成功')
      }
      handleClose()
      emit('refresh')
    } finally {
      loading.value = false
    }
  }
  // 初始化
  const route = useRoute()
  onMounted(async () => {
    if (route.query.courseId) {
      const res = await courseApi.courseView({ id: route.query.courseId })
      Object.assign(formModel, res)
    } else {
      Object.assign(formModel, formDefault)
    }
  })
  const handleClose = () => {
    router.go(-1)
  }
</script>
<style lang="scss" scoped>
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
    border-top: 1px solid #ebeef5;
    border-bottom: 10px solid #f2f3f5;
    margin-left: -20px;
    z-index: 9;
  }

  .tooltip {
    margin-left: 20px;
    color: #999;
  }
</style>
