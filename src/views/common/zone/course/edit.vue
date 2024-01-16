<template>
  <el-dialog :model-value="modelValue" :append-to-body="true" :title="formModel.id ? '修改' : '添加'" :width="500" center @close="cloneDialog">
    <el-form :model="formModel" label-width="80px" @submit.prevent>
      <el-form-item v-if="!formModel.id" class="form-group" label="课程" prop="courseName">
        <el-input v-model="formModel.courseName" disabled style="width: 210px; margin-right: 20px"></el-input>
        <el-button plain type="primary" @click="courseSelect">选择课程</el-button>
      </el-form-item>
      <el-form-item class="form-group" label="排序" prop="sort">
        <el-input-number v-model="formModel.sort"/>
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

<script setup>
import {reactive, ref, toRefs, watch} from 'vue';
import {ElMessage} from 'element-plus';
import {zoneCourseEdit, zoneCourseSave} from '@/api/course';
import SelectCourse from '@/components/Selects/Course/index.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  form: {
    type: Object,
    default: {}
  }
})

const modelValue = ref(props.modelValue)
watch(() => props.modelValue, async(val) => {
  modelValue.value = val
})

const emit = defineEmits(['update:modelValue', 'updateTable'])

const formModel = reactive({})
watch(() => props.form, async(val) => {
  formModel.id = val.id
  formModel.sort = val.sort == undefined ? 1 : val.sort
})

const onSubmit = () => {
  const data = {
    ...formModel
  }
  let d = null;
  if (data.id) {
    d = zoneCourseEdit(data)
  } else {
    d = zoneCourseSave(data)
  }
  if (d) {
    ElMessage({type: 'success', message: data.id ? '修改成功' : '保存成功'})
    emit('updateTable', d)
    cloneDialog()
  }
};

const course = reactive({
  visible: false,
  info: {}
})

const courseSelect = () => {
  course.visible = true;
}

const courseCallback = (info) => {
  course.visible = false
  if (info != null) {
    formModel.courseName = info.courseName;
    formModel.courseId = info.courseId;
  }
}

const cloneDialog = () => {
  modelValue.value = false;
  emit('update:modelValue', false);
};
</script>
