<template>
  <el-dialog
    :append-to-body="true"
    :model-value="visible"
    :title="formModel.id ? '排序' : '添加'"
    width="600px"
    center
    @close="onClose"
  >
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent>
      <el-form-item v-if="!formModel.id" class="form-group" label="课程" prop="courseName">
        <el-input
          v-model="formModel.courseName"
          disabled
          style="width: 300px; margin-right: 20px"
        ></el-input>
        <el-button plain type="primary" @click="courseSelect">选择课程</el-button>
      </el-form-item>
      <el-form-item class="form-group" label="排序" prop="sort">
        <el-input-number v-model="formModel.sort" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose()">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </span>
    </template>
    <select-course v-if="course.visible" :visible="course.visible" @close="handleCourse" />
  </el-dialog>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { courseApi } from '@/api/course'
import SelectCourse from '@/components/Selector/Course/index.vue'

// 课程设置
const course = ref({
  visible: false
})

const courseSelect = () => {
  course.value.visible = true
}

const handleCourse = (item) => {
  course.value.visible = false
  if (item) {
    formModel.courseName = item.courseName
    formModel.courseId = item.courseId
  }
}

// 校验规则
const formRef = ref()
const rules = {
  carouselImg: [{ required: true, message: '不能为空', trigger: 'blur' }],
  carouselUrl: [{ required: true, message: '不能为空', trigger: 'blur' }]
}

// 表单
const loading = ref(false) // 加载进度状态
const emit = defineEmits(['refresh'])
const formDefault = {
  id: undefined,
  courseName: undefined,
  sort: 1
}
const formModel = reactive({ ...formDefault })
const onSubmit = async () => {
  // 校验
  const valid = await formRef.value.validate()
  if (!valid) return

  if (loading.value === true) {
    ElMessage({ type: 'warning', message: '正在处理···' })
    return
  }
  loading.value = true
  try {
    if (formModel.id) {
      await courseApi.zoneCourseEdit(formModel)
      ElMessage({ type: 'success', message: '修改成功' })
    } else {
      await courseApi.zoneCourseSave(formModel)
      ElMessage({ type: 'success', message: '添加成功' })
    }
    emit('refresh')
    onClose()
  } finally {
    loading.value = false
  }
}

// 打开和关闭
const visible = ref(false) // 弹窗显示状态
const onOpen = (item) => {
  if (item) {
    Object.assign(formModel, item)
  }
  visible.value = true
}
defineExpose({ onOpen })
const onClose = () => {
  visible.value = false
  Object.assign(formModel, formDefault)
}
</script>
