<template>
  <el-dialog :append-to-body="true" :model-value="visible" :title="formModel.id ? '修改' : '添加'" width="900px" center align-center :destroy-on-close="true" @close="onClose">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px" @submit.prevent>
      <el-form-item label="主讲人" prop="lecturerId">
        <el-input v-model="formModel.lecturerName" disabled style="width: 260px; margin-right: 20px"></el-input>
        <el-button type="primary" @click="lecturerSelect">选择讲师</el-button>
      </el-form-item>
      <el-form-item class="form-group" label="课时名称" prop="periodName">
        <el-input v-model="formModel.periodName" maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item class="form-group" label="直播时间">
        <div style="display: flex; flex-direction: row; align-items: center; line-height: 10px">
          <div>开播时间&nbsp;&nbsp;</div>
          <el-date-picker v-model="formModel.beginTime" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" type="datetime" placeholder="请选择"></el-date-picker>
          <div>&nbsp;&nbsp;预计时长(单位：分钟)&nbsp;&nbsp;</div>
          <el-input-number v-model="formModel.liveDuration" />
        </div>
      </el-form-item>
      <el-form-item class="form-group" label="直播延迟" prop="liveDelay">
        <enum-radio v-model="formModel.liveDelay" :enum-name="'LiveDelayEnum'" />
      </el-form-item>
      <el-form-item v-if="coursePrice" class="form-group" label="收费设置" prop="isFree">
        <enum-radio v-model="formModel.isFree" :enum-name="'FreeEnum'" />
      </el-form-item>
      <el-form-item label="直播简介" prop="introduce">
        <editor v-model="formModel.liveIntroduce" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose()">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <select-lecturer v-if="lecturer.visible" @close="handleLecturer" />
</template>

<script setup>
  import { ElMessage } from 'element-plus'
  import { reactive, ref } from 'vue'
  import { courseApi } from '@/api/course'
  import EnumRadio from '@/components/Enum/Radio/index.vue'
  import SelectLecturer from '@/components/Selector/Lecturer/index.vue'
  import Editor from '@/components/Editor/index.vue'

  // 校验规则
  const formRef = ref()
  const rules = {
    periodName: [{ required: true, message: '不能为空', trigger: 'blur' }],
    lecturerId: [{ required: true, message: '不能为空', trigger: 'blur' }]
  }

  const coursePrice = ref(0)
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

  // 表单
  const loading = ref(false) // 加载进度状态
  const emit = defineEmits(['refresh'])
  const formDefault = {
    id: undefined,
    periodName: undefined,
    beginTime: undefined,
    periodType: 20,
    liveDuration: 60,
    liveDelay: 1,
    liveModel: 1,
    isFree: 0
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
        await courseApi.courseChapterPeriodEdit(formModel)
        ElMessage.success('修改成功')
      } else {
        await courseApi.courseChapterPeriodSave(formModel)
        ElMessage.success('添加成功')
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
    formModel.courseId = item.courseId
    formModel.chapterId = item.chapterId
    coursePrice.value = item.coursePrice
    if (item.id) {
      Object.assign(formModel, item.liveViewResp)
      formModel.id = item.id
      formModel.liveId = item.liveId
      formModel.periodName = item.periodName
      formModel.isFree = item.isFree
      formModel.sort = item.sort
    }
    visible.value = true
  }
  defineExpose({ onOpen })
  const onClose = () => {
    visible.value = false
    Object.assign(formModel, formDefault)
  }
</script>
